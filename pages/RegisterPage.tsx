
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { UserRole, PricingPlan } from '../types';
import PricingCard from '../components/PricingCard';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { AlertTriangle } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const { register, pricingPlans, appSettings } = useContext(AppContext);
    const navigate = useNavigate();

    const residentialPlans = pricingPlans.filter(p => p.class === 'Residential');
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState(''); // Simulated, not used for login
    const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [error, setError] = useState('');
    
    // Role-specific fields
    const [address, setAddress] = useState('');
    const [upiId, setUpiId] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(residentialPlans[0] || null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getRegistrationDetails = () => ({
        name, email, phone, role, address, upiId, specialty, location,
        subscription: selectedPlan?.tier || null,
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (role === UserRole.CUSTOMER && !selectedPlan) {
            setError('Please select a subscription plan to continue.');
            return;
        }

        // For technicians, register directly
        if (role === UserRole.TECHNICIAN) {
            const success = register(getRegistrationDetails());
            if (success) {
                alert('Registration successful! Your profile will be reviewed for verification.');
                navigate('/');
            } else {
                setError('An account with this email already exists.');
            }
        } else { // For customers, open payment modal
            setIsModalOpen(true);
        }
    };
    
    const handlePaymentSuccess = () => {
        const success = register(getRegistrationDetails());
        setIsModalOpen(false);
        if (success) {
            navigate('/');
        } else {
            setError('An account with this email already exists.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-dark p-4 py-12">
            <div className="w-full max-w-4xl">
                <form onSubmit={handleFormSubmit}>
                    <div className="bg-surface-light border border-brand-border p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-center text-text-primary mb-2">Create Your Account</h2>
                        <p className="text-center text-text-secondary mb-8">Join ServiceHub Pro today!</p>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="label">Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="input" /></div>
                                <div><label className="label">Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" /></div>
                                <div><label className="label">Phone Number</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="input" /></div>
                                <div><label className="label">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" /></div>
                                <div className="md:col-span-2">
                                    <label className="label">I am a...</label>
                                    <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="input w-full">
                                        <option value={UserRole.CUSTOMER}>Customer</option>
                                        <option value={UserRole.TECHNICIAN}>Technician</option>
                                    </select>
                                </div>
                            </div>
                            <hr className="border-brand-border"/>
                            {role === UserRole.CUSTOMER && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-text-primary">Customer Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="label">Address</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="input" /></div>
                                        <div><label className="label">UPI ID (Optional)</label><input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} className="input" /></div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-text-primary text-center">Choose Your Plan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {residentialPlans.map(plan => (<PricingCard key={plan.tier} plan={plan} onSelect={() => setSelectedPlan(plan)} isSelected={selectedPlan?.tier === plan.tier} />))}
                                    </div>
                                </div>
                            )}
                            {role === UserRole.TECHNICIAN && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-text-primary">Technician Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="label">Specialty</label><input type="text" placeholder="e.g., Plumbing" value={specialty} onChange={e => setSpecialty(e.target.value)} required className="input" /></div>
                                        <div><label className="label">Primary Location</label><input type="text" placeholder="e.g., Springfield" value={location} onChange={e => setLocation(e.target.value)} required className="input" /></div>
                                        <div className="md:col-span-2"><label className="label">UPI ID for Payments</label><input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} required className="input" /></div>
                                    </div>
                                    <div className="bg-blue-500/10 text-blue-300 p-3 rounded-md text-sm">Your profile will be reviewed for verification after you sign up.</div>
                                </div>
                            )}
                            {error && (<div className="flex items-center gap-2 bg-red-500/10 text-red-400 text-sm p-3 rounded-md border border-red-500/20"><AlertTriangle size={18} /><span>{error}</span></div>)}
                            <div><button type="submit" className="w-full flex justify-center py-3 px-4 button-primary">Create Account</button></div>
                        </div>
                        <p className="mt-6 text-center text-sm text-text-secondary">Already have an account? <Link to="/login" className="font-medium text-brand-primary hover:text-brand-secondary">Log In</Link></p>
                    </div>
                </form>
            </div>
            {selectedPlan && role === UserRole.CUSTOMER && (
                 <PaymentGatewayModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handlePaymentSuccess} amount={selectedPlan.monthlyPrice} companyUpiId={appSettings.paymentGateway.upiId} />
            )}
            <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
                .input { display: block; width: 100%; padding: 0.5rem 0.75rem; background-color: var(--color-surface-dark); border: 1px solid var(--color-border); border-radius: 0.375rem; color: var(--color-text-primary); }
                .input:focus { outline: none; border-color: var(--color-brand-primary); box-shadow: 0 0 0 1px var(--color-brand-primary); }
                .button-primary { border: 1px solid transparent; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); font-weight: 600; color: #111827; background-color: var(--color-brand-primary); }
                .button-primary:hover { background-color: var(--color-brand-secondary); }
            `}</style>
        </div>
    );
};

export default RegisterPage;