
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { UserRole, User } from '../types';
import { AlertTriangle } from 'lucide-react';
import SmsVerificationModal from '../components/SmsVerificationModal';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [error, setError] = useState('');
  const [userToVerify, setUserToVerify] = useState<User | null>(null);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  
  const { login, completeLogin } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const foundUser = login(email, role);
    if (foundUser) {
      setUserToVerify(foundUser);
      setIsSmsModalOpen(true);
    } else {
      setError('Invalid credentials. Please use the pre-configured emails or sign up for a new account.');
    }
  };
  
  const handleVerificationSuccess = () => {
    if (userToVerify) {
      completeLogin(userToVerify);
      setIsSmsModalOpen(false);
      navigate('/');
    }
  };

  const setLoginInfo = (email: string, role: UserRole) => {
    setEmail(email);
    setRole(role);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-dark p-4">
        <div className="w-full max-w-md">
          <div className="bg-surface-light p-8 rounded-2xl shadow-2xl border border-brand-border">
            <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Welcome Back!</h2>
            <p className="text-center text-text-secondary mb-6">Log in to access your dashboard.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full px-3 py-2 bg-surface-dark border border-brand-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm text-text-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-text-secondary">I am a...</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-2 block w-full pl-3 pr-10 py-2 text-base bg-surface-dark border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md text-text-primary"
                >
                  <option value={UserRole.CUSTOMER}>Customer</option>
                  <option value={UserRole.TECHNICIAN}>Technician</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 text-red-400 text-sm p-3 rounded-md border border-red-500/20">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-slate-900 bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light focus:ring-brand-primary"
                >
                  Log In
                </button>
              </div>
            </form>
            <p className="mt-6 text-center text-sm text-text-secondary">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-brand-primary hover:text-brand-secondary">
                      Sign up
                  </Link>
              </p>
          </div>
          
          <div className="mt-6 bg-surface-light/50 p-4 rounded-lg text-text-primary border border-brand-border">
              <h4 className="font-bold text-center mb-2">Demo Accounts</h4>
              <div className="text-sm space-y-2">
                  <p className="text-text-secondary">Click to populate login fields:</p>
                  <button onClick={() => setLoginInfo('customer@example.com', UserRole.CUSTOMER)} className="text-left w-full hover:bg-slate-700 p-2 rounded-md transition-colors"><strong>Customer:</strong> customer@example.com</button>
                  <button onClick={() => setLoginInfo('technician@example.com', UserRole.TECHNICIAN)} className="text-left w-full hover:bg-slate-700 p-2 rounded-md transition-colors"><strong>Technician:</strong> technician@example.com</button>
                  <button onClick={() => setLoginInfo('admin@example.com', UserRole.ADMIN)} className="text-left w-full hover:bg-slate-700 p-2 rounded-md transition-colors"><strong>Admin:</strong> admin@example.com</button>
              </div>
          </div>
        </div>
      </div>
      {userToVerify && (
        <SmsVerificationModal
            isOpen={isSmsModalOpen}
            onClose={() => setIsSmsModalOpen(false)}
            onVerify={handleVerificationSuccess}
            phoneToVerify={userToVerify.phone}
        />
      )}
    </>
  );
};

export default LoginPage;