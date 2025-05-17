
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/supabase";

export const profileService = {
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    return data as UserProfile;
  },
  
  updateProfile: async (
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error: string | null }> => {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, error: null };
  },
  
  uploadAvatar: async (
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: string | null }> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);
      
      if (uploadError) {
        throw new Error(`Error uploading avatar: ${uploadError.message}`);
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);
      
      if (updateError) {
        throw new Error(`Error updating profile: ${updateError.message}`);
      }
      
      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      console.error("Error in uploadAvatar:", error);
      return { url: null, error: error.message };
    }
  },
};
