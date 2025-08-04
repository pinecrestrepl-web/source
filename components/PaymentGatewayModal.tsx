import React from 'react';
import { X } from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  companyUpiId: string;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose, onSuccess, amount, companyUpiId }) => {
  if (!isOpen) return null;

  const handlePayment = () => {
    // In a real app, this would integrate with a payment SDK
    console.log(`Simulating payment of ₹${amount.toFixed(2)}`);
    // Simulate a successful payment after a short delay
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light rounded-lg shadow-xl p-6 w-full max-w-sm relative border border-brand-border">
        <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-brand-primary text-center">Complete Your Payment</h2>
        <p className="text-center text-text-secondary mt-2">To activate your subscription</p>
        
        <div className="mt-6 bg-surface-dark p-4 rounded-lg text-center">
            <p className="text-sm text-text-secondary">Total Amount</p>
            <p className="text-4xl font-extrabold text-text-primary">₹{amount.toFixed(2)}</p>
        </div>

        <div className="mt-4 text-center">
            <p className="text-sm text-text-secondary">Pay using any UPI app to:</p>
            <p className="font-semibold text-brand-primary mt-1 select-all">{companyUpiId}</p>
        </div>
        
        <div className="mt-8">
            <button 
              onClick={handlePayment}
              className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all"
            >
              Simulate Successful Payment
            </button>
        </div>
        <p className="text-xs text-text-secondary text-center mt-4">This is a simulated payment gateway for demonstration.</p>
      </div>
    </div>
  );
};

export default PaymentGatewayModal;