
import React, { useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { UserRole } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import Header from './components/Header';

const ThemeApplicator: React.FC = () => {
    const { appSettings } = useContext(AppContext);
    const { theme } = appSettings;

    useEffect(() => {
        const root = document.documentElement;
        if (theme) {
            if (theme.colors) {
                root.style.setProperty('--color-brand-primary', theme.colors.primary);
                root.style.setProperty('--color-brand-secondary', theme.colors.secondary);
                root.style.setProperty('--color-brand-accent', theme.colors.accent);
                root.style.setProperty('--color-surface-light', theme.colors.light);
                root.style.setProperty('--color-surface-dark', theme.colors.dark);
                root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
                root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
                root.style.setProperty('--color-border', theme.colors.border);
            }
            if (theme.backgroundUrl) {
                document.body.style.backgroundImage = `url('${theme.backgroundUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
            } else {
                document.body.style.backgroundImage = 'none';
            }
            
            // Apply typography settings
            root.style.setProperty('--font-family', theme.fontFamily);
            root.style.setProperty('font-weight', String(theme.fontWeight.regular));
            root.style.setProperty('--font-weight-regular', String(theme.fontWeight.regular));
            root.style.setProperty('--font-weight-bold', String(theme.fontWeight.bold));
            root.style.setProperty('--font-weight-extrabold', String(theme.fontWeight.extrabold));
            root.style.setProperty('line-height', String(theme.lineHeight));
        }
    }, [theme]);

    return null;
}

const App: React.FC = () => {
  const { user } = useContext(AppContext);

  return (
    <HashRouter>
      <ThemeApplicator />
      <div className="min-h-screen bg-surface-dark font-sans text-text-primary">
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
            <Route path="/" element={
              !user ? <LandingPage /> :
              user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
              user.role === UserRole.TECHNICIAN ? <Navigate to="/technician" /> :
              <Navigate to="/customer" />
            } />
            
            {/* Protected Routes */}
            <Route path="/admin/*" element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/technician/*" element={user?.role === UserRole.TECHNICIAN ? <TechnicianDashboard /> : <Navigate to="/login" />} />
            <Route path="/customer/*" element={user?.role === UserRole.CUSTOMER ? <CustomerDashboard /> : <Navigate to="/login" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;