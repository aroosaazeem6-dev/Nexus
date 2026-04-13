import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardRoute =
    user?.role === 'entrepreneur'
      ? '/dashboard/entrepreneur'
      : '/dashboard/investor';

  const profileRoute = user
    ? `/profile/${user.role}/${user.id}`
    : '/login';

  const navLinks = [
    {
      icon: user?.role === 'entrepreneur'
        ? <Building2 size={18} />
        : <CircleDollarSign size={18} />,
      text: 'Dashboard',
      path: dashboardRoute,
    },
    {
      icon: <MessageCircle size={18} />,
      text: 'Messages',
      path: '/messages',
    },
    {
      icon: <Bell size={18} />,
      text: 'Notifications',
      path: '/notifications',
    },
    {
      icon: <User size={18} />,
      text: 'Profile',
      path: profileRoute,
    }
  ];

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16">

        {/* Left */}
        <div className="flex items-center space-x-3">

          {/* Hamburger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-bold">Business Nexus</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          {user && navLinks.map((link, i) => (
            <Link key={i} to={link.path} className="flex items-center text-gray-700 hover:text-primary-600">
              <span className="mr-2">{link.icon}</span>
              {link.text}
            </Link>
          ))}

          {user && (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>

              <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
            </>
          )}
        </div>

      </div>
    </nav>
  );
};