
import React, { useContext } from 'react';
import { Technician, TicketStatus } from '../../types';
import { AppContext } from '../../context/AppContext';
import { Star, CheckCircle, Clock } from 'lucide-react';

interface TechnicianOverviewProps {
    technician: Technician;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="p-3 bg-brand-light rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const TechnicianOverview: React.FC<TechnicianOverviewProps> = ({ technician }) => {
    const { tickets } = useContext(AppContext);

    const myJobs = tickets.filter(t => t.technicianId === technician.id);
    const completedJobs = myJobs.filter(t => t.status === TicketStatus.COMPLETED).length;
    const activeJobs = myJobs.filter(t => t.status === TicketStatus.ASSIGNED || t.status === TicketStatus.IN_PROGRESS).length;

    const totalRatings = myJobs
        .filter(t => t.rating)
        .reduce((sum, t) => sum + t.rating!, 0);
    const averageRating = completedJobs > 0 ? (totalRatings / completedJobs).toFixed(1) : 'N/A';
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Your Dashboard, {technician.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Average Rating" value={averageRating} icon={<Star size={24} className="text-amber-500" />} />
                <StatCard title="Completed Jobs" value={completedJobs} icon={<CheckCircle size={24} className="text-green-500" />} />
                <StatCard title="Active Jobs" value={activeJobs} icon={<Clock size={24} className="text-blue-500" />} />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Your Recent Active Jobs</h2>
                <div className="space-y-4">
                    {myJobs.filter(j => j.status !== TicketStatus.COMPLETED).slice(0, 3).map(job => (
                        <div key={job.id} className="p-4 border rounded-md hover:bg-slate-50">
                            <p className="font-semibold">{job.serviceType}</p>
                            <p className="text-sm text-slate-600">{job.description}</p>
                            <p className="text-xs text-slate-400 mt-2">Customer: {job.customerName}</p>
                        </div>
                    ))}
                    {myJobs.filter(j => j.status !== TicketStatus.COMPLETED).length === 0 && (
                        <p className="text-slate-500">No active jobs right now. Check the "Available Jobs" tab.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicianOverview;
