import { FileText, Shield, Users, TrendingUp } from 'lucide-react';

export const SERVICE_HASH_CONSTANTS = {
  DUE_DILIGENCE: 'due-diligence',
  LOAN_APPROVAL: 'loan-approval',
  PROPERTY_VISIT: 'property-visit',
  AUCTION_PROCESS: 'auction-process',
} as const;

export interface IServiceData {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: any;
  features: string[];
  stats: {
    value: string;
    label: string;
    description: string;
  };
}

export const SERVICES_DATA: IServiceData[] = [
  {
    id: SERVICE_HASH_CONSTANTS.DUE_DILIGENCE,
    title: 'Due Diligence',
    description: 'Our comprehensive property verification service ensures you have complete information before making any bidding decisions.',
    shortDescription: 'Comprehensive property verification including title checks, legal clearances, encumbrance certificates, and property valuation to ensure you make informed decisions.',
    icon: FileText,
    features: [
      'Complete title verification and legal clearance checks',
      'Encumbrance certificate analysis and property history',
      'Professional property valuation and market analysis',
      'Legal compliance verification and documentation review',
    ],
    stats: {
      value: '100%',
      label: 'Verification Accuracy',
      description: 'Our expert team ensures complete accuracy in all property verifications',
    },
  },
  {
    id: SERVICE_HASH_CONSTANTS.LOAN_APPROVAL,
    title: 'Loan Approval',
    description: 'Get expert help with loan applications and connect with trusted financial institutions for quick approvals.',
    shortDescription: 'Expert assistance with loan applications, documentation, and connecting you with trusted financial institutions for quick and hassle-free loan approvals.',
    icon: Shield,
    features: [
      'Complete loan application assistance and documentation',
      'Direct connections with leading banks and NBFCs',
      'Competitive interest rates and flexible terms',
      'Fast-track processing for pre-approved customers',
    ],
    stats: {
      value: '48hrs',
      label: 'Average Approval Time',
      description: 'Fast-track loan processing with our banking partners',
    },
  },
  {
    id: SERVICE_HASH_CONSTANTS.PROPERTY_VISIT,
    title: 'Property Visit',
    description: 'Our local experts accompany you for property inspections, providing valuable insights and professional assessment.',
    shortDescription: 'Guided property inspections with our local experts who help you assess the property condition, location advantages, and potential issues before bidding.',
    icon: Users,
    features: [
      'Professional property condition assessment',
      'Location analysis and neighborhood insights',
      'Identification of potential issues and opportunities',
      'Market comparison and investment potential analysis',
    ],
    stats: {
      value: '500+',
      label: 'Properties Inspected',
      description: 'Extensive experience in property assessment across all categories',
    },
  },
  {
    id: SERVICE_HASH_CONSTANTS.AUCTION_PROCESS,
    title: 'Auction Process',
    description: 'From registration to final documentation, we guide you through every step of the online auction process.',
    shortDescription: 'Step-by-step guidance through the entire online auction process, from registration to bidding strategies and post-auction formalities.',
    icon: TrendingUp,
    features: [
      'Complete auction registration and EMD assistance',
      'Strategic bidding guidance and market insights',
      'Real-time auction monitoring and support',
      'Post-auction documentation and legal formalities',
    ],
    stats: {
      value: '24/7',
      label: 'Support Available',
      description: 'Round-the-clock assistance throughout the auction process',
    },
  },
];
