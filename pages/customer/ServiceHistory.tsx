
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { TicketStatus, ServiceTicket } from '../../types';
import { Star } from 'lucide-react';
import { analyzeFeedbackForRating } from '../../services/geminiService';

const StarRating: React.FC<{ rating: number; setRating: (r: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} type="button">
                    <Star
                        size={22}
                        className={`transition-colors ${rating >= star ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'}`}
                        fill={rating >= star ? 'currentColor' : 'none'}
                    />
                </button>
            ))}
        </div>
    );
};

const ServiceHistory: React.FC = () => {
    const { user, tickets, updateTicket } = useContext(AppContext);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null);

    if (!user) return null;

    const myTickets = tickets
      .filter(t => t.customerId === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !feedback || rating === 0) return;
        
        const updated = { ...selectedTicket, feedback, rating, status: TicketStatus.COMPLETED };
        updateTicket(updated);
        
        setSelectedTicket(null);
        setFeedback('');
        setRating(0);
    };

    const handleAnalyzeFeedback = async () => {
        if (!feedback) return;
        const suggestedRating = await analyzeFeedbackForRating(feedback);
        setRating(suggestedRating);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-6">Service History</h1>
            <div className="space-y-4">
                {myTickets.map(ticket => (
                    <div key={ticket.id} className="bg-surface-light p-4 rounded-lg shadow-md border border-slate-700">
                        <div className="flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-100">{ticket.serviceType}</h3>
                                <p className="text-sm text-slate-400 mt-1">
                                    Ticket #{ticket.id} &bull; Created: {ticket.createdAt.toLocaleDateString()}
                                </p>
                                <p className="text-slate-300 mt-2">{ticket.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                               <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                    ticket.status === TicketStatus.OPEN ? 'bg-blue-500/20 text-blue-300' :
                                    ticket.status === TicketStatus.ASSIGNED ? 'bg-yellow-500/20 text-yellow-300' :
                                    ticket.status === TicketStatus.COMPLETED ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                                }`}>
                                    {ticket.status}
                                </span>
                                {ticket.status === TicketStatus.COMPLETED && !ticket.rating && (
                                    <button onClick={() => setSelectedTicket(ticket)} className="text-sm bg-brand-primary text-slate-900 font-semibold px-3 py-1 rounded-md hover:bg-brand-secondary">Leave a Review</button>
                                )}
                                {ticket.rating && (
                                     <div className="flex items-center gap-1 mt-1 text-amber-500">
                                        {Array.from({ length: ticket.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                        {Array.from({ length: 5 - ticket.rating }).map((_, i) => <Star key={i} size={16} />)}
                                    </div>
                                )}
                            </div>
                        </div>
                        {selectedTicket?.id === ticket.id && (
                             <form onSubmit={handleFeedbackSubmit} className="mt-4 pt-4 border-t border-slate-700">
                                <h4 className="font-semibold mb-2 text-slate-200">Rate Your Service</h4>
                                <StarRating rating={rating} setRating={setRating} />
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={3}
                                    className="mt-2 block w-full px-3 py-2 bg-surface-dark border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-400"
                                    placeholder={`How was your experience with ${ticket.technicianName}?`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                   <button type="button" onClick={handleAnalyzeFeedback} className="text-sm text-brand-primary font-semibold hover:underline">Suggest rating with AI</button>
                                   <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold">Submit Review</button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceHistory;