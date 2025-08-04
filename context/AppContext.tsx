import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { User, ServiceTicket, Technician, InventoryItem, Customer, UserRole, CustomerPayment, TicketStatus, PricingPlan, ServiceDefinition, AppSettings } from '../types';
import { MOCK_USERS, MOCK_TICKETS, MOCK_INVENTORY, MOCK_CUSTOMER_PAYMENTS, MOCK_PRICING_PLANS, MOCK_SERVICES, INITIAL_APP_SETTINGS } from '../data/mockData';

type RegisterDetails = {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    address?: string;
    upiId?: string;
    specialty?: string;
    location?: string;
    subscription?: string | null;
};

interface AppContextType {
  user: User | null;
  login: (email: string, role: UserRole) => User | null;
  completeLogin: (user: User) => void;
  logout: () => void;
  register: (details: RegisterDetails) => boolean;
  updateSubscription: (userId: string, tier: string) => void;
  users: User[];
  tickets: ServiceTicket[];
  inventory: InventoryItem[];
  customerPayments: CustomerPayment[];
  pricingPlans: PricingPlan[];
  services: ServiceDefinition[];
  appSettings: AppSettings;
  addTicket: (ticket: ServiceTicket) => void;
  updateTicket: (ticket: ServiceTicket) => void;
  payTechnician: (ticketId: string) => void;
  updatePricingPlans: (plans: PricingPlan[]) => void;
  updateServices: (services: ServiceDefinition[]) => void;
  updateAppSettings: (settings: AppSettings) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tickets, setTickets] = useState<ServiceTicket[]>(MOCK_TICKETS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [customerPayments, setCustomerPayments] = useState<CustomerPayment[]>(MOCK_CUSTOMER_PAYMENTS);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(MOCK_PRICING_PLANS);
  const [services, setServices] = useState<ServiceDefinition[]>(MOCK_SERVICES);
  const [appSettings, setAppSettings] = useState<AppSettings>(INITIAL_APP_SETTINGS);
  
  const login = (email: string, role: UserRole): User | null => {
    const foundUser = users.find(u => u.email === email && u.role === role);
    return foundUser || null;
  };

  const completeLogin = (userToLogin: User) => {
      setUser(userToLogin);
  };

  const logout = () => {
    setUser(null);
  };

  const register = (details: RegisterDetails): boolean => {
    const existingUser = users.find(u => u.email === details.email);
    if (existingUser) {
      return false; // User already exists
    }

    let newUser: User;
    if (details.role === UserRole.CUSTOMER) {
      newUser = {
        id: `cust${Date.now()}`,
        name: details.name,
        email: details.email,
        phone: details.phone,
        role: UserRole.CUSTOMER,
        createdAt: new Date(),
        address: details.address || '',
        upiId: details.upiId,
        subscription: details.subscription || undefined,
      } as Customer;

      // Add customer payment record
      const plan = pricingPlans.find(p => p.tier === details.subscription);
      if(plan) {
        const newPayment: CustomerPayment = {
            id: `pay${Date.now()}`,
            customerId: newUser.id,
            customerName: newUser.name,
            amount: plan.monthlyPrice,
            tier: plan.tier,
            paymentDate: new Date(),
            type: 'New Subscription'
        };
        setCustomerPayments(prev => [newPayment, ...prev]);
      }

    } else { // Technician
      newUser = {
        id: `tech${Date.now()}`,
        name: details.name,
        email: details.email,
        phone: details.phone,
        role: UserRole.TECHNICIAN,
        createdAt: new Date(),
        specialty: details.specialty || 'General',
        location: details.location || '',
        upiId: details.upiId,
        rating: 0,
        verified: false, // Technicians start as unverified
        jobsCompleted: 0,
      } as Technician;
    }

    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    console.log(`New user registered: ${newUser.name}. A notification would be sent.`);
    if (newUser.role === UserRole.CUSTOMER) {
        alert(`Welcome, ${newUser.name}! Your subscription is now active. An SMS and email has been sent to you and the admin.`);
    }
    return true;
  };
  
  const updateSubscription = (userId: string, tier: string) => {
    const customer = users.find(u => u.id === userId);
    const plan = pricingPlans.find(p => p.tier === tier);

    if (customer && plan) {
        const newPayment: CustomerPayment = {
            id: `pay${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            amount: plan.monthlyPrice,
            tier: plan.tier,
            paymentDate: new Date(),
            type: 'Upgrade'
        };
        setCustomerPayments(prev => [newPayment, ...prev]);

        setUsers(prevUsers => prevUsers.map(u => 
            u.id === userId ? { ...u, subscription: tier } : u
        ));

        if (user?.id === userId) {
            setUser(prevUser => prevUser ? { ...prevUser, subscription: tier } as User : null);
        }
        alert(`Subscription for ${customer.name} updated to ${tier}. An SMS and email has been sent to the customer and admin.`);
    }
  };

  const addTicket = (ticket: ServiceTicket) => {
    setTickets(prevTickets => [ticket, ...prevTickets]);
    alert('Your service ticket has been created successfully!');
  };
  
  const updateTicket = (updatedTicket: ServiceTicket) => {
      let finalTicket = { ...updatedTicket };
      // If job is being completed, set earning and payment status
      if (finalTicket.status === TicketStatus.COMPLETED && !finalTicket.technicianEarning) {
          finalTicket.technicianEarning = Math.floor(Math.random() * (2000 - 500 + 1) + 500); // Random earning between ₹500-₹2000
          finalTicket.paymentStatus = 'Pending';
          finalTicket.completedAt = new Date();
      }
      setTickets(prevTickets => prevTickets.map(t => t.id === finalTicket.id ? finalTicket : t));
  };
  
  const payTechnician = (ticketId: string) => {
      setTickets(prevTickets => prevTickets.map(t =>
          t.id === ticketId ? { ...t, paymentStatus: 'Paid' } : t
      ));
  };

  const updatePricingPlans = (plans: PricingPlan[]) => setPricingPlans(plans);
  const updateServices = (svcs: ServiceDefinition[]) => setServices(svcs);
  const updateAppSettings = (settings: AppSettings) => setAppSettings(settings);

  const value = useMemo(() => ({
    user,
    login,
    completeLogin,
    logout,
    register,
    updateSubscription,
    users,
    tickets,
    inventory,
    customerPayments,
    pricingPlans,
    services,
    appSettings,
    addTicket,
    updateTicket,
    payTechnician,
    updatePricingPlans,
    updateServices,
    updateAppSettings
  }), [user, users, tickets, inventory, customerPayments, pricingPlans, services, appSettings]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};