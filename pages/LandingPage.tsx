
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PricingCard from '../components/PricingCard';
import { AppContext } from '../context/AppContext';
import { ShieldCheck, Zap, Users } from 'lucide-react';

const FeatureHighlight: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-6 bg-surface-light rounded-xl shadow-lg transition-transform hover:-translate-y-1">
        <div className="bg-surface-dark p-4 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const { pricingPlans } = useContext(AppContext);

    const residentialPlans = pricingPlans.filter(p => p.class === 'Residential');

  return (
    <div className="bg-surface-dark text-slate-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-dark z-0">
             <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-6 py-24 sm:py-32 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">Your Home, Expertly Cared For</h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
            Get instant access to verified technicians for all your home service needs. From emergency repairs to routine maintenance, all under one subscription.
          </p>
          <a href="#pricing" className="bg-brand-primary hover:bg-brand-secondary text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 shadow-lg shadow-brand-primary/20">
            View Subscription Plans
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">Why Choose ServiceHub Pro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureHighlight 
                    icon={<ShieldCheck className="w-10 h-10 text-brand-primary"/>}
                    title="Verified Technicians"
                    description="All our professionals are background-checked, trained, and highly rated for your peace of mind."
                />
                <FeatureHighlight 
                    icon={<Zap className="w-10 h-10 text-brand-primary"/>}
                    title="Instant Emergency Help"
                    description="Raise a ticket and get a technician assigned in minutes for any urgent electrical, plumbing, or sanitary issue."
                />
                <FeatureHighlight 
                    icon={<Users className="w-10 h-10 text-brand-primary"/>}
                    title="One Simple Subscription"
                    description="Cover all your essential home services with a single, transparent monthly or annual plan."
                />
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-100 mb-4">Flexible Plans for Every Home</h2>
          <p className="text-lg text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Enjoy a 10% discount on all annual subscriptions!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {residentialPlans.map((plan, index) => (
                <div key={plan.id} className="transition-transform hover:scale-105 duration-300">
                    <Link to="/register" className="h-full block">
                        <PricingCard 
                            plan={plan} 
                            isPopular={index === 1} // Make the middle one popular
                            buttonText="Get Started" 
                        />
                    </Link>
                </div>
             ))}
          </div>
        </div>
      </section>
       <style>{`
            .animate-blob {
                animation: blob 7s infinite;
            }
            .animation-delay-4000 {
                animation-delay: -4s;
            }
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
        `}</style>
    </div>
  );
};

export default LandingPage;