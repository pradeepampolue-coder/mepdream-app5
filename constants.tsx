
import React from 'react';
import { 
  Zap, 
  Settings, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Truck, 
  HardHat, 
  Activity,
  Home,
  Building2,
  ShoppingBag,
  Utensils,
  Warehouse,
  Hospital,
  Users,
  Briefcase,
  Layers
} from 'lucide-react';
import { ServiceItem, IndustryItem, ProductItem, ResourceItem } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'mep-om',
    title: 'MEP Engineering Services – O & M',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200',
    description: 'Comprehensive Operations and Maintenance (O&M) solutions for mechanical, electrical, and plumbing systems. We ensure your building infrastructure operates at peak efficiency with zero downtime.',
    details: [
      'Operation & Maintenance of Electrical Systems (HT/LT Panels, Transformers, DG Sets)',
      'HVAC Systems Maintenance (Chillers, AHUs, Split/Window ACs)',
      'Plumbing & Sanitary System Management',
      'Fire Fighting & Life Safety Systems Maintenance',
      'Water Treatment Plant (WTP) & STP Operations',
      'Energy Audits & Sustainability Consulting'
    ]
  },
  {
    id: 'staffing',
    title: 'Staffing Solutions',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    description: 'Strategic manpower solutions tailored to your business needs. We bridge the gap between talent and opportunity, providing skilled, semi-skilled, and professional personnel.',
    details: [
      'Temporary & Contractual Staffing',
      'Permanent Recruitment Services',
      'Technical & Non-Technical Manpower Supply',
      'On-site Managed Services',
      'Specialized Engineering Talent Acquisition',
      'Skill Assessment & Training Programs'
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll Management Services',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
    description: 'End-to-end payroll processing and statutory compliance management. We handle the complexities of payroll so you can focus on your core business growth.',
    details: [
      'Salary Processing & Disbursement',
      'Statutory Compliances (PF, ESI, PT, LWF)',
      'Income Tax & TDS Management',
      'Employee Query Management & Helpdesk',
      'Leave & Attendance Management Integration',
      'Full & Final Settlement Processing'
    ]
  }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  { 
    name: 'Residential Communities', 
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    description: 'Reliable 24/7 support for apartments and residential societies, ensuring families stay safe and powered.'
  },
  { 
    name: 'Offices & Commercial', 
    icon: 'Building2',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    description: 'Maximizing uptime for businesses with expert preventive maintenance for high-rise offices and corporate hubs.'
  },
  { 
    name: 'Retail & Malls', 
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800',
    description: 'Specialized lighting and power management for retail spaces, ensuring a vibrant and safe customer experience.'
  },
  { 
    name: 'Restaurants & Hotels', 
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    description: 'Maintaining critical kitchen and guest systems in high-traffic hospitality environments where downtime isn’t an option.'
  },
  { 
    name: 'Industrial & Warehouses', 
    icon: 'Warehouse',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy-duty electrical support for factories and logistics centers, focusing on machinery setup and safety compliance.'
  },
  { 
    name: 'Hospitals & Education', 
    icon: 'Hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description: 'Ensuring uninterrupted power and technical infrastructure for critical healthcare and educational facilities.'
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'lapp',
    name: 'LAPP India',
    image: 'https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=1200',
    description: 'LAPP is a leading supplier of integrated solutions and branded products in the field of cable and connection technology. From multi-core cables to branded products like ÖLFLEX, UNITRONIC, and ETHERLINE, we provide the best in connection solutions.'
  },
  {
    id: 'accuride',
    name: 'Accuride International',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    description: 'Accuride is a world leader in the design and manufacture of ball bearing slides and movement solutions. Their precision-engineered slides are the global standard for smooth movement in industrial and commercial applications.'
  }
];

export const RESOURCES_DATA: ResourceItem[] = [
  { id: 'video', name: 'Corporate Video', description: 'Watch our operations in action and learn more about our commitment to quality.' },
  { id: 'brochures', name: 'E-Brochures', description: 'Download our technical specifications, service catalogs, and corporate profiles.' },
  { id: 'gallery', name: 'Gallery', description: 'Visual documentation of our landmark projects and dedicated technical teams.' }
];

export const CORE_VALUES = [
  { title: 'Safety & Compliance', icon: <ShieldCheck className="w-6 h-6 text-blue-600" /> },
  { title: 'Integrity & Transparency', icon: <Globe className="w-6 h-6 text-blue-600" /> },
  { title: 'Reliability & 24/7 Service', icon: <Clock className="w-6 h-6 text-blue-600" /> },
  { title: 'Quality Workmanship', icon: <HardHat className="w-6 h-6 text-blue-600" /> },
  { title: 'Customer-Centric Service', icon: <Activity className="w-6 h-6 text-blue-600" /> }
];
