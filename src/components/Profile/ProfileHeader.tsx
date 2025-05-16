
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, TrendingUp, Wallet, Shield, HelpCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  username: string;
  isCurrentUser: boolean;
  handleMenuAction: (action: string) => void;
}

const ProfileHeader = ({ username, isCurrentUser, handleMenuAction }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(-1)}
        className="text-app-foreground"
      >
        <ChevronLeft size={24} />
      </Button>
      <h1 className="text-xl font-bold">@{username}</h1>
      
      {isCurrentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-app-foreground">
              <MoreVertical size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Profile Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('analytics')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('wallet')}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet & Withdrawals</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('security')}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Privacy & Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuAction('logout')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {!isCurrentUser && <div className="w-10"></div>}
    </div>
  );
};

export default ProfileHeader;
