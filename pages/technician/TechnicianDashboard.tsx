import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { AppContext } from '../../context/AppContext';
import { Technician } from '../../types';
import { LayoutDashboard, ListChecks, History, Wallet } from 'lucide-react';
import TechnicianOverview from './TechnicianOverview';
import AvailableJobs from './AvailableJobs';
import MyJobs from './MyJobs';
import MyPayments from './MyPayments';

const TechnicianDashboard: React.FC = () => {
    const { user } = useContext(AppContext);
    
    if (!user) return null;

    const navItems = [
        { to: '', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { to: 'available-jobs', label: 'Available Jobs', icon: <ListChecks size={20} /> },
        { to: 'my-jobs', label: 'My Jobs', icon: <History size={20} /> },
        { to: 'my-payments', label: 'My Payments', icon: <Wallet size={20} /> },
    ];

    return (
        <DashboardLayout sidebarNavItems={navItems}>
            <Routes>
                <Route index element={<TechnicianOverview technician={user as Technician} />} />
                <Route path="available-jobs" element={<AvailableJobs />} />
                <Route path="my-jobs" element={<MyJobs />} />
                <Route path="my-payments" element={<MyPayments />} />
            </Routes>
        </DashboardLayout>
    );
}

export default TechnicianDashboard;