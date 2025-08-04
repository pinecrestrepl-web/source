
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { LogIn, LogOut, User as UserIcon, Wrench } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, appSettings } = useContext(AppContext);
  const navigate = useNavigate();
  const logoUrl = appSettings.theme?.logoUrl;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-surface-light/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors">
              {logoUrl ? (
                <img src={logoUrl} alt="ServiceHub Pro Logo" className="h-10 w-auto" />
              ) : (
                <>
                  <Wrench className="h-8 w-8" />
                  <span className="text-2xl font-bold">Pinecrest ServiceHub</span>
                </>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-text-secondary">
                  Welcome, <span className="font-semibold text-text-primary">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-md hover:bg-red-500/20 border border-red-500/30 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-brand-primary text-slate-900 px-4 py-2 rounded-md hover:bg-brand-secondary font-semibold transition-colors"
              >
                <LogIn size={18} />
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;