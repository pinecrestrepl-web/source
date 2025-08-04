
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { TicketStatus } from '../../types';

const AvailableJobs: React.FC = () => {
    const { user, tickets, updateTicket } = useContext(AppContext);

    const availableTickets = tickets.filter(t => t.status === TicketStatus.OPEN);

    const handleAcceptJob = (ticketId: string) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket && user) {
            const updatedTicket = { ...ticket, status: TicketStatus.ASSIGNED, technicianId: user.id, technicianName: user.name };
            updateTicket(updatedTicket);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Available Jobs</h1>
            <div className="space-y-4">
                {availableTickets.length > 0 ? availableTickets.map(ticket => (
                    <div key={ticket.id} className="bg-surface-light p-6 rounded-lg shadow-md flex flex-wrap justify-between items-center gap-4 border border-brand-border">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">{ticket.serviceType}</h3>
                            <p className="text-sm text-text-secondary mt-1">{ticket.description}</p>
                            <p className="text-xs text-text-secondary/80 mt-2">
                                Customer: {ticket.customerName} &bull; Posted: {ticket.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <button
                                onClick={() => handleAcceptJob(ticket.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600"
                            >
                                Accept
                            </button>
                             <button className="bg-slate-700 text-slate-200 px-4 py-2 rounded-md font-semibold hover:bg-slate-600">
                                Reject
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 bg-surface-light rounded-lg shadow-md border border-brand-border">
                        <p className="text-text-secondary">No available jobs at the moment. We'll notify you when a new job appears!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailableJobs;