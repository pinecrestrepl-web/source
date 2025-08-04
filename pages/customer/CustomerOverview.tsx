
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Customer, ServiceTicket, TicketStatus } from '../../types';
import { PlusCircle, Star, Sparkles, CreditCard, History, Ticket } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode; onClick?: () => void, className?: string }> = ({ title, value, icon, onClick, className }) => (
    <div 
        className={`bg-surface-light p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col justify-between transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-brand-primary hover:-translate-y-1' : ''} ${className}`}
        onClick={onClick}
    >
        <div className="flex justify-between items-start text-slate-400">
            <p className="font-semibold">{title}</p>
            {icon}
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-100">{value}</div>
    </div>
);


const CustomerOverview: React.FC<{ customer: Customer }> = ({ customer }) => {
    const { tickets, user } = useContext(AppContext);
    const navigate = useNavigate();

    // Use user from context to ensure subscription updates are reflected
    const currentCustomer = user as Customer;

    const myTickets = tickets
      .filter(t => t.customerId === currentCustomer.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const activeTicketsCount = myTickets.filter(t => t.status !== TicketStatus.COMPLETED && t.status !== TicketStatus.CANCELLED).length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100">Welcome, {currentCustomer.name}!</h1>
                <p className="text-slate-400 mt-1">Here's a summary of your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Main CTA */}
                <div 
                    onClick={() => navigate('new-ticket')}
                    className="md:col-span-3 bg-gradient-to-r from-brand-primary to-brand-secondary p-8 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center text-slate-900 cursor-pointer transition-transform hover:scale-[1.02]">
                    <div>
                        <h2 className="text-2xl font-bold">Need something fixed?</h2>
                        <p className="opacity-90">Create a new service ticket in just a few clicks.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white/30 text-slate-900 px-6 py-3 rounded-lg font-semibold mt-4 md:mt-0">
                        <PlusCircle size={20} />
                        Request New Service
                    </button>
                </div>
                
                <StatCard 
                    title="Subscription Plan" 
                    value={<><Sparkles className="inline text-brand-accent mr-2 h-6 w-6"/>{currentCustomer.subscription || 'N/A'}</>}
                    icon={<CreditCard size={24} />}
                    onClick={() => navigate('subscription')}
                />
                 <StatCard 
                    title="Active Tickets" 
                    value={activeTicketsCount}
                    icon={<Ticket size={24} />}
                    onClick={() => navigate('history')}
                />
                 <StatCard 
                    title="Service History" 
                    value={`${myTickets.length} total`}
                    icon={<History size={24} />}
                    onClick={() => navigate('history')}
                />
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-4">Your Recent Tickets</h2>
            <div className="space-y-4">
                {myTickets.length > 0 ? myTickets.slice(0, 3).map(ticket => (
                    <div key={ticket.id} className="bg-surface-light p-4 rounded-lg shadow-md border border-slate-700 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-200">{ticket.serviceType}</p>
                            <p className="text-sm text-slate-400">
                                Created on {ticket.createdAt.toLocaleDateString()}
                                {ticket.technicianName && ` | Assigned to ${ticket.technicianName}`}
                            </p>
                        </div>
                        <div className="text-right">
                           <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                ticket.status === TicketStatus.OPEN ? 'bg-blue-500/20 text-blue-300' :
                                ticket.status === TicketStatus.ASSIGNED ? 'bg-yellow-500/20 text-yellow-300' :
                                ticket.status === TicketStatus.COMPLETED ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                            }`}>
                                {ticket.status}
                            </span>
                            {ticket.status === TicketStatus.COMPLETED && (
                                <div className="flex items-center justify-end gap-1 mt-1 text-amber-500">
                                    {Array.from({ length: ticket.rating || 0 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    {Array.from({ length: 5 - (ticket.rating || 0) }).map((_, i) => <Star key={i} size={16} />)}
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                     <div className="text-center py-10 bg-surface-light rounded-lg border border-slate-700">
                        <p className="text-slate-400">You haven't created any service tickets yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOverview;