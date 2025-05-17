
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create storage buckets if they don't exist
    const buckets = ["videos", "thumbnails", "avatars"];
    
    for (const bucketName of buckets) {
      const { data: existingBucket, error: getBucketError } = await supabaseClient
        .storage
        .getBucket(bucketName);
      
      if (getBucketError && getBucketError.message.includes("The resource was not found")) {
        // Bucket doesn't exist, create it
        const { data, error } = await supabaseClient
          .storage
          .createBucket(bucketName, {
            public: true, // Make the bucket publicly accessible
            fileSizeLimit: bucketName === "videos" ? 1024 * 1024 * 100 : 1024 * 1024 * 10, // 100MB for videos, 10MB for others
          });
        
        if (error) {
          throw new Error(`Failed to create bucket ${bucketName}: ${error.message}`);
        }
        
        console.log(`Created bucket: ${bucketName}`);
      } else if (getBucketError) {
        throw new Error(`Error checking bucket ${bucketName}: ${getBucketError.message}`);
      } else {
        console.log(`Bucket ${bucketName} already exists`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Storage buckets created successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
