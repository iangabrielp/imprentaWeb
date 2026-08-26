import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { FirebaseService } from './firebase.service';
import {
  SiteData,
  HeroSection,
  ServiceItem,
  ProductItem,
  TestimonialItem,
  FaqItem,
  ContactInfo,
  SocialNetwork,
  GeneralSettings,
  AboutSection,
  ClientLogo,
  WebDevelopmentSection
} from '../models/site-data.model';
import { FIREBASE_PATHS } from '../constants/firebase-paths.constant';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Estado interno
  private siteDataSubject = new BehaviorSubject<SiteData | null>(null);
  public siteData$ = this.siteDataSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Cache compartido para evitar múltiples suscripciones
  private heroCache$: Observable<HeroSection> | null = null;
  private servicesCache$: Observable<ServiceItem[]> | null = null;
  private productsCache$: Observable<ProductItem[]> | null = null;
  private testimonialsCache$: Observable<TestimonialItem[]> | null = null;
  private faqsCache$: Observable<FaqItem[]> | null = null;
  private contactCache$: Observable<ContactInfo> | null = null;
  private socialCache$: Observable<SocialNetwork[]> | null = null;
  private settingsCache$: Observable<GeneralSettings> | null = null;
  private aboutCache$: Observable<AboutSection> | null = null;
  private clientsCache$: Observable<ClientLogo[]> | null = null;
  private webDevCache$: Observable<WebDevelopmentSection> | null = null;

  constructor(private firebaseService: FirebaseService) {
    this.loadSiteData();
  }

  /**
   * Carga los datos completos del sitio desde Firebase
   */
  private loadSiteData(): void {
    this.loadingSubject.next(true);
    this.firebaseService.getData<SiteData>(FIREBASE_PATHS.SITE_DATA)
      .pipe(
        tap(data => {
          if (data) {
            this.siteDataSubject.next(data);
          } else {
            this.initializeDefaultData();
          }
          this.loadingSubject.next(false);
        }),
        catchError(error => {
          console.error('Error cargando datos del sitio:', error);
          this.loadingSubject.next(false);
          this.initializeDefaultData();
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Inicializa datos por defecto en Firebase (solo si la ruta está vacía)
   */
  private initializeDefaultData(): void {
    const defaultData: SiteData = {
      hero: {
        title: 'Impresión de calidad profesional',
        subtitle: 'Soluciones gráficas para tu negocio. Desde tarjetas hasta gigantografías.',
        ctaText: 'Ver servicios',
        ctaLink: '/servicios',
        backgroundImage: 'assets/images/imagen2.jpg',
        enabled: true
      },
      services: [
        {
          id: '1',
          name: 'Tarjetas de presentación',
          description: 'Tarjetas profesionales en diversos acabados.',
          icon: 'business',
          image: 'assets/images/services/tarjetas.jpg',
          priceFrom: 50,
          features: ['Alta calidad', 'Varios acabados', 'Entrega rápida'],
          variants: [
            { name: 'Mate', description: 'Acabado mate elegante', price: 50 },
            { name: 'Brillante', description: 'Acabado brillante', price: 55 }
          ],
          enabled: true
        },
        {
          id: '2',
          name: 'Flyers y volantes',
          description: 'Impresión de flyers y volantes publicitarios en diversos tamaños y papeles.',
          icon: 'campaign',
          image: 'assets/images/services/flyers.jpg',
          priceFrom: 30,
          features: ['Papel couché', 'Doble cara', 'Formato personalizado'],
          variants: [
            { name: 'A6', description: '105 x 148 mm', price: 30 },
            { name: 'A5', description: '148 x 210 mm', price: 45 }
          ],
          enabled: true
        },
        {
          id: '3',
          name: 'Lonas y pendones',
          description: 'Lonas publicitarias de gran formato para exteriores e interiores.',
          icon: 'wallpaper',
          image: 'assets/images/services/lonas.jpg',
          priceFrom: 120,
          features: ['Resistente a la intemperie', 'Alta definición', 'Ojillos incluidos'],
          variants: [
            { name: '2x1 m', description: 'Lona estándar', price: 120 },
            { name: '3x2 m', description: 'Lona grande', price: 200 }
          ],
          enabled: true
        }
      ],
      products: [
        {
          id: '1',
          name: 'Etiquetadora manual',
          description: 'Etiquetadora manual para uso comercial, fácil de usar y precisa.',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 150,
          category: 'Equipos',
          stock: 10,
          enabled: true
        },
        {
          id: '2',
          name: 'Cinta de embalaje',
          description: 'Cinta de embalaje resistente para cierres de cajas y paquetes.',
          image: 'assets/images/products/cinta-embalaje.jpg',
          price: 25,
          category: 'Consumibles',
          stock: 50,
          enabled: true
        },
        {
          id: '3',
          name: 'Impresora térmica',
          description: 'Impresora térmica para etiquetas y recibos, ideal para comercios.',
          image: 'assets/images/products/impresora-termica.jpg',
          price: 350,
          category: 'Equipos',
          stock: 5,
          enabled: true
        }
      ],
      testimonials: [
        {
          id: '1',
          clientName: 'Juan Pérez',
          clientCompany: 'Empresa XYZ',
          clientImage: 'assets/images/testimonials/juan.jpg',
          content: 'Excelente servicio y calidad. Recomiendo totalmente sus servicios.',
          rating: 5,
          date: '2025-01-15',
          enabled: true
        },
        {
          id: '2',
          clientName: 'María Gómez',
          clientCompany: 'Estudio Creativo',
          clientImage: 'assets/images/testimonials/maria.jpg',
          content: 'Rápidos, eficientes y con una atención al cliente excepcional.',
          rating: 5,
          date: '2025-02-20',
          enabled: true
        },
        {
          id: '3',
          clientName: 'Carlos Ruiz',
          clientCompany: 'Agencia Digital',
          clientImage: 'assets/images/testimonials/carlos.jpg',
          content: 'La mejor imprenta con la que he trabajado. Calidad insuperable.',
          rating: 4,
          date: '2025-03-10',
          enabled: true
        }
      ],
      faqs: [
        {
          id: '1',
          question: '¿Cuánto tiempo tardan en entregar?',
          answer: 'El tiempo de entrega es de 3 a 5 días hábiles para la mayoría de los productos. Para pedidos urgentes, consulta disponibilidad.',
          order: 1,
          enabled: true
        },
        {
          id: '2',
          question: '¿Hacen envíos a todo el país?',
          answer: 'Sí, realizamos envíos a nivel nacional a través de mensajería privada. El costo depende del destino y el peso del paquete.',
          order: 2,
          enabled: true
        },
        {
          id: '3',
          question: '¿Puedo solicitar una cotización personalizada?',
          answer: 'Claro, contáctanos a través del formulario o WhatsApp y te enviaremos una cotización adaptada a tus necesidades específicas.',
          order: 3,
          enabled: true
        }
      ],
      contactInfo: {
        address: 'Av. Principal 123, Ciudad, País',
        phone: '+123 456 7890',
        email: 'info@imprentaweb.com',
        whatsapp: '+1234567890',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094107!2d-122.41941548468122!3d37.77492977975994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7c3b8f5d%3A0x3d9f64b1e0e1a5c9!2sSan%20Francisco%2C%20CA!5e0!3m2!1ses!2sus!4v1650000000000'
      },
      socialNetworks: [
        { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/imprentaweb', enabled: true },
        { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/imprentaweb', enabled: true },
        { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/imprentaweb', enabled: true },
        { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/imprentaweb', enabled: true }
      ],
      generalSettings: {
        siteName: 'ImprentaWeb',
        siteDescription: 'Soluciones gráficas profesionales para tu negocio',
        logo: 'assets/images/logo.png',
        favicon: 'favicon.ico',
        footerText: 'Todos los derechos reservados',
        primaryColor: '#1a1a2e',
        secondaryColor: '#ff6b6b'
      },
      about: {
        title: 'Sobre Nosotros',
        subtitle: 'Conoce nuestra historia y compromiso con la calidad',
        description: 'Somos una imprenta con más de 15 años de experiencia en el mercado, especializada en soluciones gráficas de alta calidad. Nuestro equipo está conformado por profesionales apasionados por la impresión y el diseño, comprometidos con ofrecer productos que superen las expectativas de nuestros clientes. Utilizamos tecnología de punta y materiales de primera calidad para garantizar resultados excepcionales en cada proyecto.',
        mission: 'Proveer soluciones gráficas innovadoras y de alta calidad que impulsen el éxito de nuestros clientes, superando sus expectativas con servicio personalizado y entrega puntual.',
        vision: 'Ser la imprenta líder en la región, reconocida por nuestra excelencia, innovación y compromiso con la sostenibilidad, transformando ideas en realidades impresas.',
        values: ['Calidad', 'Innovación', 'Compromiso', 'Sostenibilidad', 'Excelencia'],
        image: 'assets/images/about-us.jpg',
        enabled: true
      },
      clients: [
        { id: '1', name: 'Corporación Alpha', logo: 'assets/images/clients/alpha.png', url: 'https://alpha.com', enabled: true },
        { id: '2', name: 'Empresas Beta', logo: 'assets/images/clients/beta.png', url: 'https://beta.com', enabled: true },
        { id: '3', name: 'Grupo Gamma', logo: 'assets/images/clients/gamma.png', url: 'https://gamma.com', enabled: true },
        { id: '4', name: 'Soluciones Delta', logo: 'assets/images/clients/delta.png', url: 'https://delta.com', enabled: true },
        { id: '5', name: 'Consultoría Epsilon', logo: 'assets/images/clients/epsilon.png', url: 'https://epsilon.com', enabled: true },
        { id: '6', name: 'Tecnología Zeta', logo: 'assets/images/clients/zeta.png', url: 'https://zeta.com', enabled: true }
      ],
      webDevelopment: {
        title: 'Desarrollo Web',
        subtitle: 'Soluciones digitales para potenciar tu negocio en el mundo online',
        services: [
          {
            id: '1',
            name: 'Landing Pages',
            description: 'Páginas de aterrizaje diseñadas para convertir visitantes en clientes.',
            icon: 'web',
            image: 'assets/images/web/landing.jpg',
            features: ['Diseño responsive', 'Optimización SEO', 'Alta velocidad'],
            priceFrom: 300,
            enabled: true
          },
          {
            id: '2',
            name: 'Sitios Web Corporativos',
            description: 'Sitios web profesionales que reflejan la identidad de tu empresa.',
            icon: 'business_center',
            image: 'assets/images/web/corporativo.jpg',
            features: ['Diseño a medida', 'Panel de administración', 'Seguridad avanzada'],
            priceFrom: 800,
            enabled: true
          },
          {
            id: '3',
            name: 'Tiendas Online',
            description: 'E-commerce con pasarela de pago, carrito de compras y gestión de productos.',
            icon: 'shopping_cart',
            image: 'assets/images/web/tienda.jpg',
            features: ['Catálogo de productos', 'Carrito de compras', 'Integración con redes'],
            priceFrom: 1500,
            enabled: true
          }
        ],
        ctaText: 'Ver más servicios',
        ctaLink: '/desarrollo-web',
        enabled: true
      }
    };

    this.firebaseService.setData(FIREBASE_PATHS.SITE_DATA, defaultData)
      .then(() => {
        console.log('✅ Datos por defecto inicializados en Firebase');
        this.siteDataSubject.next(defaultData);
      })
      .catch(error => console.error('❌ Error inicializando datos por defecto:', error));
  }

  /**
   * Obtiene una sección específica del sitio.
   */
  private getSection<T>(path: string): Observable<T | null> {
    return this.siteData$.pipe(
      map(data => {
        if (!data) return null;
        const keys = path.split('/');
        let result: any = data;
        for (const key of keys) {
          if (result && result[key] !== undefined) {
            result = result[key];
          } else {
            return null;
          }
        }
        return result as T;
      })
    );
  }

  // Métodos públicos para obtener cada sección

  getHero(): Observable<HeroSection> {
    if (!this.heroCache$) {
      this.heroCache$ = this.getSection<HeroSection>('hero').pipe(
        map(hero => hero || this.getDefaultHero()),
        shareReplay(1)
      );
    }
    return this.heroCache$;
  }

  getServices(): Observable<ServiceItem[]> {
    if (!this.servicesCache$) {
      this.servicesCache$ = this.getSection<ServiceItem[]>('services').pipe(
        map(services => services || []),
        shareReplay(1)
      );
    }
    return this.servicesCache$;
  }

  getProducts(): Observable<ProductItem[]> {
    if (!this.productsCache$) {
      this.productsCache$ = this.getSection<ProductItem[]>('products').pipe(
        map(products => products || []),
        shareReplay(1)
      );
    }
    return this.productsCache$;
  }

  getTestimonials(): Observable<TestimonialItem[]> {
    if (!this.testimonialsCache$) {
      this.testimonialsCache$ = this.getSection<TestimonialItem[]>('testimonials').pipe(
        map(testimonials => testimonials || []),
        shareReplay(1)
      );
    }
    return this.testimonialsCache$;
  }

  getFaqs(): Observable<FaqItem[]> {
    if (!this.faqsCache$) {
      this.faqsCache$ = this.getSection<FaqItem[]>('faqs').pipe(
        map(faqs => faqs || []),
        shareReplay(1)
      );
    }
    return this.faqsCache$;
  }

  getContactInfo(): Observable<ContactInfo> {
    if (!this.contactCache$) {
      this.contactCache$ = this.getSection<ContactInfo>('contactInfo').pipe(
        map(contact => contact || this.getDefaultContactInfo()),
        shareReplay(1)
      );
    }
    return this.contactCache$;
  }

  getSocialNetworks(): Observable<SocialNetwork[]> {
    if (!this.socialCache$) {
      this.socialCache$ = this.getSection<SocialNetwork[]>('socialNetworks').pipe(
        map(social => social || []),
        shareReplay(1)
      );
    }
    return this.socialCache$;
  }

  getGeneralSettings(): Observable<GeneralSettings> {
    if (!this.settingsCache$) {
      this.settingsCache$ = this.getSection<GeneralSettings>('generalSettings').pipe(
        map(settings => settings || this.getDefaultSettings()),
        shareReplay(1)
      );
    }
    return this.settingsCache$;
  }

  getAbout(): Observable<AboutSection> {
    if (!this.aboutCache$) {
      this.aboutCache$ = this.getSection<AboutSection>('about').pipe(
        map(about => about || this.getDefaultAbout()),
        shareReplay(1)
      );
    }
    return this.aboutCache$;
  }

  getClients(): Observable<ClientLogo[]> {
    if (!this.clientsCache$) {
      this.clientsCache$ = this.getSection<ClientLogo[]>('clients').pipe(
        map(clients => clients || []),
        shareReplay(1)
      );
    }
    return this.clientsCache$;
  }

  getWebDevelopment(): Observable<WebDevelopmentSection> {
    if (!this.webDevCache$) {
      this.webDevCache$ = this.getSection<WebDevelopmentSection>('webDevelopment').pipe(
        map(webDev => webDev || this.getDefaultWebDev()),
        shareReplay(1)
      );
    }
    return this.webDevCache$;
  }

  /**
   * Actualiza una sección completa (para el panel admin)
   */
  updateSection(path: string, data: any): Promise<void> {
    const fullPath = `${FIREBASE_PATHS.SITE_DATA}/${path}`;
    return this.firebaseService.updateData(fullPath, data)
      .then(() => {
        const current = this.siteDataSubject.value;
        if (current) {
          const keys = path.split('/');
          let target: any = current;
          for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]];
          }
          const lastKey = keys[keys.length - 1];
          target[lastKey] = data;
          this.siteDataSubject.next(current);
        }
      });
  }

  refreshData(): void {
    this.loadSiteData();
  }

  // -------- Métodos auxiliares para valores por defecto --------
  private getDefaultHero(): HeroSection {
    return {
      title: 'Impresión de calidad profesional',
      subtitle: 'Soluciones gráficas para tu negocio.',
      ctaText: 'Ver servicios',
      ctaLink: '/servicios',
      backgroundImage: 'assets/images/hero-bg.jpg',
      enabled: true
    };
  }

  private getDefaultContactInfo(): ContactInfo {
    return {
      address: 'Av. Principal 123, Ciudad, País',
      phone: '+123 456 7890',
      email: 'info@imprentaweb.com',
      whatsapp: '+1234567890',
      mapUrl: 'https://maps.google.com/...'
    };
  }

  private getDefaultAbout(): AboutSection {
    return {
      title: 'Sobre Nosotros',
      subtitle: 'Conoce nuestra historia y compromiso con la calidad',
      description: 'Somos una imprenta con más de 15 años de experiencia en el mercado, especializada en soluciones gráficas de alta calidad.',
      mission: 'Proveer soluciones gráficas innovadoras y de alta calidad.',
      vision: 'Ser la imprenta líder en la región.',
      values: ['Calidad', 'Innovación', 'Compromiso', 'Sostenibilidad', 'Excelencia'],
      image: 'assets/images/about-us.jpg',
      enabled: true
    };
  }

  private getDefaultWebDev(): WebDevelopmentSection {
    return {
      title: 'Desarrollo Web',
      subtitle: 'Soluciones digitales para potenciar tu negocio en el mundo online',
      services: [
        {
          id: '1',
          name: 'Landing Pages',
          description: 'Páginas de aterrizaje diseñadas para convertir visitantes en clientes.',
          icon: 'web',
          image: 'assets/images/web/landing.jpg',
          features: ['Diseño responsive', 'Optimización SEO', 'Alta velocidad'],
          priceFrom: 300,
          enabled: true
        }
      ],
      ctaText: 'Ver más servicios',
      ctaLink: '/desarrollo-web',
      enabled: true
    };
  }

  private getDefaultSettings(): GeneralSettings {
    return {
      siteName: 'ImprentaWeb',
      siteDescription: 'Soluciones gráficas profesionales',
      logo: 'assets/images/logo.png',
      favicon: 'favicon.ico',
      footerText: 'Todos los derechos reservados',
      primaryColor: '#1a1a2e',
      secondaryColor: '#ff6b6b'
    };
  }
}