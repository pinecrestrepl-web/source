
import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface SmsVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  phoneToVerify: string;
}

const SmsVerificationModal: React.FC<SmsVerificationModalProps> = ({ isOpen, onClose, onVerify, phoneToVerify }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const MOCK_CODE = '123456'; // Hardcoded for demo purposes

  if (!isOpen) return null;

  const handleVerify = () => {
    setError('');
    if (code === MOCK_CODE) {
      onVerify();
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };
  
  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 4) {
      return `******${phone.slice(-4)}`;
    }
    return phone;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-light rounded-lg shadow-xl p-6 w-full max-w-sm relative border border-brand-border">
        <button onClick={onClose} className="absolute top-3 right-3 text-text-secondary hover:text-text-primary">
          <X size={24} />
        </button>
        <div className="text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-green-500"/>
            <h2 className="text-2xl font-bold text-text-primary mt-4">Verify Your Identity</h2>
            <p className="text-text-secondary mt-2">
                For your security, we've sent a verification code to your phone number ending in <span className="font-semibold text-text-primary">{formatPhoneNumber(phoneToVerify)}</span>.
            </p>
            <p className="text-sm text-text-secondary/70 mt-2">(For this demo, the code is always 123456)</p>
        </div>
        
        <div className="mt-6">
            <label htmlFor="sms-code" className="sr-only">Verification Code</label>
            <input 
                type="text"
                id="sms-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 bg-surface-dark border-2 border-brand-border rounded-md focus:border-brand-primary focus:ring-brand-primary text-text-primary"
                placeholder="______"
            />
        </div>

        {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
        
        <div className="mt-6">
            <button 
              onClick={handleVerify}
              className="w-full bg-brand-primary text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-brand-secondary transition-all disabled:opacity-50"
              disabled={code.length !== 6}
            >
              Verify & Proceed
            </button>
        </div>
        <p className="text-xs text-text-secondary text-center mt-4">Didn't get a code? <button className="font-semibold text-brand-primary hover:underline">Resend</button></p>
      </div>
    </div>
  );
};

export default SmsVerificationModal;