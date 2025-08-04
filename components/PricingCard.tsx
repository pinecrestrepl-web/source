
import React, { useContext } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PricingPlan } from '../types';
import { AppContext } from '../context/AppContext';

interface PricingCardProps {
  plan: PricingPlan;
  isPopular?: boolean;
  onSelect?: (tier: string) => void;
  isSelected?: boolean;
  buttonText?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isPopular = false, onSelect, isSelected = false, buttonText = "Choose Plan" }) => {
  const { services } = useContext(AppContext);
  
  const handleSelect = () => {
    if (onSelect) {
      onSelect(plan.tier);
    }
  };

  const includedServices = plan.includedServiceIds
    .map(id => services.find(s => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  return (
    <div className={`border rounded-xl p-6 flex flex-col relative transition-all duration-300 h-full ${isSelected ? 'border-brand-primary ring-2 ring-brand-primary bg-surface-light' : (isPopular ? 'border-brand-primary border-2 bg-surface-light' : 'border-slate-700 bg-surface-light')}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-slate-900 px-3 py-1 text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-slate-100">{plan.tier}</h3>
      <p className="mt-2 text-slate-400">{plan.class}</p>
      
      <div className="mt-4">
        <span className="text-4xl font-extrabold text-slate-100">₹{plan.monthlyPrice}</span>
        <span className="text-slate-400">/month</span>
      </div>
      <p className="text-sm text-slate-400 mt-1">
        or ₹{Math.round(plan.annualPrice / 12)}/month billed annually (₹{Math.round(plan.annualPrice).toLocaleString('en-IN')})
        <span className="ml-2 bg-yellow-400/20 text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">10% OFF</span>
      </p>

      <ul className="mt-6 space-y-4 flex-grow">
        <li className="font-semibold text-slate-300">Included Services:</li>
        {includedServices.map((service) => (
          <li key={service.id} className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
            <span className="text-slate-300">{service.name}</span>
          </li>
        ))}
         <li className="font-semibold text-slate-300 pt-4">Features:</li>
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-brand-primary flex-shrink-0 mr-3" />
            <span className="text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleSelect}
        disabled={isSelected}
        className={`mt-8 w-full py-3 rounded-lg font-semibold transition-colors ${
          isSelected 
            ? 'bg-green-500 text-white cursor-not-allowed'
            : (isPopular 
              ? 'bg-brand-primary text-slate-900 hover:bg-brand-secondary' 
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600')
        }`}
      >
        {isSelected ? 'Selected' : buttonText}
      </button>
    </div>
  );
};

export default PricingCard;