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
        subtitle: 'Soluciones gráficas para tu negocio. Desde tarjetas de presentación hasta gigantografías, ofrecemos productos de alta calidad con entrega rápida.',
        ctaText: 'Ver servicios',
        ctaLink: '/servicios',
        backgroundImage: 'assets/images/imagen2.jpg',
        enabled: true
      },
      services: [
        {
          id: '1',
          name: 'Tarjetas de presentación',
          description: 'Tarjetas profesionales en diversos acabados y tamaños. Papel de alta gramatura con acabados mate, brillante o uv que destacan tu imagen profesional.',
          icon: 'business',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 50,
          features: ['Alta calidad', 'Varios acabados', 'Entrega rápida', 'Diseño incluido'],
          variants: [
            { name: 'Mate', description: 'Acabado mate elegante', price: 50 },
            { name: 'Brillante', description: 'Acabado brillante', price: 55 },
            { name: 'UV Selectivo', description: 'Acabado con acabado uv selectivo', price: 70 }
          ],
          enabled: true
        },
        {
          id: '2',
          name: 'Flyers y volantes',
          description: 'Impresión de flyers y volantes publicitarios en diversos tamaños y papeles. Ideal para campañas de marketing y promociones de negocios.',
          icon: 'campaign',
          image: 'assets/images/services/logo1.jpg',
          priceFrom: 30,
          features: ['Papel couché', 'Doble cara', 'Formato personalizado', 'Colores vibrantes'],
          variants: [
            { name: 'A6', description: '105 x 148 mm', price: 30 },
            { name: 'A5', description: '148 x 210 mm', price: 45 },
            { name: 'Oficio', description: '216 x 279 mm', price: 65 }
          ],
          enabled: true
        },
        {
          id: '3',
          name: 'Lonas y pendones',
          description: 'Lonas publicitarias de gran formato para exteriores e interiores. Material resistente a la intemperie con impresión de alta definición.',
          icon: 'wallpaper',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 120,
          features: ['Resistente a la intemperie', 'Alta definición', 'Ojillos incluidos', 'Variedad de tamaños'],
          variants: [
            { name: '2x1 m', description: 'Lona estándar', price: 120 },
            { name: '3x2 m', description: 'Lona grande', price: 200 },
            { name: '4x3 m', description: 'Lona gigante', price: 350 }
          ],
          enabled: true
        },
        {
          id: '4',
          name: 'Vinilos y adhesivos',
          description: 'Viniles autoadhesivos para vehículos, vidrieras y señalización. Cortes personalizados y acabados mate o brillante.',
          icon: 'color_lens',
          image: 'assets/images/services/logo1.jpg',
          priceFrom: 80,
          features: ['Corte personalizado', 'Resistente al sol', 'Fácil instalación', 'Durable'],
          variants: [
            { name: 'Vinil cristal', description: 'Transparente', price: 80 },
            { name: 'Vinil blanco', description: 'Opaco blanco', price: 70 },
            { name: 'Vinil microperforado', description: 'Para vidrieras', price: 120 }
          ],
          enabled: true
        },
        {
          id: '5',
          name: 'Catálogos y revistas',
          description: 'Impresión de catálogos y revistas con encuadernado profesional. Ideal para empresas que quieren mostrar sus productos o servicios.',
          icon: 'menu_book',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 200,
          features: ['Encuadernado profesional', 'Papel couché', 'Color full', 'Tirajes cortos y largos'],
          variants: [
            { name: '16 páginas', description: 'Tamaño oficio', price: 200 },
            { name: '32 páginas', description: 'Tamaño oficio', price: 380 },
            { name: '48 páginas', description: 'Tamaño oficio', price: 520 }
          ],
          enabled: true
        }
      ],
      products: [
        {
          id: '1',
          name: 'Etiquetadora manual',
          description: 'Etiquetadora manual para uso comercial, fácil de usar y precisa. Ideal para tiendas, almacenes y negocios que requieran etiquetado rápido.',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 150,
          category: 'Equipos',
          stock: 10,
          enabled: true
        },
        {
          id: '2',
          name: 'Cinta de embalaje transparente',
          description: 'Cinta de embalaje resistente para cierres de cajas y paquetes. Alta adherencia y resistencia al paso del tiempo.',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 25,
          category: 'Consumibles',
          stock: 50,
          enabled: true
        },
        {
          id: '3',
          name: 'Impresora térmica de etiquetas',
          description: 'Impresora térmica para etiquetas y recibos, ideal para comercios. Conexión USB y drivers incluidos para Windows y Mac.',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 350,
          category: 'Equipos',
          stock: 5,
          enabled: true
        },
        {
          id: '4',
          name: 'Papel bond reciclado',
          description: 'Resma de papel bond reciclado de 500 hojas. Ideal para documentos internos y copias. Gramaje de 75g/m².',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 35,
          category: 'Papel',
          stock: 100,
          enabled: true
        },
        {
          id: '5',
          name: 'Tóner compatible HP',
          description: 'Tóner compatible para impresoras HP LaserJet. Alta capacidad con rendimiento de hasta 2,500 páginas.',
          image: 'assets/images/products/etiquetadora.jpg',
          price: 85,
          category: 'Tóner e Insumos',
          stock: 25,
          enabled: true
        }
      ],
      testimonials: [
        {
          id: '1',
          clientName: 'Roberto Sánchez',
          clientCompany: 'Grupo Mercantil MX',
          clientImage: 'assets/images/hero/imagen2.jpg',
          content: 'Llevamos 5 años trabajando con esta imprenta y la calidad siempre es excepcional. Sus tarjetas de presentación y catálogos nos han ayudado a crecer como empresa. El servicio al cliente es impecable.',
          rating: 5,
          date: '2025-01-15',
          enabled: true
        },
        {
          id: '2',
          clientName: 'Laura Fernández',
          clientCompany: 'Boutique Elegance',
          clientImage: 'assets/images/hero/imagen2.jpg',
          content: 'Los vinilos para mi vitrina quedaron espectaculares. El equipo fue muy profesional y me ayudó con el diseño. Mis clientes siempre preguntan dónde los hice. ¡Totalmente recomendados!',
          rating: 5,
          date: '2025-02-20',
          enabled: true
        },
        {
          id: '3',
          clientName: 'Miguel Torres',
          clientCompany: 'Agencia Digital Creativa',
          clientImage: 'assets/images/hero/imagen2.jpg',
          content: 'Como agencia digital, necesitamos una imprenta que cumpla con plazos ajustados y calidad alta. Siempre cumplen con tiempos de entrega y la impresión de nuestros materiales promocionales es perfecta.',
          rating: 5,
          date: '2025-03-10',
          enabled: true
        }
      ],
      faqs: [
        {
          id: '1',
          question: '¿Cuánto tiempo tardan en entregar un pedido?',
          answer: 'El tiempo de entrega estándar es de 3 a 5 días hábiles dependiendo del producto y la cantidad. Para pedidos urgentes ofrecemos servicio express con entrega en 24-48 horas (sujeto a disponibilidad). Contáctanos para cotizar tu pedido urgente.',
          order: 1,
          enabled: true
        },
        {
          id: '2',
          question: '¿Hacen envíos a todo el país?',
          answer: 'Sí, realizamos envíos a nivel nacional a través de mensajería privada. El costo y tiempo de envío dependen del destino y el peso del paquete. Para pedidos mayores a $500 el envío es GRATIS dentro de la ciudad.',
          order: 2,
          enabled: true
        },
        {
          id: '3',
          question: '¿Puedo solicitar una cotización personalizada?',
          answer: '¡Por supuesto! Contáctanos a través del formulario de esta página, por WhatsApp o por teléfono y te enviaremos una cotización adaptada a tus necesidades específicas. También ofrecemos descuentos para pedidos al por mayor.',
          order: 3,
          enabled: true
        },
        {
          id: '4',
          question: '¿Ofrecen servicio de diseño gráfico?',
          answer: 'Sí, contamos con un equipo de diseñadores gráficos que pueden crear desde cero el diseño de tus materiales impresos. El costo del diseño se calcula por proyecto y se incluye en la cotización final.',
          order: 4,
          enabled: true
        },
        {
          id: '5',
          question: '¿Cuáles son las formas de pago aceptadas?',
          answer: 'Aceptamos transferencia bancaria, depósito en efectivo, tarjeta de crédito/débito y pago en efectivo en nuestro local. Para pedidos grandes ofrecemos facilidades de pago con anticipo del 50%.',
          order: 5,
          enabled: true
        }
      ],
      contactInfo: {
        address: 'Av. Revolución 1234, Col. Centro, Ciudad de México, CDMX',
        phone: '+52 55 1234 5678',
        email: 'contacto@imprentaweb.com',
        whatsapp: '+525512345678',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.7!2d-99.1332!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sCentro%20Hist%C3%B3rico%20de%20la%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1650000000000'
      },
      socialNetworks: [
        { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/imprentaweb', enabled: true },
        { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/imprentaweb', enabled: true },
        { name: 'YouTube', icon: 'youtube', url: 'https://youtube.com/imprentaweb', enabled: true },
        { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/imprentaweb', enabled: true }
      ],
      generalSettings: {
        siteName: 'EstudioCreativo',
        siteDescription: 'Soluciones gráficas profesionales para tu negocio',
        logo: 'assets/images/services/logo1.jpg',
        favicon: 'favicon.ico',
        footerText: 'Todos los derechos reservados',
        primaryColor: '#0a0a0f',
        secondaryColor: '#6366f1'
      },
      about: {
        title: 'Sobre Nosotros',
        subtitle: 'Conoce nuestra historia y compromiso con la calidad desde 2008',
        description: 'Somos una imprenta con más de 15 años de experiencia en el mercado, especializada en soluciones gráficas de alta calidad. Nuestro equipo está conformado por profesionales apasionados por la impresión y el diseño, comprometidos con ofrecer productos que superen las expectativas de nuestros clientes. Utilizamos tecnología de punta y materiales de primera calidad para garantizar resultados excepcionales en cada proyecto. Contamos con más de 2,000 clientes satisfechos y hemos impreso más de 5 millones de piezas.',
        mission: 'Proveer soluciones gráficas innovadoras y de alta calidad que impulsen el éxito de nuestros clientes, superando sus expectativas con servicio personalizado, entrega puntual y precios competitivos.',
        vision: 'Ser la imprenta líder en la región, reconocida por nuestra excelencia, innovación y compromiso con la sostenibilidad, transformando ideas en realidades impresas que dejen huella.',
        values: ['Calidad', 'Innovación', 'Compromiso', 'Sostenibilidad', 'Excelencia', 'Puntualidad'],
        image: 'assets/images/services/imagen1.jpg',
        enabled: true
      },
      clients: [
        { id: '1', name: 'Corporación Alpha', logo: 'assets/images/services/logo1.jpg', url: 'https://alpha.com', enabled: true },
        { id: '2', name: 'Empresas Beta', logo: 'assets/images/services/logo1.jpg', url: 'https://beta.com', enabled: true },
        { id: '3', name: 'Grupo Gamma', logo: 'assets/images/services/logo1.jpg', url: 'https://gamma.com', enabled: true },
        { id: '4', name: 'Soluciones Delta', logo: 'assets/images/services/logo1.jpg', url: 'https://delta.com', enabled: true },
        { id: '5', name: 'Consultoría Epsilon', logo: 'assets/images/services/logo1.jpg', url: 'https://epsilon.com', enabled: true },
        { id: '6', name: 'Tecnología Zeta', logo: 'assets/images/services/logo1.jpg', url: 'https://zeta.com', enabled: true }
      ],
      webDevelopment: {
        title: 'Desarrollo Web',
        subtitle: 'Soluciones digitales para potenciar tu negocio en el mundo online',
        services: [
          {
            id: '1',
            name: 'Landing Pages',
            description: 'Páginas de aterrizaje diseñadas para convertir visitantes en clientes. Diseño moderno, carga rápida y optimizada para conversiones.',
            icon: 'web',
            image: 'assets/images/services/imagen1.jpg',
            features: ['Diseño responsive', 'Optimización SEO', 'Alta velocidad', 'Formulario de contacto'],
            priceFrom: 300,
            enabled: true
          },
          {
            id: '2',
            name: 'Sitios Web Corporativos',
            description: 'Sitios web profesionales que reflejan la identidad de tu empresa. Incluyen panel de administración para que actualices tu contenido.',
            icon: 'business_center',
            image: 'assets/images/services/imagen1.jpg',
            features: ['Diseño a medida', 'Panel de administración', 'Seguridad avanzada', 'Certificado SSL'],
            priceFrom: 800,
            enabled: true
          },
          {
            id: '3',
            name: 'Tiendas Online',
            description: 'E-commerce completo con pasarela de pago, carrito de compras y gestión de productos. Vende tus productos 24/7.',
            icon: 'shopping_cart',
            image: 'assets/images/services/imagen1.jpg',
            features: ['Catálogo de productos', 'Carrito de compras', 'Pasarela de pago', 'Gestión de inventario'],
            priceFrom: 1500,
            enabled: true
          },
          {
            id: '4',
            name: 'Aplicaciones Móviles',
            description: 'Aplicaciones móviles nativas e híbridas para iOS y Android. Desde apps de servicios hasta tiendas móviles.',
            icon: 'phone_android',
            image: 'assets/images/services/imagen1.jpg',
            features: ['iOS y Android', 'Diseño intuitivo', 'Notificaciones push', 'Integración con redes'],
            priceFrom: 2500,
            enabled: true
          }
        ],
        ctaText: 'Solicitar cotización',
        ctaLink: '/contacto',
        enabled: true
      }
    };

    this.firebaseService.setData(FIREBASE_PATHS.SITE_DATA, defaultData)
      .then(() => {
        console.log('Datos por defecto inicializados en Firebase');
        this.siteDataSubject.next(defaultData);
      })
      .catch(error => console.error('Error inicializando datos por defecto:', error));
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