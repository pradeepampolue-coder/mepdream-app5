
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  image: string;
}

export interface IndustryItem {
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  description: string;
}

export enum Section {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  INDUSTRIES = 'industries',
  PRODUCTS = 'products',
  RESOURCES = 'resources',
  AI_ADVISOR = 'advisor',
  CONTACT = 'contact'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
