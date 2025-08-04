
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { TicketStatus } from '../../types';
import { Star } from 'lucide-react';

const MyJobs: React.FC = () => {
    const { user, tickets, updateTicket } = useContext(AppContext);

    if (!user) return null;

    const myJobs = tickets
        .filter(t => t.technicianId === user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const handleCompleteJob = (ticketId: string) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            updateTicket({ ...ticket, status: TicketStatus.COMPLETED });
            alert('Job marked as complete. The customer will be prompted for a review and your payment will be processed.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-6">My Jobs</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-200 mb-3">Active Jobs</h2>
                    <div className="space-y-4">
                        {myJobs.filter(j => j.status === TicketStatus.ASSIGNED || j.status === TicketStatus.IN_PROGRESS).map(job => (
                            <div key={job.id} className="bg-surface-light p-4 rounded-lg shadow-md flex justify-between items-center border border-slate-700">
                                <div>
                                    <h3 className="font-bold text-slate-100">{job.serviceType}</h3>
                                    <p className="text-sm text-slate-300">{job.description}</p>
                                    <p className="text-xs text-slate-400 mt-1">Customer: {job.customerName}</p>
                                </div>
                                <button onClick={() => handleCompleteJob(job.id)} className="bg-brand-primary text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-brand-secondary">Mark as Complete</button>
                            </div>
                        ))}
                         {myJobs.filter(j => j.status === TicketStatus.ASSIGNED || j.status === TicketStatus.IN_PROGRESS).length === 0 && (
                            <p className="text-slate-400">No active jobs.</p>
                         )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-slate-200 mb-3">Completed Jobs</h2>
                    <div className="space-y-4">
                        {myJobs.filter(j => j.status === TicketStatus.COMPLETED).map(job => (
                            <div key={job.id} className="bg-surface-light/50 p-4 rounded-lg shadow-md opacity-80 hover:opacity-100 transition-opacity border border-slate-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-200">{job.serviceType}</h3>
                                        <p className="text-sm text-slate-400">Customer: {job.customerName}</p>
                                        <p className={`text-sm font-semibold mt-1 ${job.paymentStatus === 'Paid' ? 'text-green-400' : 'text-orange-400'}`}>
                                            Earning: ₹{job.technicianEarning?.toFixed(2)} ({job.paymentStatus})
                                        </p>
                                    </div>
                                    {job.rating && (
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <span>{job.rating.toFixed(1)}</span>
                                            <Star size={16} fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                                {job.feedback && <p className="text-sm italic text-slate-400 mt-2 p-2 bg-surface-dark rounded">"{job.feedback}"</p>}
                            </div>
                        ))}
                        {myJobs.filter(j => j.status === TicketStatus.COMPLETED).length === 0 && (
                            <p className="text-slate-400">No completed jobs yet.</p>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;