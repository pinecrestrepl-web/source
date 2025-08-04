
import { User, Technician, Customer, ServiceTicket, InventoryItem, SubscriptionTier, TicketStatus, UserRole, CustomerPayment, PricingPlan, ServiceClass, ServiceDefinition, AppSettings } from '../types';
import { COMPANY_DETAILS } from './companyData';

export const MOCK_SERVICES: ServiceDefinition[] = [
    { id: 'serv1', name: 'Emergency Plumbing', description: 'Immediate assistance for leaks, burst pipes, etc.', class: ServiceClass.RESIDENTIAL, price: 1500 },
    { id: 'serv2', name: 'Emergency Electrical', description: 'Power outages, short circuits, etc.', class: ServiceClass.RESIDENTIAL, price: 1500 },
    { id: 'serv3', name: 'Sanitary Services', description: 'Clogged drains, toilet issues.', class: ServiceClass.RESIDENTIAL, price: 1200 },
    { id: 'serv4', name: 'Appliance Repair', description: 'Repair for major home appliances.', class: ServiceClass.RESIDENTIAL, price: 1800 },
    { id: 'serv5', name: 'Annual HVAC Maintenance', description: 'Full check-up and cleaning of HVAC systems.', class: ServiceClass.COMMERCIAL, price: 8000 },
    { id: 'serv6', name: 'Commercial Electrical Audit', description: 'Safety and efficiency audit for commercial properties.', class: ServiceClass.COMMERCIAL, price: 15000 },
];

export const MOCK_PRICING_PLANS: PricingPlan[] = [
    {
        id: 'plan1',
        tier: SubscriptionTier.PREMIUM,
        monthlyPrice: 249,
        annualPrice: 249 * 12 * 0.9,
        features: ["24/7 Emergency Support", "Priority Booking"],
        includedServiceIds: ['serv1', 'serv2'],
        class: ServiceClass.RESIDENTIAL,
    },
    {
        id: 'plan2',
        tier: SubscriptionTier.SUPER,
        monthlyPrice: 399,
        annualPrice: 399 * 12 * 0.9,
        features: ["All Premium Benefits", "No Visit Charges"],
        includedServiceIds: ['serv1', 'serv2', 'serv3'],
        class: ServiceClass.RESIDENTIAL,
    },
    {
        id: 'plan3',
        tier: SubscriptionTier.ULTRA,
        monthlyPrice: 599,
        annualPrice: 599 * 12 * 0.9,
        features: ["All Super Benefits", "Small Parts Included", "Dedicated Service Manager"],
        includedServiceIds: ['serv1', 'serv2', 'serv3', 'serv4'],
        class: ServiceClass.RESIDENTIAL,
    },
];

export const MOCK_USERS: (Customer | Technician | User)[] = [
  { id: 'cust1', name: 'Alice Johnson', email: 'customer@example.com', phone: '9876543210', role: UserRole.CUSTOMER, createdAt: new Date('2023-01-15T09:00:00Z'), address: '123 Maple St, Springfield', upiId: 'alice@upi', subscription: SubscriptionTier.PREMIUM },
  { id: 'tech1', name: 'Bob Vance', email: 'technician@example.com', phone: '9876543211', role: UserRole.TECHNICIAN, createdAt: new Date('2023-02-20T11:00:00Z'), specialty: 'Plumbing', location: 'Springfield', rating: 4.8, verified: true, jobsCompleted: 25, upiId: 'bobvance@upi' },
  { id: 'admin1', name: 'Charles Admin', email: 'admin@example.com', phone: '9876543212', role: UserRole.ADMIN, createdAt: new Date('2023-01-01T08:00:00Z') },
  { id: 'cust2', name: 'Diana Prince', email: 'diana@example.com', phone: '9876543213', role: UserRole.CUSTOMER, createdAt: new Date('2023-05-10T14:00:00Z'), address: '456 Oak Ave, Metropolis', upiId: 'diana@upi', subscription: SubscriptionTier.ULTRA },
  { id: 'tech2', name: 'Eve Masters', email: 'eve@example.com', phone: '9876543214', role: UserRole.TECHNICIAN, createdAt: new Date('2023-06-01T16:00:00Z'), specialty: 'Electrical', location: 'Metropolis', rating: 4.9, verified: true, jobsCompleted: 42, upiId: 'evem@upi' },
];

export const MOCK_TICKETS: ServiceTicket[] = [
  { id: 'tkt1', customerId: 'cust1', customerName: 'Alice Johnson', serviceType: 'Emergency Plumbing', description: 'The kitchen sink faucet is constantly dripping.', status: TicketStatus.COMPLETED, createdAt: new Date('2023-10-26T10:00:00Z'), completedAt: new Date('2023-10-26T12:00:00Z'), technicianId: 'tech1', technicianName: 'Bob Vance', rating: 5, feedback: 'Bob was quick and professional!', technicianEarning: 750, paymentStatus: 'Paid' },
  { id: 'tkt2', customerId: 'cust2', customerName: 'Diana Prince', serviceType: 'Emergency Electrical', description: 'An outlet in the living room has no power.', status: TicketStatus.ASSIGNED, createdAt: new Date('2023-10-28T14:30:00Z'), technicianId: 'tech2', technicianName: 'Eve Masters' },
  { id: 'tkt3', customerId: 'cust1', customerName: 'Alice Johnson', serviceType: 'Sanitary Services', description: 'The bathroom shower drain is not draining.', status: TicketStatus.OPEN, createdAt: new Date() },
  { id: 'tkt4', customerId: 'cust2', customerName: 'Diana Prince', serviceType: 'Appliance Repair', description: 'AC is not cooling the room properly.', status: TicketStatus.COMPLETED, createdAt: new Date('2023-09-15T11:00:00Z'), completedAt: new Date('2023-09-15T15:00:00Z'), technicianId: 'tech2', technicianName: 'Eve Masters', rating: 4, feedback: 'Good work', technicianEarning: 1500, paymentStatus: 'Paid' },
  { id: 'tkt5', customerId: 'cust1', customerName: 'Alice Johnson', serviceType: 'Emergency Plumbing', description: 'No hot water.', status: TicketStatus.COMPLETED, createdAt: new Date(), completedAt: new Date(), technicianId: 'tech1', technicianName: 'Bob Vance', rating: 5, feedback: 'Excellent!', technicianEarning: 1200, paymentStatus: 'Pending' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', name: '1/2" Copper Pipe (ft)', quantity: 150, price: 250 },
    { id: 'inv2', name: 'PVC Cement (8oz)', quantity: 40, price: 650 },
    { id: 'inv3', name: '15 Amp Circuit Breaker', quantity: 75, price: 950 },
    { id: 'inv4', name: 'GFCI Outlet', quantity: 120, price: 1500 },
    { id: 'inv5', name: 'Faucet Washer Kit', quantity: 200, price: 420 },
];

export const MOCK_CUSTOMER_PAYMENTS: CustomerPayment[] = [
    { id: 'pay1', customerId: 'cust1', customerName: 'Alice Johnson', amount: 249, tier: SubscriptionTier.PREMIUM, paymentDate: new Date('2023-01-15T09:01:00Z'), type: 'New Subscription' },
    { id: 'pay2', customerId: 'cust2', customerName: 'Diana Prince', amount: 599, tier: SubscriptionTier.ULTRA, paymentDate: new Date('2023-05-10T14:01:00Z'), type: 'New Subscription' },
];

export const INITIAL_APP_SETTINGS: AppSettings = {
    companyInfo: COMPANY_DETAILS,
    paymentGateway: {
        primary: 'upi',
        upiId: COMPANY_DETAILS.upiId,
        stripeApiKey: 'sk_test_...',
        razorpayApiKey: 'rzp_test_...',
        smsApiKey: 'sms_test_...'
    },
    theme: {
        logoUrl: '',
        backgroundUrl: '',
        fontFamily: "'Inter', sans-serif",
        fontWeight: {
            regular: 400,
            bold: 700,
            extrabold: 800,
        },
        lineHeight: 1.6,
        colors: {
            primary: '#22d3ee',
            secondary: '#06b6d4',
            accent: '#facc15',
            light: '#1f2937', // surface-light
            dark: '#111827',   // surface-dark
            textPrimary: '#e2e8f0',
            textSecondary: '#94a3b8',
            border: '#374151',
        }
    }
};