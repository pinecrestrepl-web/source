
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { TicketStatus } from '../../types';

const MyPayments: React.FC = () => {
    const { user, tickets } = useContext(AppContext);
    const [filterYear, setFilterYear] = useState<string>('all');
    const [filterMonth, setFilterMonth] = useState<string>('all');

    const completedJobs = useMemo(() => {
        if (!user) return [];
        return tickets.filter(t => 
            t.technicianId === user.id && t.status === TicketStatus.COMPLETED
        ).sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));
    }, [user, tickets]);
    
    const filteredJobs = useMemo(() => {
        return completedJobs.filter(job => {
            if (!job.completedAt) return false;
            const jobDate = job.completedAt;
            const yearMatch = filterYear === 'all' || jobDate.getFullYear().toString() === filterYear;
            const monthMatch = filterMonth === 'all' || (jobDate.getMonth() + 1).toString() === filterMonth;
            return yearMatch && monthMatch;
        });
    }, [completedJobs, filterYear, filterMonth]);
    
    const years = useMemo(() => [...new Set(completedJobs.map(j => j.completedAt?.getFullYear()).filter(Boolean))].sort((a,b)=>b-a), [completedJobs]);

    const totalEarnings = useMemo(() => {
        return filteredJobs.reduce((sum, job) => sum + (job.technicianEarning || 0), 0);
    }, [filteredJobs]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">My Payments</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-light border border-brand-border p-4 rounded-lg shadow-md mb-6">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Filter by Year</label>
                     <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="input w-full mt-2">
                        <option value="all">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="text-sm font-medium text-text-secondary">Filter by Month</label>
                    <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="input w-full mt-2">
                        <option value="all">All Months</option>
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>)}
                    </select>
                </div>
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm font-semibold text-brand-primary">Filtered Total Earnings</p>
                    <p className="text-2xl font-bold text-text-primary">₹{totalEarnings.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-surface-light p-6 rounded-lg shadow-md border border-brand-border">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-border">
                                <th className="p-3 text-sm font-semibold text-text-secondary">Job Completion Date</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Job Details</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Your Earning</th>
                                <th className="p-3 text-sm font-semibold text-text-secondary">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length > 0 ? filteredJobs.map(job => (
                                <tr key={job.id} className="border-b border-brand-border last:border-b-0 hover:bg-surface-dark">
                                    <td className="p-3 text-text-primary">{job.completedAt?.toLocaleDateString()}</td>
                                    <td className="p-3 text-text-primary">{job.serviceType}</td>
                                    <td className="p-3 font-semibold text-text-primary">₹{job.technicianEarning?.toFixed(2) || 'N/A'}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                            {job.paymentStatus || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                 <tr><td colSpan={4} className="p-4 text-center text-text-secondary">No payment records found for the selected period.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
             <style>{`.input { display: block; padding: 0.5rem 0.75rem; background-color: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 0.375rem; color: var(--color-text-primary) }`}</style>
        </div>
    );
};

export default MyPayments;