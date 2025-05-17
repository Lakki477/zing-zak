
import { useState } from "react";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { UserProfile } from "@/types/supabase";
import { profileService } from "@/services/profileService";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface EditProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (formData: any) => void;
  isLoading: boolean;
}

const EditProfileDrawer = ({ 
  open, 
  onClose, 
  profile, 
  onSave, 
  isLoading 
}: EditProfileDrawerProps) => {
  const [username, setUsername] = useState(profile.username || "");
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    
    try {
      setUploadingAvatar(true);
      const { url, error } = await profileService.uploadAvatar(user.id, file);
      
      if (error) {
        throw new Error(error);
      }
      
      if (url) {
        setAvatarUrl(url);
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload avatar",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      username,
      display_name: displayName,
      bio,
    });
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
          </DrawerHeader>
          
          <div className="p-4 overflow-y-auto space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-app-accent">
                  <img 
                    src={avatarUrl || "https://i.pravatar.cc/150"} 
                    alt="Profile"
                    className="object-cover"
                  />
                </Avatar>
                
                <label 
                  className="absolute bottom-0 right-0 bg-app-accent rounded-full p-2 cursor-pointer"
                  htmlFor="avatar-upload"
                >
                  <Camera size={16} className="text-white" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-app-muted"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="bg-app-muted"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
                className="bg-app-muted"
                rows={4}
              />
            </div>
          </div>
          
          <DrawerFooter>
            <Button 
              type="submit"
              className="w-full bg-app-accent"
              disabled={isLoading || uploadingAvatar}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditProfileDrawer;
