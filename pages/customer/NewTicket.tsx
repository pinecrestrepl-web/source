
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { generateJobDescription } from '../../services/geminiService';
import { ServiceTicket, TicketStatus, Customer, PricingPlan } from '../../types';
import { Wand2, AlertTriangle } from 'lucide-react';
import SmsVerificationModal from '../../components/SmsVerificationModal';

const NewTicket: React.FC = () => {
    const { user, services, pricingPlans, addTicket } = useContext(AppContext);
    const navigate = useNavigate();
    
    const [serviceId, setServiceId] = useState('');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [ticketToCreate, setTicketToCreate] = useState<ServiceTicket | null>(null);
    const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
    
    const customer = user as Customer;
    const customerPlan = pricingPlans.find(p => p.tier === customer.subscription);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedService = services.find(s => s.id === serviceId);
        if (!user || !selectedService || !description) return;

        const newTicket: ServiceTicket = {
            id: `tkt${Date.now()}`,
            customerId: user.id,
            customerName: user.name,
            serviceType: selectedService.name,
            description,
            status: TicketStatus.OPEN,
            createdAt: new Date(),
        };

        setTicketToCreate(newTicket);
        setIsSmsModalOpen(true);
    };
    
    const handleVerificationSuccess = () => {
        if(ticketToCreate) {
            addTicket(ticketToCreate);
            setIsSmsModalOpen(false);
            navigate('/customer/history');
        }
    };

    const handleGenerateDescription = async () => {
        const selectedService = services.find(s => s.id === serviceId);
        if (!selectedService) return;
        setIsGenerating(true);
        try {
            const generatedDesc = await generateJobDescription(selectedService.name);
            setDescription(generatedDesc);
        } catch (error) {
            console.error("Failed to generate description:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Create a New Service Ticket</h1>
            <div className="max-w-2xl mx-auto bg-surface-light p-8 rounded-xl shadow-lg border border-brand-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="serviceType" className="block text-sm font-medium text-text-secondary">
                            What service do you need?
                        </label>
                        <select
                            id="serviceType"
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value)}
                            className="mt-2 block w-full px-3 py-2 bg-surface-dark border border-brand-border rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            required
                        >
                            <option value="" disabled>-- Select a service --</option>
                            {services.map(service => {
                                const isFree = customerPlan?.includedServiceIds.includes(service.id);
                                return (
                                    <option key={service.id} value={service.id}>
                                        {service.name} {isFree ? '(Free with your plan)' : `(Paid - ₹${service.price})`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-text-secondary">
                            Describe the issue
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 block w-full px-3 py-2 bg-surface-dark border border-brand-border rounded-md shadow-sm placeholder-text-secondary/70 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            placeholder="Please provide as much detail as possible."
                            required
                        />
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating || !serviceId}
                            className="mt-2 flex items-center gap-2 text-sm text-brand-primary font-semibold hover:text-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Wand2 size={16} />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-slate-900 bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light focus:ring-brand-primary"
                        >
                            Submit Ticket
                        </button>
                    </div>
                </form>
            </div>
             {user && (
                <SmsVerificationModal
                    isOpen={isSmsModalOpen}
                    onClose={() => setIsSmsModalOpen(false)}
                    onVerify={handleVerificationSuccess}
                    phoneToVerify={user.phone}
                />
            )}
        </div>
    );
};

export default NewTicket;