
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { AppContext } from '../../context/AppContext';
import { Customer } from '../../types';
import { LayoutDashboard, Ticket, History, PlusCircle, CreditCard } from 'lucide-react';
import CustomerOverview from './CustomerOverview';
import NewTicket from './NewTicket';
import ServiceHistory from './ServiceHistory';
import SubscriptionPage from './SubscriptionPage';

const CustomerDashboard: React.FC = () => {
    const { user } = useContext(AppContext);

    if (!user) return null;

    const navItems = [
        { to: '', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { to: 'new-ticket', label: 'New Service Ticket', icon: <PlusCircle size={20} /> },
        { to: 'history', label: 'Service History', icon: <History size={20} /> },
        { to: 'subscription', label: 'Subscription', icon: <CreditCard size={20} /> },
    ];

    return (
        <DashboardLayout sidebarNavItems={navItems}>
            <Routes>
                <Route index element={<CustomerOverview customer={user as Customer} />} />
                <Route path="new-ticket" element={<NewTicket />} />
                <Route path="history" element={<ServiceHistory />} />
                <Route path="subscription" element={<SubscriptionPage />} />
            </Routes>
        </DashboardLayout>
    );
}

export default CustomerDashboard;