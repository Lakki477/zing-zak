
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/lib/auth';
import { profileService } from '@/services/profileService';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import ProfileInfo from '@/components/Profile/ProfileInfo';
import ProfileTabs from '@/components/Profile/ProfileTabs';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import EditProfileDrawer from '@/components/Profile/EditProfileDrawer';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, profile: currentUserProfile } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profileId = userId || user?.id;
  const isCurrentUser = !userId || userId === user?.id;

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => profileService.getProfile(profileId!),
    enabled: !!profileId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { userId: string, updates: any }) => 
      profileService.updateProfile(data.userId, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      setIsDrawerOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile",
      });
    },
  });

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'settings':
        toast({
          title: "Settings",
          description: "Settings page will be available soon",
        });
        break;
      case 'analytics':
        toast({
          title: "Analytics",
          description: "View your content performance",
        });
        break;
      case 'wallet':
        navigate('/wallet');
        break;
      case 'security':
        toast({
          title: "Privacy & Security",
          description: "Manage your account security",
        });
        break;
      case 'help':
        toast({
          title: "Help & Support",
          description: "Contact our support team",
        });
        break;
      case 'logout':
        // Fix: Call signOut properly
        const authStore = useAuth.getState();
        authStore.signOut().then(() => {
          toast({
            title: "Logout",
            description: "You have been logged out",
          });
          navigate('/auth');
        });
        break;
      default:
        break;
    }
  };

  const handleEditProfile = (formData: any) => {
    if (!user?.id) return;
    
    updateProfileMutation.mutate({
      userId: user.id,
      updates: formData
    });
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-app-background p-4">
        <div className="text-center mt-20">
          <h2 className="text-xl font-semibold mb-4">Profile not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background text-app-foreground pb-16">
      <div className="p-4">
        <ProfileHeader 
          username={userProfile.username || ""} 
          isCurrentUser={isCurrentUser}
          handleMenuAction={handleMenuAction}
        />
        
        <ProfileInfo 
          userProfile={userProfile}
          isCurrentUser={isCurrentUser}
          onEditClick={() => setIsDrawerOpen(true)}
        />
      </div>

      <ProfileTabs 
        userId={userProfile.id}
        isCurrentUser={isCurrentUser}
      />

      {isCurrentUser && (
        <EditProfileDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          profile={userProfile}
          onSave={handleEditProfile}
          isLoading={updateProfileMutation.isPending}
        />
      )}
    </div>
  );
};

export default ProfilePage;
