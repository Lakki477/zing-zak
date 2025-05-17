
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/supabase";

export const videoService = {
  getVideos: async (): Promise<Video[]> => {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:user_profiles(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
    
    return data as Video[];
  },
  
  getVideoById: async (id: string): Promise<Video | null> => {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        user:user_profiles(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching video:", error);
      return null;
    }
    
    return data as Video;
  },
  
  uploadVideo: async (
    file: File,
    title: string,
    description: string,
    userId: string,
    thumbnailFile?: File
  ): Promise<{ videoId: string | null; error: string | null }> => {
    try {
      // Upload video file to storage
      const videoFileName = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, file);
      
      if (uploadError) {
        throw new Error(`Error uploading video: ${uploadError.message}`);
      }
      
      // Get video URL
      const { data: videoData } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);
      
      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbnailFileName = `${userId}/${Date.now()}-thumbnail-${thumbnailFile.name}`;
        const { error: thumbnailError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile);
        
        if (!thumbnailError) {
          const { data: thumbnailData } = supabase.storage
            .from('thumbnails')
            .getPublicUrl(thumbnailFileName);
          
          thumbnailUrl = thumbnailData.publicUrl;
        }
      }
      
      // Insert video record
      const { data, error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: userId,
          title,
          description,
          video_url: videoData.publicUrl,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single();
      
      if (insertError) {
        throw new Error(`Error saving video: ${insertError.message}`);
      }
      
      return { videoId: data.id, error: null };
    } catch (error: any) {
      console.error("Error in uploadVideo:", error);
      return { videoId: null, error: error.message };
    }
  },
  
  likeVideo: async (videoId: string): Promise<boolean> => {
    // First, check if the video exists
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .select('likes')
      .eq('id', videoId)
      .single();
    
    if (videoError || !video) {
      console.error("Error fetching video:", videoError);
      return false;
    }
    
    // Increment like count
    const { error } = await supabase
      .from('videos')
      .update({ likes: video.likes + 1 })
      .eq('id', videoId);
    
    if (error) {
      console.error("Error liking video:", error);
      return false;
    }
    
    return true;
  },
};
