
import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PricingPlan, ServiceDefinition, AppSettings, ServiceClass, ThemeSettings } from '../../types';
import { Save, Plus, Trash2, Palette, Type, Droplet } from 'lucide-react';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('subscriptions');

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-6">Application Settings</h1>
            <div className="border-b border-brand-border mb-6">
                <nav className="flex gap-2 -mb-px flex-wrap">
                    <TabButton name="subscriptions" activeTab={activeTab} setActiveTab={setActiveTab}>Subscriptions</TabButton>
                    <TabButton name="services" activeTab={activeTab} setActiveTab={setActiveTab}>Services</TabButton>
                    <TabButton name="payment" activeTab={activeTab} setActiveTab={setActiveTab}>Company & Payment</TabButton>
                    <TabButton name="theme" activeTab={activeTab} setActiveTab={setActiveTab}>Theme & Appearance</TabButton>
                </nav>
            </div>
            <div>
                {activeTab === 'subscriptions' && <SubscriptionSettings />}
                {activeTab === 'services' && <ServiceSettings />}
                {activeTab === 'payment' && <PaymentSettings />}
                {activeTab === 'theme' && <ThemeSettingsComponent />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{name: string, activeTab: string, setActiveTab: (name: string) => void, children: React.ReactNode}> = ({ name, activeTab, setActiveTab, children }) => (
    <button onClick={() => setActiveTab(name)} className={`py-2 px-4 text-sm font-medium transition-colors rounded-t-md ${activeTab === name ? 'bg-surface-light border-b-2 border-brand-primary text-brand-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-light/50'}`}>
        {children}
    </button>
);

const SectionCard: React.FC<{children: React.ReactNode, title?: string, icon?: React.ReactNode}> = ({ children, title, icon }) => (
    <div className="bg-surface-light p-6 rounded-xl shadow-lg border border-brand-border relative">
        {title && <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">{icon}{title}</h3>}
        {children}
    </div>
);

const SubscriptionSettings = () => {
    const { pricingPlans, services, updatePricingPlans } = useContext(AppContext);
    const [editablePlans, setEditablePlans] = useState<PricingPlan[]>(JSON.parse(JSON.stringify(pricingPlans)));

    const handlePlanChange = (index: number, field: keyof PricingPlan, value: any) => {
        const newPlans = [...editablePlans];
        (newPlans[index] as any)[field] = value;
        setEditablePlans(newPlans);
    };
    
    const handleServiceLink = (planIndex: number, serviceId: string) => {
        const newPlans = [...editablePlans];
        const plan = newPlans[planIndex];
        const serviceIds = plan.includedServiceIds;
        if(serviceIds.includes(serviceId)) {
            plan.includedServiceIds = serviceIds.filter(id => id !== serviceId);
        } else {
            plan.includedServiceIds.push(serviceId);
        }
        setEditablePlans(newPlans);
    };

    const addNewPlan = () => {
        setEditablePlans([...editablePlans, {
            id: `plan${Date.now()}`,
            tier: 'New Plan',
            monthlyPrice: 0,
            annualPrice: 0,
            features: [],
            includedServiceIds: [],
            class: ServiceClass.RESIDENTIAL,
        }]);
    };
    
    const saveChanges = () => {
        updatePricingPlans(editablePlans);
        alert('Subscription plans updated!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={saveChanges} className="button-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
            </div>
            {editablePlans.map((plan, index) => (
                <div key={plan.id} className="bg-surface-light p-6 rounded-xl shadow-lg border border-brand-border">
                    <input value={plan.tier} onChange={e => handlePlanChange(index, 'tier', e.target.value)} className="text-xl font-bold w-full p-1 -m-1 rounded bg-transparent hover:bg-surface-dark focus:bg-surface-dark outline-none text-text-primary" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                        <div><label className="label">Monthly Price (₹) : </label><input type="number" value={plan.monthlyPrice} onChange={e => handlePlanChange(index, 'monthlyPrice', parseFloat(e.target.value))} className="input" /></div>
                        <div><label className="label">Annual Price (₹) : </label><input type="number" value={plan.annualPrice} onChange={e => handlePlanChange(index, 'annualPrice', parseFloat(e.target.value))} className="input" /></div>
                        <div className="md:col-span-2"><label className="label">Features : (comma-separated)</label><input value={plan.features.join(', ')} onChange={e => handlePlanChange(index, 'features', e.target.value.split(',').map(s => s.trim()))} className="input" /></div>
                        <div className="md:col-span-2">
                             <label className="label">Included Free Services : </label>
                             <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                {services.map(service => (
                                    <label key={service.id} className="flex items-center gap-2 text-sm p-2 rounded-md bg-surface-dark text-text-primary">
                                        <input type="checkbox" checked={plan.includedServiceIds.includes(service.id)} onChange={() => handleServiceLink(index, service.id)} className="accent-brand-primary"/>
                                        {service.name}
                                    </label>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={addNewPlan} className="button-secondary flex items-center gap-2"><Plus size={16} /> Add New Plan</button>
            <style>{`.label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 0.5rem; } .input { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border); border-radius: 0.375rem; background-color: var(--color-surface-dark); color: var(--color-text-primary); } .button-primary { color: #111827; background-color: var(--color-brand-primary); padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; } .button-secondary { background-color: var(--color-surface-dark); border: 1px solid var(--color-border); color: var(--color-text-primary); padding: 0.5rem 1rem; border-radius: 0.375rem; } .button-secondary:hover{ background-color: var(--color-border); }`}</style>
        </div>
    );
};

const ServiceSettings = () => {
    const { services, updateServices } = useContext(AppContext);
    const [editableServices, setEditableServices] = useState<ServiceDefinition[]>(JSON.parse(JSON.stringify(services)));

    const handleServiceChange = (index: number, field: keyof ServiceDefinition, value: any) => {
        const newServices = [...editableServices];
        (newServices[index] as any)[field] = value;
        setEditableServices(newServices);
    };

    const addNewService = () => {
        setEditableServices([...editableServices, {
            id: `serv${Date.now()}`,
            name: 'New Service',
            description: '',
            price: 0,
            class: ServiceClass.RESIDENTIAL
        }]);
    };

    const deleteService = (index: number) => {
        if(window.confirm('Are you sure you want to delete this service?')) {
            setEditableServices(editableServices.filter((_, i) => i !== index));
        }
    };
    
    const saveChanges = () => {
        updateServices(editableServices);
        alert('Services updated!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={saveChanges} className="button-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
            </div>
            {editableServices.map((service, index) => (
                 <SectionCard key={service.id}>
                    <button onClick={() => deleteService(index)} className="absolute top-4 right-4 text-red-500/70 hover:text-red-500"><Trash2 size={18} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="label">Service Name : </label><input value={service.name} onChange={e => handleServiceChange(index, 'name', e.target.value)} className="input" /></div>
                        <div><label className="label">Price (₹) : </label><input type="number" value={service.price} onChange={e => handleServiceChange(index, 'price', parseFloat(e.target.value))} className="input" /></div>
                        <div className="md:col-span-2"><label className="label">Description : </label><textarea value={service.description} onChange={e => handleServiceChange(index, 'description', e.target.value)} className="input" rows={2} /></div>
                        <div><label className="label">Class : </label>
                            <select value={service.class} onChange={e => handleServiceChange(index, 'class', e.target.value)} className="input w-full">
                                <option value={ServiceClass.RESIDENTIAL}>Residential</option>
                                <option value={ServiceClass.COMMERCIAL}>Commercial</option>
                            </select>
                        </div>
                    </div>
                 </SectionCard>
            ))}
            <button onClick={addNewService} className="button-secondary flex items-center gap-2"><Plus size={16} /> Add New Service</button>
        </div>
    );
};

const PaymentSettings = () => {
    const { appSettings, updateAppSettings } = useContext(AppContext);
    const [editableSettings, setEditableSettings] = useState<AppSettings>(JSON.parse(JSON.stringify(appSettings)));

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableSettings(prev => ({...prev, companyInfo: {...prev.companyInfo, [name]: value}}));
    };
    
    const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableSettings(prev => ({...prev, companyInfo: {...prev.companyInfo, bank: {...prev.companyInfo.bank, [name]: value}}}));
    };
    
    const handleGatewayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableSettings(prev => ({...prev, paymentGateway: {...prev.paymentGateway, [name]: value}}));
    };
    
    const saveChanges = () => {
        updateAppSettings(editableSettings);
        alert('Company and payment settings updated!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={saveChanges} className="button-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
            </div>
             <SectionCard title="Company Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label className="label">Company Name : </label><input name="name" value={editableSettings.companyInfo.name} onChange={handleInfoChange} className="input" /></div>
                    <div><label className="label">Email : </label><input name="email" value={editableSettings.companyInfo.email} onChange={handleInfoChange} className="input" /></div>
                    <div className="md:col-span-2"><label className="label">Address : </label><input name="address" value={editableSettings.companyInfo.address} onChange={handleInfoChange} className="input" /></div>
                    <div><label className="label">Phone : </label><input name="phone" value={editableSettings.companyInfo.phone} onChange={handleInfoChange} className="input" /></div>
                </div>
             </SectionCard>
             <SectionCard title="Bank Account">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label className="label">Bank Name : </label><input name="name" value={editableSettings.companyInfo.bank.name} onChange={handleBankChange} className="input" /></div>
                    <div><label className="label">Branch : </label><input name="branch" value={editableSettings.companyInfo.bank.branch} onChange={handleBankChange} className="input" /></div>
                    <div><label className="label">Account Number : </label><input name="accountNumber" value={editableSettings.companyInfo.bank.accountNumber} onChange={handleBankChange} className="input" /></div>
                    <div><label className="label">IFSC : </label><input name="ifsc" value={editableSettings.companyInfo.bank.ifsc} onChange={handleBankChange} className="input" /></div>
                </div>
             </SectionCard>
             <SectionCard title="Payment Gateway & SMS">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     <div><label className="label">Primary UPI ID : </label><input name="upiId" value={editableSettings.paymentGateway.upiId} onChange={handleGatewayChange} className="input" /></div>
                     <div><label className="label">Stripe API Key :  (simulated)</label><input name="stripeApiKey" value={editableSettings.paymentGateway.stripeApiKey} onChange={handleGatewayChange} className="input" /></div>
                     <div><label className="label">Razorpay API Key :  (simulated)</label><input name="razorpayApiKey" value={editableSettings.paymentGateway.razorpayApiKey} onChange={handleGatewayChange} className="input" /></div>
                     <div><label className="label">SMS API Key :  (simulated)</label><input name="smsApiKey" value={editableSettings.paymentGateway.smsApiKey} onChange={handleGatewayChange} className="input" /></div>
                </div>
             </SectionCard>
        </div>
    );
};

const ThemeSettingsComponent = () => {
    const { appSettings, updateAppSettings } = useContext(AppContext);
    const [theme, setTheme] = useState<ThemeSettings>(JSON.parse(JSON.stringify(appSettings.theme)));

    const handleColorChange = (colorName: keyof ThemeSettings['colors'], value: string) => {
        setTheme(prev => ({ ...prev, colors: { ...prev.colors, [colorName]: value } }));
    };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTheme(prev => ({...prev, [name]: value }));
    };
    
    const handleThemeChange = (field: keyof ThemeSettings, value: any) => {
        setTheme(prev => ({ ...prev, [field]: value }));
    };

    const handleFontWeightChange = (weight: keyof ThemeSettings['fontWeight'], value: number) => {
        setTheme(prev => ({ ...prev, fontWeight: { ...prev.fontWeight, [weight]: value } }));
    };

    const saveChanges = () => {
        updateAppSettings({ ...appSettings, theme });
        alert('Theme settings updated!');
    };

    const colorFields: (keyof ThemeSettings['colors'])[] = ['primary', 'secondary', 'accent', 'light', 'dark', 'textPrimary', 'textSecondary', 'border'];
     const fontFamilies = [
        "'Inter', sans-serif",
        "'Roboto', sans-serif",
        "'Montserrat', sans-serif",
        "'Lato', sans-serif",
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={saveChanges} className="button-primary flex items-center gap-2"><Save size={16} /> Save Changes</button>
            </div>
            <SectionCard title="Brand Appearance">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label className="label">Logo URL : </label><input name="logoUrl" value={theme.logoUrl} onChange={handleUrlChange} className="input" placeholder="https://example.com/logo.png"/></div>
                    <div><label className="label">Background Image URL : </label><input name="backgroundUrl" value={theme.backgroundUrl} onChange={handleUrlChange} className="input" placeholder="https://example.com/background.jpg"/></div>
                </div>
            </SectionCard>
            
            <SectionCard title="Typography" icon={<Type />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="label">Font Family : </label>
                        <select value={theme.fontFamily} onChange={e => handleThemeChange('fontFamily', e.target.value)} className="input">
                            {fontFamilies.map(font => (
                                <option key={font} value={font}>{font.split(',')[0].replace(/'/g, '')}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label className="label">Line Height</label>
                        <input type="number" step="0.1" value={theme.lineHeight} onChange={e => handleThemeChange('lineHeight', parseFloat(e.target.value))} className="input" />
                    </div>
                     <div className="md:col-span-2 grid grid-cols-3 gap-4">
                         <div>
                            <label className="label">Regular Weight : </label>
                            <input type="number" step="100" min="100" max="900" value={theme.fontWeight.regular} onChange={e => handleFontWeightChange('regular', parseInt(e.target.value, 10))} className="input" />
                        </div>
                         <div>
                            <label className="label">Bold Weight : </label>
                            <input type="number" step="100" min="100" max="900" value={theme.fontWeight.bold} onChange={e => handleFontWeightChange('bold', parseInt(e.target.value, 10))} className="input" />
                        </div>
                         <div>
                            <label className="label">Extra-Bold Weight : </label>
                            <input type="number" step="100" min="100" max="900" value={theme.fontWeight.extrabold} onChange={e => handleFontWeightChange('extrabold', parseInt(e.target.value, 10))} className="input" />
                        </div>
                     </div>
                </div>
            </SectionCard>

             <SectionCard title="Color Palette" icon={<Palette />}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {colorFields.map(colorName => (
                        <div key={colorName}>
                            <label className="label capitalize flex items-center gap-1.5"><Droplet size={12} style={{ color: theme.colors[colorName] }}/> {colorName}</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={theme.colors[colorName]} onChange={e => handleColorChange(colorName, e.target.value)} className="w-10 h-10 p-0 border-none rounded bg-transparent cursor-pointer"/>
                                <input value={theme.colors[colorName]} onChange={e => handleColorChange(colorName, e.target.value)} className="input w-full"/>
                            </div>
                        </div>
                    ))}
                </div>
             </SectionCard>
        </div>
    );
};


export default Settings;