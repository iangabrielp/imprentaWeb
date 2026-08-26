export interface SiteData {
  hero: HeroSection;
  about: AboutSection;
  services: ServiceItem[];
  products: ProductItem[];
  clients: ClientLogo[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  webDevelopment: WebDevelopmentSection;
  contactInfo: ContactInfo;
  socialNetworks: SocialNetwork[];
  generalSettings: GeneralSettings;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  enabled?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image: string;
  priceFrom?: number;
  features: string[];
  variants?: ServiceVariant[];
  enabled?: boolean;
}

export interface ServiceVariant {
  name: string;
  description: string;
  price: number;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  stock: number;
  enabled?: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientImage: string;
  content: string;
  rating: number;
  date: string;
  enabled?: boolean; // <-- AÑADIDO
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  enabled?: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapUrl: string;
}

export interface SocialNetwork {
  name: string;
  icon: string;
  url: string;
  enabled: boolean;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  footerText: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface AboutSection {
  title: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  image: string;
  enabled?: boolean;
}

export interface ClientLogo {
  id: string;
  name: string;
  logo: string;
  url?: string;
  enabled?: boolean;
}

export interface WebDevelopmentSection {
  title: string;
  subtitle: string;
  services: WebDevServiceItem[];
  ctaText: string;
  ctaLink: string;
  enabled?: boolean;
}

export interface WebDevServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  priceFrom?: number;
  enabled?: boolean;
}