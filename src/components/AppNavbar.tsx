
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Play, Camera, Video, User } from 'lucide-react';

const AppNavbar = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-app-background border-t border-app-muted z-50">
      <div className="flex justify-around items-center h-14">
        <NavItem
          icon={<Home size={24} />}
          label="Home"
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
          to="/"
        />
        <NavItem
          icon={<Play size={24} />}
          label="Discover"
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
          to="/discover"
        />
        <UploadButton />
        <NavItem
          icon={<Video size={24} />}
          label="Inbox"
          active={activeTab === 'inbox'}
          onClick={() => setActiveTab('inbox')}
          to="/inbox"
        />
        <NavItem
          icon={<User size={24} />}
          label="Profile"
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          to="/profile"
        />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, to }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  to: string;
}) => {
  return (
    <Link to={to} className="flex flex-col items-center" onClick={onClick}>
      <div className={`text-xl ${active ? 'text-app-accent' : 'text-app-foreground'}`}>
        {icon}
      </div>
      <div className={`text-xs mt-0.5 ${active ? 'text-app-accent' : 'text-gray-400'}`}>
        {label}
      </div>
    </Link>
  );
};

const UploadButton = () => {
  return (
    <Link to="/upload">
      <Button className="rounded-md bg-gradient-to-r from-app-accent to-app-secondary text-white w-12 h-8 flex items-center justify-center">
        <Camera size={20} />
      </Button>
    </Link>
  );
};

export default AppNavbar;
