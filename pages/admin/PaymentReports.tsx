import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { CustomerPayment, ServiceTicket, TicketStatus } from '../../types';
import { ArrowUpDown } from 'lucide-react';

type ReportType = 'customer' | 'technician';

const PaymentReports: React.FC = () => {
    const { customerPayments, tickets } = useContext(AppContext);
    const [reportType, setReportType] = useState<ReportType>('customer');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const technicianPayouts = useMemo(() => tickets.filter(
        t => t.status === TicketStatus.COMPLETED && t.paymentStatus === 'Paid'
    ), [tickets]);

    const sortedCustomerPayments = useMemo(() => {
        let sortableItems = [...customerPayments];
        if (reportType === 'customer' && sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key];
                const bValue = (b as any)[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [customerPayments, sortConfig, reportType]);
    
    const sortedTechnicianPayouts = useMemo(() => {
        let sortableItems = [...technicianPayouts];
        if (reportType === 'technician' && sortConfig !== null) {
            sortableItems.sort((a, b) => {
                 const aValue = (a as any)[sortConfig.key];
                 const bValue = (b as any)[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [technicianPayouts, sortConfig, reportType]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: string; children: React.ReactNode }> = ({ sortKey, children }) => (
        <th className="p-3 text-sm font-semibold text-slate-600 cursor-pointer hover:bg-slate-200" onClick={() => requestSort(sortKey)}>
            <div className="flex items-center gap-2">{children} {(!sortConfig || sortConfig.key !== sortKey) ? <ArrowUpDown size={14} className="opacity-30" /> : (sortConfig.direction === 'asc' ? '🔼' : '🔽')}</div>
        </th>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Payment Reports</h1>
            
            <div className="mb-4 border-b border-slate-300">
                <nav className="flex gap-4">
                    <button onClick={() => setReportType('customer')} className={`py-2 px-4 text-sm font-medium ${reportType === 'customer' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-slate-600'}`}>Customer Payments</button>
                    <button onClick={() => setReportType('technician')} className={`py-2 px-4 text-sm font-medium ${reportType === 'technician' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-slate-600'}`}>Technician Payouts</button>
                </nav>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    {reportType === 'customer' && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100">
                                    <SortableHeader sortKey="paymentDate">Date</SortableHeader>
                                    <SortableHeader sortKey="customerName">Customer</SortableHeader>
                                    <SortableHeader sortKey="type">Type</SortableHeader>
                                    <SortableHeader sortKey="tier">Plan</SortableHeader>
                                    <SortableHeader sortKey="amount">Amount</SortableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCustomerPayments.map(p => (
                                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3">{p.paymentDate.toLocaleDateString()}</td>
                                        <td className="p-3">{p.customerName}</td>
                                        <td className="p-3">{p.type}</td>
                                        <td className="p-3">{p.tier}</td>
                                        <td className="p-3">₹{p.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {reportType === 'technician' && (
                         <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-100">
                                    <SortableHeader sortKey="completedAt">Payout Date</SortableHeader>
                                    <SortableHeader sortKey="technicianName">Technician</SortableHeader>
                                    <SortableHeader sortKey="serviceType">Job</SortableHeader>
                                    <SortableHeader sortKey="technicianEarning">Amount</SortableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTechnicianPayouts.map(t => (
                                    <tr key={t.id} className="border-b border-slate-200 hover:bg-slate-50">
                                        <td className="p-3">{t.completedAt?.toLocaleDateString()}</td>
                                        <td className="p-3">{t.technicianName}</td>
                                        <td className="p-3">{t.serviceType}</td>
                                        <td className="p-3">₹{t.technicianEarning?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default PaymentReports;
