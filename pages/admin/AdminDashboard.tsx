import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { LayoutDashboard, Users, Archive, BarChart2, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import AdminOverview from './AdminOverview';
import ManageUsers from './ManageUsers';
import Inventory from './Inventory';
import Reports from './Reports';
import TechnicianPayments from './TechnicianPayments';
import PaymentReports from './PaymentReports';
import Settings from './Settings';

const AdminDashboard: React.FC = () => {
    const navItems = [
        { to: '', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { to: 'users', label: 'Manage Users', icon: <Users size={20} /> },
        { to: 'inventory', label: 'Inventory', icon: <Archive size={20} /> },
        { to: 'technician-payments', label: 'Technician Payments', icon: <DollarSign size={20} /> },
        { to: 'service-reports', label: 'Service Reports', icon: <BarChart2 size={20} /> },
        { to: 'payment-reports', label: 'Payment Reports', icon: <BarChart2 size={20} /> },
        { to: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
    ];

    return (
        <DashboardLayout sidebarNavItems={navItems}>
            <Routes>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="service-reports" element={<Reports />} />
                <Route path="technician-payments" element={<TechnicianPayments />} />
                <Route path="payment-reports" element={<PaymentReports />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
        </DashboardLayout>
    );
}

export default AdminDashboard;