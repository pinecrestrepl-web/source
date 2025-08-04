
import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { TicketStatus, UserRole } from '../../types';
import { Users, Wrench, Ticket, CheckCircle2 } from 'lucide-react';
import { startOfDay, startOfMonth, startOfYear } from 'date-fns';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; className?: string }> = ({ title, value, icon, className = '' }) => (
    <div className={`bg-surface-light p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col justify-between ${className}`}>
        <div className="flex justify-between items-start">
            <p className="text-sm text-slate-400">{title}</p>
            {icon}
        </div>
        <p className="text-3xl font-bold text-slate-100 mt-2">{value}</p>
    </div>
);

const AdminOverview: React.FC = () => {
    const { users, tickets } = useContext(AppContext);
    const [filter, setFilter] = useState('all');

    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate: Date;

        switch (filter) {
            case 'today':
                startDate = startOfDay(now);
                break;
            case 'month':
                startDate = startOfMonth(now);
                break;
            case 'year':
                startDate = startOfYear(now);
                break;
            default:
                startDate = new Date(0); // Epoch start for 'all time'
        }

        const filteredTickets = tickets.filter(t => t.createdAt >= startDate);
        const filteredUsers = users.filter(u => u.createdAt >= startDate);

        return {
            totalCustomers: users.filter(u => u.role === UserRole.CUSTOMER).length,
            newCustomers: filteredUsers.filter(u => u.role === UserRole.CUSTOMER).length,
            totalTechnicians: users.filter(u => u.role === UserRole.TECHNICIAN).length,
            newTechnicians: filteredUsers.filter(u => u.role === UserRole.TECHNICIAN).length,
            openTickets: filteredTickets.filter(t => t.status === TicketStatus.OPEN).length,
            completedTickets: filteredTickets.filter(t => t.status === TicketStatus.COMPLETED).length,
        };
    }, [users, tickets, filter]);
    
    const getFilterLabel = () => {
        switch(filter) {
            case 'today': return 'Today';
            case 'month': return 'This Month';
            case 'year': return 'This Year';
            default: return 'All Time';
        }
    }

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-100">Admin Overview</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Filter:</span>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-surface-light border border-slate-600 rounded-md px-3 py-1 text-sm focus:ring-brand-primary focus:border-brand-primary text-slate-200">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={`Total Customers`} value={filteredData.totalCustomers} icon={<Users size={24} className="text-brand-primary" />} />
                <StatCard title={`Total Technicians`} value={filteredData.totalTechnicians} icon={<Wrench size={24} className="text-brand-primary" />} />
                <StatCard title={`Open Tickets (${getFilterLabel()})`} value={filteredData.openTickets} icon={<Ticket size={24} className="text-yellow-400" />} />
                <StatCard title={`Completed Jobs (${getFilterLabel()})`} value={filteredData.completedTickets} icon={<CheckCircle2 size={24} className="text-green-400" />} />
           
                <div className="md:col-span-2 lg:col-span-4 mt-2 bg-surface-light p-6 rounded-xl shadow-lg border border-slate-700">
                    <h2 className="text-xl font-bold text-slate-100 mb-4">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="p-3 text-sm font-semibold text-slate-400">Ticket ID</th>
                                    <th className="p-3 text-sm font-semibold text-slate-400">Customer</th>
                                    <th className="p-3 text-sm font-semibold text-slate-400">Service</th>
                                    <th className="p-3 text-sm font-semibold text-slate-400">Status</th>
                                    <th className="p-3 text-sm font-semibold text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.slice(0, 5).map(ticket => (
                                    <tr key={ticket.id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50">
                                        <td className="p-3 text-slate-300 font-mono text-xs">{ticket.id}</td>
                                        <td className="p-3 text-slate-300">{ticket.customerName}</td>
                                        <td className="p-3 text-slate-300">{ticket.serviceType}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                ticket.status === TicketStatus.OPEN ? 'bg-blue-500/20 text-blue-300' :
                                                ticket.status === TicketStatus.ASSIGNED ? 'bg-yellow-500/20 text-yellow-300' :
                                                ticket.status === TicketStatus.COMPLETED ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-400 text-sm">{ticket.createdAt.toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;