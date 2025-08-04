
import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { User, ServiceTicket, UserRole, Technician } from '../../types';
import { ArrowUpDown } from 'lucide-react';

type ReportType = 'tickets' | 'users';

const Reports: React.FC = () => {
    const { tickets, users } = useContext(AppContext);
    const [reportType, setReportType] = useState<ReportType>('tickets');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const sortedTickets = useMemo(() => {
        let sortableItems = [...tickets];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tickets, sortConfig]);
    
    const sortedUsers = useMemo(() => {
        let sortableItems = [...users];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                 const aValue = (a as any)[sortConfig.key];
                 const bValue = (b as any)[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [users, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ArrowUpDown size={14} className="opacity-30" />;
        }
        return sortConfig.direction === 'asc' ? '🔼' : '🔽';
    };

    const SortableHeader: React.FC<{ sortKey: string; children: React.ReactNode }> = ({ sortKey, children }) => (
        <th className="p-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-200" onClick={() => requestSort(sortKey)}>
            <div className="flex items-center gap-2">{children} {getSortIcon(sortKey)}</div>
        </th>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Service Reports</h1>
                <select value={reportType} onChange={e => setReportType(e.target.value as ReportType)} className="input">
                    <option value="tickets">Tickets Report</option>
                    <option value="users">Users Report</option>
                </select>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    {reportType === 'tickets' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100">
                                    <SortableHeader sortKey="createdAt">Created At</SortableHeader>
                                    <SortableHeader sortKey="serviceType">Service</SortableHeader>
                                    <SortableHeader sortKey="customerName">Customer</SortableHeader>
                                    <SortableHeader sortKey="technicianName">Technician</SortableHeader>
                                    <SortableHeader sortKey="status">Status</SortableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTickets.map(ticket => (
                                    <tr key={ticket.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3">{ticket.createdAt.toLocaleDateString()}</td>
                                        <td className="p-3">{ticket.serviceType}</td>
                                        <td className="p-3">{ticket.customerName}</td>
                                        <td className="p-3">{ticket.technicianName || 'N/A'}</td>
                                        <td className="p-3">{ticket.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {reportType === 'users' && (
                         <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100">
                                    <SortableHeader sortKey="createdAt">Registration Date</SortableHeader>
                                    <SortableHeader sortKey="name">Name</SortableHeader>
                                    <SortableHeader sortKey="email">Email</SortableHeader>
                                    <SortableHeader sortKey="role">Role</SortableHeader>
                                    <th className="p-3 text-sm font-semibold text-slate-600">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUsers.map(user => (
                                    <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3">{user.createdAt.toLocaleDateString()}</td>
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">{user.role}</td>
                                        <td className="p-3 text-sm">
                                            {user.role === UserRole.TECHNICIAN && `Spec: ${(user as Technician).specialty}`}
                                            {user.role === UserRole.CUSTOMER && `Sub: ${user.subscription || 'None'}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                 </div>
            </div>
            <style>{`.input { display: block; padding: 0.5rem 0.75rem; background-color: white; border: 1px solid #cbd5e1; border-radius: 0.375rem; }`}</style>
        </div>
    );
};

export default Reports;
