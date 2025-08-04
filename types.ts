
export enum UserRole {
  CUSTOMER = 'Customer',
  TECHNICIAN = 'Technician',
  ADMIN = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  upiId?: string;
  subscription?: string; // Changed to string to allow for dynamic plan tiers
}

export interface Technician extends User {
  role: UserRole.TECHNICIAN;
  specialty: string;
  location: string;
  rating: number;
  verified: boolean;
  jobsCompleted: number;
}

export interface Customer extends User {
  role: UserRole.CUSTOMER;
  address: string;
}

export enum SubscriptionTier {
  PREMIUM = "Premium",
  SUPER = "Super",
  ULTRA = "Ultra",
}

export enum ServiceClass {
    RESIDENTIAL = "Residential",
    COMMERCIAL = "Commercial",
}

export interface ServiceDefinition {
    id: string;
    name: string;
    description: string;
    class: ServiceClass;
    price: number; // Price for non-subscription or out-of-plan usage
}

export interface PricingPlan {
  id: string;
  tier: string; // The name of the plan, e.g., "Premium"
  monthlyPrice: number;
  annualPrice: number;
  features: string[]; // Descriptive text for marketing
  includedServiceIds: string[];
  class: ServiceClass;
}

export enum TicketStatus {
  OPEN = "Open",
  ASSIGNED = "Assigned",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export interface ServiceTicket {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  completedAt?: Date;
  technicianId?: string;
  technicianName?: string;
  rating?: number;
  feedback?: string;
  technicianEarning?: number;
  paymentStatus?: 'Pending' | 'Paid';
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CompanyInfo {
    name: string;
    address: string;
    email: string;
    phone: string;
    bank: {
        name: string;
        branch: string;
        accountNumber: string;
        ifsc: string;
        micr: string;
    };
    upiId: string;
}

export interface ThemeSettings {
    logoUrl: string;
    backgroundUrl: string;
    fontFamily: string;
    fontWeight: {
        regular: number;
        bold: number;
        extrabold: number;
    };
    lineHeight: number;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        light: string; // surface-light
        dark: string;  // surface-dark
        textPrimary: string;
        textSecondary: string;
        border: string;
    }
}

export interface AppSettings {
    companyInfo: CompanyInfo;
    paymentGateway: {
        primary: 'upi';
        upiId: string;
        stripeApiKey: string;
        razorpayApiKey: string;
        smsApiKey: string;
    };
    theme: ThemeSettings;
}

export interface CustomerPayment {
    id: string;
    customerId: string;
    customerName: string;
    amount: number;
    tier: string;
    paymentDate: Date;
    type: 'New Subscription' | 'Upgrade';
}