
// Create storage buckets for videos and thumbnails
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const createBuckets = async () => {
  // Create videos bucket
  const { error: videosError } = await supabaseAdmin.storage.createBucket(
    'videos',
    { 
      public: true,
      fileSizeLimit: 100000000, // 100MB limit
    }
  )
  
  if (videosError) {
    console.error('Error creating videos bucket:', videosError)
  } else {
    console.log('Videos bucket created successfully')
  }

  // Create thumbnails bucket
  const { error: thumbnailsError } = await supabaseAdmin.storage.createBucket(
    'thumbnails',
    { 
      public: true,
      fileSizeLimit: 5000000, // 5MB limit
    }
  )
  
  if (thumbnailsError) {
    console.error('Error creating thumbnails bucket:', thumbnailsError)
  } else {
    console.log('Thumbnails bucket created successfully')
  }
}

createBuckets()
