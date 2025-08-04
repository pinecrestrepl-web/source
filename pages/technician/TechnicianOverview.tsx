
import React, { useContext } from 'react';
import { Technician, TicketStatus } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Star, CheckCircle, Clock } from 'lucide-react';

interface TechnicianOverviewProps {
    technician: Technician;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-surface-light p-6 rounded-xl shadow-lg flex items-center gap-4 border border-brand-border">
        <div className="p-3 bg-brand-primary/10 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const TechnicianOverview: React.FC<TechnicianOverviewProps> = ({ technician }) => {
    const { tickets } = useContext(AppContext);

    const myJobs = tickets.filter(t => t.technicianId === technician.id);
    const completedJobsCount = myJobs.filter(t => t.status === TicketStatus.COMPLETED).length;
    const activeJobs = myJobs.filter(t => t.status === TicketStatus.ASSIGNED || t.status === TicketStatus.IN_PROGRESS).length;

    const ratedJobs = myJobs.filter(t => t.rating && t.status === TicketStatus.COMPLETED);
    const totalRatings = ratedJobs.reduce((sum, t) => sum + t.rating!, 0);
    const averageRating = ratedJobs.length > 0 ? (totalRatings / ratedJobs.length).toFixed(1) : 'N/A';
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Your Dashboard, {technician.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Average Rating" value={averageRating} icon={<Star size={24} className="text-amber-500" />} />
                <StatCard title="Completed Jobs" value={completedJobsCount} icon={<CheckCircle size={24} className="text-green-500" />} />
                <StatCard title="Active Jobs" value={activeJobs} icon={<Clock size={24} className="text-blue-500" />} />
            </div>

            <div className="mt-8 bg-surface-light p-6 rounded-xl shadow-lg border border-brand-border">
                <h2 className="text-xl font-bold text-text-primary mb-4">Your Recent Active Jobs</h2>
                <div className="space-y-4">
                    {myJobs.filter(j => j.status !== TicketStatus.COMPLETED && j.status !== TicketStatus.CANCELLED).slice(0, 3).map(job => (
                        <div key={job.id} className="p-4 border border-brand-border rounded-md hover:bg-surface-dark">
                            <p className="font-semibold text-text-primary">{job.serviceType}</p>
                            <p className="text-sm text-text-secondary">{job.description}</p>
                            <p className="text-xs text-slate-400 mt-2">Customer: {job.customerName}</p>
                        </div>
                    ))}
                    {myJobs.filter(j => j.status !== TicketStatus.COMPLETED && j.status !== TicketStatus.CANCELLED).length === 0 && (
                        <p className="text-text-secondary">No active jobs right now. Check the "Available Jobs" tab.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicianOverview;