import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Customer, PricingPlan } from '../../types';
import PricingCard from '../../components/PricingCard';
import PaymentGatewayModal from '../../components/PaymentGatewayModal';
import { CheckCircle } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
    const { user, updateSubscription, pricingPlans, appSettings } = useContext(AppContext);
    const customer = user as Customer;
    
    const [selectedPlanTier, setSelectedPlanTier] = useState<string | null>(customer.subscription || null);
    const [planToPay, setPlanToPay] = useState<PricingPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (customer.subscription) {
            setSelectedPlanTier(customer.subscription);
        }
    }, [customer.subscription]);

    const handleSelectPlan = (tier: string) => {
        setSelectedPlanTier(tier);
    };

    const handleConfirmChange = () => {
        if (selectedPlanTier && selectedPlanTier !== customer.subscription) {
            const planDetails = pricingPlans.find(p => p.tier === selectedPlanTier);
            if(planDetails) {
                setPlanToPay(planDetails);
                setIsModalOpen(true);
            }
        }
    };
    
    const handlePaymentSuccess = () => {
        if (planToPay) {
            updateSubscription(customer.id, planToPay.tier);
            setShowSuccess(true);
            setIsModalOpen(false);
            setPlanToPay(null);
            setTimeout(() => setShowSuccess(false), 4000);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Your Subscription</h1>
            <p className="text-slate-600 mb-6">Change your plan anytime. The new plan will be effective immediately after payment.</p>
            
            {showSuccess && (
                 <div className="mb-6 flex items-center gap-2 text-green-700 bg-green-100 p-4 rounded-md font-semibold">
                    <CheckCircle size={20} />
                    <span>Your subscription has been updated successfully!</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {pricingPlans.map((plan, index) => (
                    <PricingCard 
                        key={plan.id}
                        plan={plan}
                        isPopular={index === 1}
                        onSelect={handleSelectPlan}
                        isSelected={selectedPlanTier === plan.tier}
                        buttonText={customer.subscription === plan.tier ? "Current Plan" : "Switch to this Plan"}
                    />
                ))}
            </div>

            <div className="mt-8 flex flex-col items-center">
                {selectedPlanTier && selectedPlanTier !== customer.subscription && (
                    <button 
                        onClick={handleConfirmChange}
                        className="bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-secondary transition-colors shadow-lg"
                    >
                        Confirm Change to {selectedPlanTier} Plan
                    </button>
                )}
            </div>
            
            {planToPay && (
                <PaymentGatewayModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                    amount={planToPay.monthlyPrice}
                    companyUpiId={appSettings.paymentGateway.upiId}
                />
            )}
        </div>
    );
};

export default SubscriptionPage;