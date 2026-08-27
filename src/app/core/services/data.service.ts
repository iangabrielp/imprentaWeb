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
          description: 'Tarjetas de presentación profesionales con acabados premium. Papel de alta gramatura con opciones mate, UV y traslúcidas para destacar tu imagen.',
          icon: 'business',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 15,
          features: ['Alta gramatura', 'Acabados premium', 'Impresión full color', 'Corte personalizado'],
          slug: 'tarjetas-de-presentacion',
          featured: true,
          shortDescription: 'Tarjetas de presentación con acabados profesionales y entrega rápida.',
          fullDescription: 'Nuestras tarjetas de presentación se imprimen en papel de alta gramatura con acabados premium que incluyen UV brillante, mate y selectivo. Ideal para profesionales que buscan causar una primera impresión memorable.',
          variants: [
            {
              name: 'UV',
              description: 'Acabado UV brillante que resalta los colores',
              price: 15,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Brillo uniforme', 'Colores vibrantes', 'Resistente al desgaste'],
              details: 'Acabado UV que cubre toda la superficie de la tarjeta, dándole un brillo elegante y protección extra.',
              material: 'Papel couché 300g con acabado UV',
              size: '9 x 5 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Mate',
              description: 'Acabado mate sofisticado y elegante',
              price: 30,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Textura suave', 'Sin reflejos', 'Tacto premium', 'Acabado elegante'],
              details: 'Acabado mate que ofrece una apariencia sofisticada y libre de reflejos, ideal para profesionales de diseño y arquitectura.',
              material: 'Papel couché 350g con acabado mate',
              size: '9 x 5 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'UV Selectivo',
              description: 'UV estratégico en áreas específicas del diseño',
              price: 35,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Efecto 3D', 'Diseño diferenciado', 'Toque premium', 'Alta percepción de valor'],
              details: 'El UV selectivo se aplica solo en áreas clave del diseño, creando un efecto de profundidad y contraste que fascina.',
              material: 'Papel couché 350g con UV selectivo',
              size: '9 x 5 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Traslúcidas',
              description: 'Tarjetas en papel translúcido con efecto moderno',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Efecto translúcido', 'Diseño moderno', 'Alta exclusividad', 'Material premium'],
              details: 'Tarjetas fabricadas en papel translúcido que permiten ver a través de ellas, creando un efecto visual único y moderno.',
              material: 'Papel translúcido 250g',
              size: '9 x 5 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '2',
          name: 'Flyers',
          description: 'Impresión de flyers publicitarios en diversos tamaños y papeles couché. Ideales para campañas de marketing y promociones de negocios.',
          icon: 'campaign',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 25,
          features: ['Papel couché', 'Impresión full color', 'Colores vibrantes', 'Tirajes flexibles'],
          slug: 'flyers',
          featured: true,
          shortDescription: 'Flyers publicitarios con impresión de alta calidad y colores vibrantes.',
          fullDescription: 'Nuestros flyers se imprimen en papel couché de alta calidad con tinta de colores vibrantes. Disponibles en varios tamaños estándar, son la herramienta perfecta para promociones y eventos.',
          variants: [
            {
              name: 'A6',
              description: 'Flyer tamaño A6 (105 x 148 mm)',
              price: 25,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño compacto', 'Fácil distribución', 'Costo accesible'],
              details: 'Tamaño ideal para repartir en puntos de venta, eventos y zonas comerciales.',
              material: 'Papel couché 150g',
              size: '105 x 148 mm (A6)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'A5',
              description: 'Flyer tamaño A5 (148 x 210 mm)',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño estándar', 'Mayor espacio para información', 'Diseño amplio'],
              details: 'El tamaño más popular para campañas publicitarias con suficiente espacio para texto e imágenes.',
              material: 'Papel couché 170g',
              size: '148 x 210 mm (A5)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Oficio',
              description: 'Flyer tamaño oficio (216 x 279 mm)',
              price: 60,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño grande', 'Máximo espacio creativo', 'Impacto visual'],
              details: 'Tamaño oficio que ofrece amplio espacio para diseñar promociones detalladas con múltiples imágenes.',
              material: 'Papel couché 170g',
              size: '216 x 279 mm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Doble cara',
              description: 'Flyer impreso por ambos lados',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Doble espacio', 'Información completa', 'Diseño integral', 'Mayor impacto'],
              details: 'Impresión en las dos caras del flyer, permitiendo aprovechar al máximo el espacio para tu mensaje.',
              material: 'Papel couché 170g',
              size: 'A5 doble cara',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '3',
          name: 'Afiches',
          description: 'Impresión de afiches y pósteres de gran formato con colores vibrantes. Ideales para publicidad interior y exterior.',
          icon: 'image',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 50,
          features: ['Alta definición', 'Colores vivos', 'Varios tamaños', 'Resistente al sol'],
          slug: 'afiches',
          shortDescription: 'Afiches de gran formato con impresión de alta definición y colores vibrantes.',
          fullDescription: 'Nuestros afiches se imprimen con tecnología de alta definición en papeles de diversas gramaturas. Ideales para decoración, publicidad y eventos con un acabado profesional.',
          variants: [
            {
              name: 'Oficio',
              description: 'Afiche tamaño oficio (216 x 279 mm)',
              price: 50,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño compacto', 'Ideal para interiores', 'Fácil de colocar'],
              details: 'Afiche tamaño oficio perfecto para menus, promociones y publicidad en espacios reducidos.',
              material: 'Papel couché 200g',
              size: '216 x 279 mm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Medio pliego',
              description: 'Afiche de medio pliego (380 x 530 mm)',
              price: 90,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño intermedio', 'Gran impacto visual', 'Versátil'],
              details: 'Tamaño medio ideal para exposiciones, eventos y publicidad en puntos estratégicos.',
              material: 'Papel couché 200g',
              size: '380 x 530 mm (Medio pliego)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Pliego',
              description: 'Afiche tamaño pliego (700 x 1000 mm)',
              price: 150,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño grande', 'Alto impacto', 'Ideal para eventos'],
              details: 'Afiche de gran formato perfecto para eventos, conferencias y publicidad en espacios amplios.',
              material: 'Papel couché 200g',
              size: '700 x 1000 mm (Pliego)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Gigante',
              description: 'Afiche gigante (1000 x 1500 mm)',
              price: 280,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Máximo tamaño', 'Publicidad exterior', 'Alta resistencia'],
              details: 'El tamaño más grande disponible, ideal para gigantografías y publicidad exterior de alto impacto.',
              material: 'Papel couché 200g o lona',
              size: '1000 x 1500 mm (Gigante)',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '4',
          name: 'Lonas',
          description: 'Lonas publicitarias de gran formato para exteriores e interiores. Material resistente a la intemperie con impresión de alta definición y ojillos.',
          icon: 'wallpaper',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 120,
          features: ['Resistente a la intemperie', 'Alta definición', 'Ojillos incluidos', 'Impresión UV'],
          slug: 'lonas',
          shortDescription: 'Lonas publicitarias resistentes con impresión de alta calidad.',
          fullDescription: 'Nuestras lonas se imprimen con tinta UV resistente a la intemperie, garantizando colores vivos que no se decoloran. Incluyen ojillos metálicos para una fácil instalación en cualquier ubicación.',
          variants: [
            {
              name: '1x1 m',
              description: 'Lona pequeña ideal para espacios reducidos',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño compacto', 'Fácil instalación', 'Resistente al agua'],
              details: 'Lona de un metro cuadrado perfecta para interiores y espacios de tamaño reducido.',
              material: 'Lona vinílica frontlit 440g',
              size: '1 x 1 m',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '2x1 m',
              description: 'Lona estándar para publicidad exterior',
              price: 200,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño estándar', 'Alta visibilidad', 'Resistente a UV'],
              details: 'El tamaño más solicitado para publicidad exterior en locales comerciales y eventos.',
              material: 'Lona vinílica frontlit 440g',
              size: '2 x 1 m',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '3x2 m',
              description: 'Lona grande para eventos y establecimientos',
              price: 350,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gran formato', 'Impacto visual', 'Alta durabilidad'],
              details: 'Lona de gran formato ideal para eventos, ferias y publicidad en fachadas de establecimientos.',
              material: 'Lona vinílica frontlit 440g',
              size: '3 x 2 m',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '4x3 m',
              description: 'Lona gigante para publicidad de alto impacto',
              price: 500,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Máximo impacto', 'Publicidad exterior', 'Alta resistencia', 'Ojillos reforzados'],
              details: 'Lona gigante para campañas publicitarias de alto impacto en vialidades, terrazas y eventos masivos.',
              material: 'Lona vinílica frontlit 440g',
              size: '4 x 3 m',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '5',
          name: 'Stickers',
          description: 'Stickers y calcomanías adhesivas en diversos materiales. Ideales para branding, promociones y personalización de productos.',
          icon: 'label',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 20,
          features: ['Material adhesivo', 'Corte personalizado', 'Resistente al agua', 'Colores vibrantes'],
          slug: 'stickers',
          shortDescription: 'Stickers adhesivos personalizados en múltiples materiales y acabados.',
          fullDescription: 'Creamos stickers personalizados en papel adhesivo, vinilo, material transparente y acabados brillantes. Perfectos para branding, embalajes, promociones y eventos con calidad profesional.',
          variants: [
            {
              name: 'Papel adhesivo',
              description: 'Stickers en papel adhesivo de alta calidad',
              price: 20,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Costo accesible', 'Impresión full color', 'Adhesivo permanente'],
              details: 'Stickers en papel adhesivo ideal para etiquetado de productos, promociones y uso general.',
              material: 'Papel adhesivo brillante o mate',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Vinilo',
              description: 'Stickers en vinilo resistente y duradero',
              price: 35,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Resistente al agua', 'Alta durabilidad', 'Uso exterior e interior'],
              details: 'Vinilo adhesivo de alta resistencia ideal para exteriores, vehículos y señalización.',
              material: 'Vinilo adhesivo 100 micras',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Transparente',
              description: 'Stickers en material transparente con efecto cristal',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Efecto cristal', 'Diseño elegante', 'Sin fondo visible'],
              details: 'Stickers transparentes que se integran perfectamente con cualquier superficie, creando un acabado elegante.',
              material: 'Vinilo transparente 100 micras',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Brillantes',
              description: 'Stickers con acabado brillante premium',
              price: 45,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Brillo premium', 'Colores intensos', 'Alta percepción de calidad'],
              details: 'Stickers con acabado brillante que realzan los colores y dan un toque premium a tu marca.',
              material: 'Papel adhesivo con laminado brillante',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '6',
          name: 'Etiquetas',
          description: 'Etiquetas personalizadas para productos, envases y más. Diversos materiales incluyendo papel, vinilo y material térmico.',
          icon: 'sell',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 15,
          features: ['Materiales variados', 'Impresión de calidad', 'Corte a medida', 'Resistentes'],
          slug: 'etiquetas',
          shortDescription: 'Etiquetas personalizadas para toda tipo de productos y necesidades.',
          fullDescription: 'Producimos etiquetas en papel, vinilo y material térmico con impresión de alta calidad. Ideales para productos alimenticios, cosméticos, bebidas y cualquier tipo de mercancía.',
          variants: [
            {
              name: 'Papel',
              description: 'Etiquetas en papel adhesivo de alta calidad',
              price: 15,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Impresión full color', 'Adhesivo resistente', 'Corte personalizado'],
              details: 'Etiquetas en papel adhesivo ideales para productos de uso interior con acabado profesional.',
              material: 'Papel adhesivo couché 100g',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Vinilo',
              description: 'Etiquetas en vinilo resistente al agua',
              price: 25,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Resistente al agua', 'Uso exterior', 'Alta durabilidad'],
              details: 'Etiquetas en vinilo resistentes a la humedad y al sol, perfectas para productos que requieren resistencia.',
              material: 'Vinilo adhesivo 80 micras',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Térmica',
              description: 'Etiquetas térmicas para impresión de datos variables',
              price: 30,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Impresión térmica', 'Sin tinta requerida', 'Alta velocidad'],
              details: 'Etiquetas térmicas ideales para ticket, precios, códigos de barras y datos variables.',
              material: 'Papel térmico sensible al calor',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Personalizadas',
              description: 'Etiquetas totalmente personalizadas en diseño y forma',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño exclusivo', 'Forma personalizada', 'Acabado premium', 'Tiraje mínimo bajo'],
              details: 'Etiquetas con diseño único y corte a medida para marcas que buscan diferenciarse.',
              material: 'Vinilo o papel según diseño',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '7',
          name: 'Calendarios',
          description: 'Calendarios personalizados para empresas y particulares. Meses individuales, trimestrales, semestrales y anuales con diseño corporativo.',
          icon: 'calendar_month',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 80,
          features: ['Diseño corporativo', 'Alta calidad de impresión', 'Varios formatos', 'Papel premium'],
          slug: 'calendarios',
          featured: true,
          shortDescription: 'Calendarios personalizados con diseño corporativo y impresión de alta calidad.',
          fullDescription: 'Nuestros calendarios se personalizan con el diseño y contenido de tu empresa. Desde calendarios de escritorio hasta pared, con formato mensual, trimestral o anual.',
          variants: [
            {
              name: 'Mes Individual',
              description: 'Calendario de un solo mes con diseño personalizado',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño a medida', 'Papel couché', 'Ideal para escritorio'],
              details: 'Calendario de un mes con espacio para notas y diseño corporativo personalizado.',
              material: 'Papel couché 250g',
              size: '21 x 15 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Trimestral',
              description: 'Calendario de tres meses con diseño profesional',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tres meses visibles', 'Diseño profesional', 'Espacio para logos'],
              details: 'Calendario que muestra tres meses simultáneamente, ideal para oficinas y espacios de trabajo.',
              material: 'Papel couché 250g',
              size: '30 x 20 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Semestral',
              description: 'Calendario de seis meses con contenido corporativo',
              price: 180,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Seis meses de información', 'Gran espacio visual', 'Material premium'],
              details: 'Calendario semestral con amplio espacio para imágenes y contenido corporativo.',
              material: 'Papel couché 280g',
              size: '40 x 30 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Anual',
              description: 'Calendario anual completo con diseño exclusivo',
              price: 250,
              image: 'assets/images/services/imagen1.jpg',
              features: ['12 meses completos', 'Diseño exclusivo', 'Regalo corporativo ideal'],
              details: 'Calendario anual de pared con diseño exclusivo, ideal como regalo corporativo y herramienta de imagen.',
              material: 'Papel couché 300g con espiral',
              size: '50 x 35 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '8',
          name: 'Cuadernos personalizados',
          description: 'Cuadernos personalizados con logo y diseño de tu empresa. Ideal para eventos, capacitaciones y regalos corporativos.',
          icon: 'notebook',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 45,
          features: ['Personalización completa', 'Papel de calidad', 'Encuadernado profesional', 'Logo incluido'],
          slug: 'cuadernos-personalizados',
          shortDescription: 'Cuadernos personalizados con tu marca, ideales para eventos y regalos.',
          fullDescription: 'Creamos cuadernos personalizados con el diseño, logo y contenido que necesitas. Disponibles en diferentes cantidades de hojas y acabados para eventos, capacitaciones y promociones.',
          variants: [
            {
              name: '50 hojas',
              description: 'Cuaderno compacto de 50 hojas rayadas',
              price: 45,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño compacto', 'Hojas rayadas', 'Tapa personalizada'],
              details: 'Cuaderno ligero y portátil con 50 hojas rayadas y portada personalizada con tu logo.',
              material: 'Papel bond 75g, tapa couché 300g',
              size: '21 x 15 cm (CU1)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '100 hojas',
              description: 'Cuaderno estándar de 100 hojas',
              price: 75,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Capacidad media', 'Hojas rayadas', 'Portada y contraportada'],
              details: 'Cuaderno estándar con 100 hojas rayadas y personalización completa en tapa.',
              material: 'Papel bond 75g, tapa couché 300g',
              size: '21 x 15 cm (CU1)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '200 hojas',
              description: 'Cuaderno de alta capacidad con 200 hojas',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Alta capacidad', 'Hojas numeradas', 'Diseño corporativo'],
              details: 'Cuaderno de gran capacidad ideal para cursos, seminarios y registros prolongados.',
              material: 'Papel bond 75g, tapa couché 300g',
              size: '21 x 15 cm (CU1)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium',
              description: 'Cuaderno premium con acabados especiales',
              price: 180,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabado premium', 'Empapelado de lujo', 'Serigrafía en tapa', 'Tira elástica'],
              details: 'Cuaderno de lujo con tapa empapelada, serigrafía y acabados especiales para eventos exclusivos.',
              material: 'Papel bond 90g, tapa empapelada',
              size: '21 x 15 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '9',
          name: 'Facturas',
          description: 'Facturas y libros contables personalizados para negocios. Formatos triangulares, con copia y personalizados con datos de tu empresa.',
          icon: 'receipt_long',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 35,
          features: ['Formato legal', 'Hojas con copia', 'Personalización', 'Numeración'],
          slug: 'facturas',
          shortDescription: 'Facturas y documentos contables personalizados con formato legal.',
          fullDescription: 'Producimos facturas y documentos contables con formato legal, incluyendo opciones con copia, numeración secuencial y diseño personalizado con los datos de tu empresa.',
          variants: [
            {
              name: 'Triangular',
              description: 'Factura con formato triangular tradicional',
              price: 35,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Formato tradicional', 'Hojas intercaladas', 'Numeración impresa'],
              details: 'Factura triangular con formato tradicional mexicano, ideal para negocios pequeños.',
              material: 'Papel bond 60g intercalado con tinta',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Copia',
              description: 'Factura con hoja de copia incluida',
              price: 45,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Copia automática', 'Sin necesidad de cinta', 'Doble registro'],
              details: 'Factura con hoja intermedia que genera copia automática al escribir.',
              material: 'Papel bond 60g + hoja de copia',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Personalizadas',
              description: 'Factura con diseño y datos personalizados',
              price: 60,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Logo de empresa', 'Datos fiscales', 'Diseño exclusivo'],
              details: 'Factura completamente personalizada con el logo, datos fiscales y diseño de tu empresa.',
              material: 'Papel bond 70g con diseño personalizado',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Digital + Impresa',
              description: 'Factura con versión digital e impresa incluida',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Versión digital', 'Archivo editable', 'Impresión profesional', 'Formato PDF'],
              details: 'Incluye versión digital editable en PDF más el tiraje impreso para tu negocio.',
              material: 'Papel bond 70g + archivo digital',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '10',
          name: 'Recibos',
          description: 'Recibos personalizados para negocios y comercios. Opciones unitarias, en libreta, con diseño propio y formato NCR.',
          icon: 'payments',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 25,
          features: ['Formato profesional', 'Opciones con copia', 'Personalización', 'Numeración'],
          slug: 'recibos',
          shortDescription: 'Recibos personalizados para todo tipo de comercios y negocios.',
          fullDescription: 'Fabricamos recibos personalizados con el diseño y datos de tu negocio. Disponibles en formato unitario, libreta, con diseño propio y formato NCR para registro.',
          variants: [
            {
              name: 'Unitarios',
              description: 'Recibos sueltos individuales',
              price: 25,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Formato compacto', 'Fácil manejo', 'Impresión full color'],
              details: 'Recibos unitarios ideales para ventas al contado y transacciones rápidas.',
              material: 'Papel bond 60g',
              size: '14 x 8 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Libreta',
              description: 'Recibos en formato libreta con pegamento',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Formato libreta', 'Hojas con pegamento', 'Fácil uso'],
              details: 'Recibos en formato libreta con hojas engomadas, ideales para vendedores ambulantes y comercio.',
              material: 'Papel bond 60g con pegamento',
              size: '14 x 8 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Personalizados',
              description: 'Recibos con diseño y logo de tu negocio',
              price: 55,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Logo de empresa', 'Diseño propio', 'Datos fiscales'],
              details: 'Recibos completamente personalizados con tu logo, datos de negocio y diseño único.',
              material: 'Papel bond 70g personalizado',
              size: '14 x 8 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'NCR',
              description: 'Recibos con formato NCR para registro',
              price: 70,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Copia automática', 'Sin carboncillo', 'Formato legal'],
              details: 'Recibos en formato NCR que generan copia sin necesidad de carboncillo, ideal para control contable.',
              material: 'Papel NCR (sensible a presión)',
              size: '14 x 8 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '11',
          name: 'Carpetas',
          description: 'Carpetas personalizadas para organizar documentos y presentar propuestas. Diversos acabados y opciones con bolsillo.',
          icon: 'folder',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 30,
          features: ['Material resistente', 'Personalización completa', 'Opciones con bolsillo', 'Acabado profesional'],
          slug: 'carpetas',
          shortDescription: 'Carpetas personalizadas para documentos y presentaciones profesionales.',
          fullDescription: 'Creamos carpetas personalizadas con el diseño de tu empresa, disponibles en opciones simples, con bolsillo, de presentación y ejecutivas para todas tus necesidades.',
          variants: [
            {
              name: 'Simple',
              description: 'Carpeta de un solo panel con diseño impreso',
              price: 30,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño impreso', 'Costo accesible', 'Material resistente'],
              details: 'Carpeta simple con diseño impreso en ambas caras, ideal para organizar documentos.',
              material: 'Cartulina o cartón couché 300g',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Con bolsillo',
              description: 'Carpeta con bolsillo para insertar documentos',
              price: 50,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Bolsillo interior', 'Diseño personalizado', 'Funcional'],
              details: 'Carpeta con un bolsillo interior que permite insertar documentos y hojas sueltas.',
              material: 'Cartón couché 300g con bolsillo',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Presentación',
              description: 'Carpeta para presentaciones de negocios',
              price: 75,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño elegante', 'Múltiples bolsillos', 'Base para documentos'],
              details: 'Carpeta diseñada para presentaciones de negocio con múltiples compartimentos y acabado elegante.',
              material: 'Cartón couché 350g laminado',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Ejecutivas',
              description: 'Carpeta ejecutiva con acabados premium',
              price: 100,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabado premium', 'Empapelado', 'Serigrafía', 'Múltiples compartimentos'],
              details: 'Carpeta ejecutiva empapelada con serigrafía y acabados especiales para clientes VIP.',
              material: 'Cartón reforzado empapelado',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '12',
          name: 'Sobres',
          description: 'Sobres de diversos tamaños para correspondencia y documentos. Desde sobres estándar hasta personalizados con tu diseño.',
          icon: 'mail',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 10,
          features: ['Varios tamaños', 'Impresión personalizada', 'Material resistente', 'Cierre seguro'],
          slug: 'sobres',
          shortDescription: 'Sobres de correspondencia en múltiples tamaños y acabados.',
          fullDescription: 'Ofrecemos sobres en diversos tamaños desde oficio hasta dominical, con opción de personalización para correspondencia corporativa y envíos.',
          variants: [
            {
              name: 'Oficio',
              description: 'Sobres tamaño oficio para documentos',
              price: 10,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño estándar', 'Material resistente', 'Cierre adhesivo'],
              details: 'Sobres tamaño oficio ideales para enviar documentos, cartas y correspondencia.',
              material: 'Papel kraft o couché 90g',
              size: '24 x 35 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Medio oficio',
              description: 'Sobres tamaño medio oficio',
              price: 15,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño intermedio', 'Versátil', 'Cierre seguro'],
              details: 'Sobres de tamaño intermedio perfectos para documentos que no requieren tamaño completo.',
              material: 'Papel kraft o couché 90g',
              size: '20 x 28 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Dominical',
              description: 'Sobres grandes tamaño dominical',
              price: 20,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gran capacidad', 'Documentos grandes', 'Material grueso'],
              details: 'Sobres de gran tamaño ideales para planos, dibujos y documentos de gran formato.',
              material: 'Papel kraft 120g',
              size: '30 x 45 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Personalizados',
              description: 'Sobres con diseño y logo personalizado',
              price: 30,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño exclusivo', 'Logo impreso', 'Colores corporativos'],
              details: 'Sobres personalizados con el diseño, logo y colores de tu empresa para correspondencia profesional.',
              material: 'Papel couché 120g personalizado',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '13',
          name: 'Sellos',
          description: 'Sellos de calidad para oficinas y negocios. Sellos Trodat, automáticos, de madera y electrónicos con grabado personalizado.',
          icon: 'stamp',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 150,
          features: ['Grabado personalizado', 'Tinta incluida', 'Garantía', 'Varias medidas'],
          slug: 'sellos',
          shortDescription: 'Sellos profesionales con grabado personalizado para tu negocio.',
          fullDescription: 'Fabricamos sellos con grabado personalizado utilizando tecnología de precisión. Ofrecemos sellos Trodat, automáticos, de madera y electrónicos con tinta de alta calidad incluida.',
          variants: [
            {
              name: 'Trodat',
              description: 'Sello Trodat automático de alta calidad',
              price: 150,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Alta durabilidad', 'Mecanismo automático', 'Tinta incluida', 'Garantía de fábrica'],
              details: 'Sello Trodat profesional con mecanismo automático y carcasa resistente para uso intensivo.',
              material: 'Carcasa plástica/metal con caucho grabado',
              size: 'Medidas personalizables',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Automático',
              description: 'Sello automático de bolsillo',
              price: 200,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Portátil', 'Mecanismo suave', 'Carga de tinta fácil', 'Diseño compacto'],
              details: 'Sello automático compacto ideal para llevar en el bolsillo, perfecto para vendedores y agentes.',
              material: 'Carcasa metálica con caucho',
              size: 'Medidas personalizables',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Madera',
              description: 'Sello tradicional de madera',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño clásico', 'Madera resistente', 'Tinta incluida', 'Económico'],
              details: 'Sello tradicional de madera con grabado en caucho, ideal para oficinas y uso general.',
              material: 'Madera con caucho grabado',
              size: 'Medidas personalizables',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Electrónico',
              description: 'Sello electrónico de alta precisión',
              price: 350,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Alta precisión', 'Sin tinta necesaria', 'Tecnología moderna', 'Durable'],
              details: 'Sello electrónico con tecnología de impresión térmica que no requiere tinta.',
              material: 'Electrónica con cabezal térmico',
              size: 'Medidas personalizables',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '14',
          name: 'Invitaciones',
          description: 'Invitaciones personalizadas para eventos sociales y corporativos. Desde opciones básicas hasta premium con sobres incluidos.',
          icon: 'celebration',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 20,
          features: ['Diseño personalizado', 'Papel premium', 'Impresión full color', 'Opciones con sobre'],
          slug: 'invitaciones',
          shortDescription: 'Invitaciones personalizadas para bodas, quinceaños, eventos y más.',
          fullDescription: 'Diseñamos e imprimimos invitaciones personalizadas para todo tipo de eventos sociales y corporativos. Desde la tarjeta básica hasta el diseño exclusivo con sobre personalizado.',
          variants: [
            {
              name: 'Básicas',
              description: 'Invitación básica en papel couché',
              price: 20,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Impresión full color', 'Diseño incluido', 'Papel couché'],
              details: 'Invitación económica con diseño atractivo y calidad de impresión profesional.',
              material: 'Papel couché 250g',
              size: '10 x 15 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium',
              description: 'Invitación premium con acabados especiales',
              price: 45,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabados especiales', 'UV selectivo', 'Papel grueso', 'Diseño exclusivo'],
              details: 'Invitación con acabados premium que incluye UV selectivo y diseño exclusivo para tu evento.',
              material: 'Papel couché 350g con acabados',
              size: '12 x 18 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Exclusivas',
              description: 'Invitación exclusiva con serigrafía',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Serigrafía', 'Materiales de lujo', 'Diseño artístico', 'Alta exclusividad'],
              details: 'Invitación exclusiva con serigrafía y materiales de lujo para eventos de alto nivel.',
              material: 'Papel texturizado con serigrafía',
              size: '15 x 20 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium con sobres',
              description: 'Invitación premium incluyendo sobre personalizado',
              price: 100,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Sobre incluido', 'Diseño integral', 'Paquete completo', 'Presentación elegante'],
              details: 'Paquete completo que incluye invitación premium y sobre personalizado con el mismo diseño.',
              material: 'Papel couché 350g + sobre personalizado',
              size: 'Invitación: 12 x 18 cm, Sobre: 13 x 19 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '15',
          name: 'Papelería corporativa',
          description: 'Juego completo de papelería corporativa para empresas. Incluye tarjetas, membretes, sobres y más con diseño uniforme.',
          icon: 'corporate_fare',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 200,
          features: ['Diseño integral', 'Uniformidad de marca', 'Paquete completo', 'Alta calidad'],
          slug: 'papeleria-corporativa',
          shortDescription: 'Paquetes completos de papelería corporativa con diseño uniforme de marca.',
          fullDescription: 'Ofrecemos paquetes de papelería corporativa que incluyen todos los elementos necesarios para tu empresa con un diseño uniforme y profesional.',
          variants: [
            {
              name: 'Básica',
              description: 'Paquete básico de papelería corporativa',
              price: 200,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tarjetas', 'Membretes', 'Sobres', 'Diseño incluido'],
              details: 'Paquete básico que incluye tarjetas de presentación, membretes y sobres con diseño corporativo.',
              material: 'Papel couché 250g (tarjetas), bond 90g (membretes)',
              size: 'Estándar',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Profesional',
              description: 'Paquete profesional con más elementos',
              price: 350,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Todo lo básico', 'Hojas membretadas', 'Carpetas', 'Facturas'],
              details: 'Paquete profesional que agrega hojas membretadas, carpetas y facturas al paquete básico.',
              material: 'Papel couché 300g, bond 90g',
              size: 'Estándar',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Ejecutiva',
              description: 'Paquete ejecutivo con acabados premium',
              price: 500,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabados premium', 'Serigrafía', 'Sellos', 'Kit completo'],
              details: 'Paquete ejecutivo con acabados premium que incluye serigrafía, sellos y todos los elementos.',
              material: 'Papel premium con acabados especiales',
              size: 'Estándar',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium',
              description: 'Paquete premium con todo incluido',
              price: 800,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Todos los elementos', 'Acabados de lujo', 'Diseño exclusivo', 'Soporte continuo'],
              details: 'El paquete más completo con todos los elementos de papelería, acabados de lujo y diseño exclusivo.',
              material: 'Papel de lujo con todos los acabados',
              size: 'Estándar',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '16',
          name: 'Menús',
          description: 'Menús personalizados para restaurantes, hoteles y eventos. Disponibles en varios tamaños y acabados, incluyendo laminado.',
          icon: 'restaurant_menu',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 35,
          features: ['Diseño personalizado', 'Papel resistente', 'Opciones laminadas', 'Colores vibrantes'],
          slug: 'menus',
          shortDescription: 'Menús personalizados para restaurantes y eventos con acabados profesionales.',
          fullDescription: 'Diseñamos e imprimimos menús personalizados para restaurantes, hoteles, eventos y banquetes. Disponibles en diversos tamaños y acabados incluyendo laminado resistente.',
          variants: [
            {
              name: 'Básico',
              description: 'Menú básico en papel couché',
              price: 35,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Impresión full color', 'Papel couché', 'Diseño incluido'],
              details: 'Menú básico impreso en papel couché con diseño profesional y colores vibrantes.',
              material: 'Papel couché 170g',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium',
              description: 'Menú premium con diseño exclusivo',
              price: 60,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Diseño exclusivo', 'Papel grueso', 'Acabado mate'],
              details: 'Menú premium con diseño exclusivo y papel de mayor gramatura para una mejor presentación.',
              material: 'Papel couché 250g con acabado mate',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Laminado',
              description: 'Menú laminado resistente al agua y manchas',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Resistente al agua', 'Fácil limpieza', 'Larga durabilidad', 'Laminado brillante'],
              details: 'Menú laminado que resistente al agua y manchas, ideal para uso constante en restaurantes.',
              material: 'Papel couché 170g con laminado',
              size: '21 x 14 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Ejecutivo',
              description: 'Menú ejecutivo con acabados de lujo',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabados de lujo', 'Serigrafía', 'Empapelado', 'Presentación premium'],
              details: 'Menú ejecutivo con acabados de lujo, serigrafía y empapelado para restaurantes de alta gama.',
              material: 'Cartón reforzado empapelado',
              size: '25 x 18 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '17',
          name: 'Catálogos',
          description: 'Impresión de catálogos profesionales con encuadernado de calidad. Desde 8 hasta 32 páginas con diseño corporativo.',
          icon: 'auto_stories',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 150,
          features: ['Encuadernado profesional', 'Papel couché', 'Color full', 'Diseño incluido'],
          slug: 'catalogos',
          shortDescription: 'Catálogos profesionales con encuadernado de alta calidad.',
          fullDescription: 'Producimos catálogos profesionales con encuadernado de calidad en papel couché, ideales para empresas que quieren presentar sus productos o servicios de manera atractiva.',
          variants: [
            {
              name: '8 páginas',
              description: 'Catálogo de 8 páginas (tapa + 6 interiores)',
              price: 150,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tapa couché', 'Interior bond', 'Encuadernado grapa', 'Diseño incluido'],
              details: 'Catálogo compacto con tapa en papel couché e interior en papel bond.',
              material: 'Tapa couché 300g, interior bond 90g',
              size: '21 x 28 cm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '16 páginas',
              description: 'Catálogo de 16 páginas con encuadernado perfect',
              price: 280,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Encuadernado perfect', 'Papel couché', 'Diseño profesional', 'Más espacio'],
              details: 'Catálogo de 16 páginas con encuadernado perfect bind para una presentación más profesional.',
              material: 'Papel couché 170g',
              size: '21 x 28 cm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '24 páginas',
              description: 'Catálogo de 24 páginas con diseño integral',
              price: 400,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gran capacidad', 'Diseño integral', 'Encuadernado calidad', 'Papel premium'],
              details: 'Catálogo de 24 páginas con amplio espacio para mostrar toda tu línea de productos.',
              material: 'Papel couché 200g',
              size: '21 x 28 cm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '32 páginas',
              description: 'Catálogo de 32 páginas completo',
              price: 520,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gran volumen', 'Diseño exhaustivo', 'Papel de alta calidad', 'Encuadernado premium'],
              details: 'El catálogo más completo con 32 páginas para empresas con grandes catálogos de productos.',
              material: 'Papel couché 200g',
              size: '21 x 28 cm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '18',
          name: 'Revistas',
          description: 'Impresión de revistas con encuadernado profesional y papel de alta calidad. Desde 16 hasta 64 páginas con acabados premium.',
          icon: 'menu_book',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 200,
          features: ['Encuadernado profesional', 'Papel couché', 'Tapa dura opcional', 'Impresión full color'],
          slug: 'revistas',
          shortDescription: 'Revistas impresas con encuadernado profesional y acabados de calidad.',
          fullDescription: 'Nuestras revistas se imprimen en papel couché de alta calidad con encuadernado profesional. Ideales para publicaciones corporativas, culturales y comerciales.',
          variants: [
            {
              name: '16 páginas',
              description: 'Revista de 16 páginas con tapa y solapa',
              price: 200,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tapa couché', 'Interior a todo color', 'Encuadernado grapa', 'Diseño incluido'],
              details: 'Revista de 16 páginas con tapa en papel couché y acabado profesional.',
              material: 'Tapa couché 300g, interior couché 170g',
              size: '21 x 28 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '32 páginas',
              description: 'Revista de 32 páginas con encuadernado perfect',
              price: 380,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Encuadernado perfect', 'Papel couché', 'Acabado premium', 'Gran volumen'],
              details: 'Revista de 32 páginas con encuadernado perfect bind para una presentación editorial profesional.',
              material: 'Papel couché 170g, tapa 300g',
              size: '21 x 28 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '48 páginas',
              description: 'Revista de 48 páginas con diseño integral',
              price: 520,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gran volumen', 'Diseño editorial', 'Papel de calidad', 'Encuadernado premium'],
              details: 'Revista de 48 páginas para publicaciones extensas con diseño editorial completo.',
              material: 'Papel couché 170g, tapa 300g',
              size: '21 x 28 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '64 páginas',
              description: 'Revista de 64 páginas, la más completa',
              price: 700,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Máxima capacidad', 'Diseño profesional', 'Papel premium', 'Tapa dura opcional'],
              details: 'La revista más extensa con 64 páginas, ideal para publicaciones de gran volumen y calidad editorial.',
              material: 'Papel couché 170g, tapa dura opcional',
              size: '21 x 28 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '19',
          name: 'Trípticos',
          description: 'Trípticos publicitarios en diversos tamaños y papeles. Ideales para promociones, eventos e información de servicios.',
          icon: 'view_week',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 40,
          features: ['Impresión full color', 'Papel couché', 'Diseño incluido', 'Doblez profesional'],
          slug: 'tripticos',
          shortDescription: 'Trípticos publicitarios con impresión a todo color y diseño profesional.',
          fullDescription: 'Nuestros trípticos se imprimen a todo color en papel couché con doblez profesional. Ideales para promociones, eventos y presentación de servicios.',
          variants: [
            {
              name: 'A4',
              description: 'Tríptico tamaño A4 (21 x 29.7 cm)',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño estándar', '6 paneles', 'Papel couché', 'Diseño incluido'],
              details: 'Tríptico tamaño A4 con 6 paneles para información completa de servicios o promociones.',
              material: 'Papel couché 170g',
              size: '21 x 29.7 cm (A4)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Legal',
              description: 'Tríptico tamaño legal (21.6 x 35.6 cm)',
              price: 55,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Más espacio', 'Paneles amplios', 'Material grueso'],
              details: 'Tríptico en tamaño legal que ofrece más espacio para contenido detallado.',
              material: 'Papel couché 170g',
              size: '21.6 x 35.6 cm (Legal)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Oficio',
              description: 'Tríptico tamaño oficio (21.6 x 27.9 cm)',
              price: 70,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño oficio', 'Gran capacidad', 'Diseño integral'],
              details: 'Tríptico en tamaño oficio ideal para información extensa con diseño atractivo.',
              material: 'Papel couché 200g',
              size: '21.6 x 27.9 cm (Oficio)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Doble cara',
              description: 'Tríptico impreso por ambos lados',
              price: 90,
              image: 'assets/images/services/imagen1.jpg',
              features: ['12 paneles', 'Doble cara', 'Máximo contenido', 'Diseño integral'],
              details: 'Tríptico impreso en ambas caras que ofrece 12 paneles de información.',
              material: 'Papel couché 170g',
              size: 'A4 doble cara',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '20',
          name: 'Dípticos',
          description: 'Dípticos publicitarios plegados por la mitad. Disponibles en varios tamaños y papeles con impresión de alta calidad.',
          icon: 'view_sidebar',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 30,
          features: ['Diseño compacto', 'Doblez profesional', 'Papel couché', 'Impresión full color'],
          slug: 'dipticos',
          shortDescription: 'Dípticos publicitarios con diseño compacto y doblez profesional.',
          fullDescription: 'Nuestros dípticos son ideales para presentar información de manera concisa y atractiva. Disponibles en varios tamaños con impresión a todo color.',
          variants: [
            {
              name: 'A5',
              description: 'Díptico tamaño A5 (14.8 x 21 cm)',
              price: 30,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño compacto', '4 paneles', 'Fácil distribución'],
              details: 'Díptico compacto tamaño A5 perfecto para promociones y eventos.',
              material: 'Papel couché 170g',
              size: '14.8 x 21 cm (A5)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'A4',
              description: 'Díptico tamaño A4 (21 x 29.7 cm)',
              price: 45,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño estándar', 'Gran espacio', 'Diseño incluido'],
              details: 'Díptico tamaño A4 con amplio espacio para contenido e imágenes.',
              material: 'Papel couché 170g',
              size: '21 x 29.7 cm (A4)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Legal',
              description: 'Díptico tamaño legal (21.6 x 35.6 cm)',
              price: 60,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Más espacio', 'Paneles amplios', 'Material grueso'],
              details: 'Díptico en tamaño legal que ofrece mayor espacio para información detallada.',
              material: 'Papel couché 200g',
              size: '21.6 x 35.6 cm (Legal)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Personalizado',
              description: 'Díptico con tamaño y diseño personalizados',
              price: 80,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Tamaño a medida', 'Diseño exclusivo', 'Doblez personalizado'],
              details: 'Díptico con tamaño y diseño personalizados según las necesidades de tu proyecto.',
              material: 'Papel a elegir',
              size: 'Personalizable',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '21',
          name: 'Folders',
          description: 'Folders para presentación de documentos y propuestas comerciales. Diversos tipos de bolsillos y acabados.',
          icon: 'drive_file_move',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 50,
          features: ['Diseño personalizado', 'Bolsillos internos', 'Material resistente', 'Acabado profesional'],
          slug: 'folders',
          shortDescription: 'Folders para presentación profesional con bolsillos y acabados de calidad.',
          fullDescription: 'Nuestros folders se diseñan con la identidad visual de tu empresa e incluyen bolsillos internos para documentos. Ideales para propuestas comerciales y presentaciones.',
          variants: [
            {
              name: '1 bolsillo',
              description: 'Folder con un bolsillo interno',
              price: 50,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Un bolsillo interno', 'Diseño impreso', 'Material resistente'],
              details: 'Folder con un bolsillo interno para documentos, ideal para presentaciones sencillas.',
              material: 'Cartón couché 300g',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: '2 bolsillos',
              description: 'Folder con dos bolsillos internos',
              price: 75,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Dos bolsillos', 'Mayor capacidad', 'Diseño completo'],
              details: 'Folder con dos bolsillos internos para organizar diferentes tipos de documentos.',
              material: 'Cartón couché 350g',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Ejecutivo',
              description: 'Folder ejecutivo con acabados premium',
              price: 100,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabados premium', 'Bolsillo reforzado', 'Empapelado', 'Serigrafía'],
              details: 'Folder ejecutivo con acabados premium, empapelado y serigrafía para clientes importantes.',
              material: 'Cartón reforzado empapelado',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Premium',
              description: 'Folder premium con todos los acabados',
              price: 150,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Todos los acabados', 'Múltiples bolsillos', 'Porta tarjeta', 'Diseño exclusivo'],
              details: 'El folder más completo con múltiples bolsillos, porta tarjetas y acabados de lujo.',
              material: 'Cartón reforzado empapelado de lujo',
              size: '22 x 32 cm',
              deliveryTime: '3-5 días hábiles'
            }
          ],
          enabled: true
        },
        {
          id: '22',
          name: 'Credenciales',
          description: 'Credenciales y gafetes personalizados para eventos, empresas y conferencias. PVC duradero con impresión a todo color.',
          icon: 'badge',
          image: 'assets/images/services/imagen1.jpg',
          priceFrom: 40,
          features: ['Material PVC', 'Impresión full color', 'Gafete incluido', 'Diseño personalizado'],
          slug: 'credenciales',
          shortDescription: 'Credenciales y gafetes en PVC con diseño personalizado y alta durabilidad.',
          fullDescription: 'Producimos credenciales en PVC de alta resistencia con impresión a todo color. Ideales para eventos, conferencias, empresas y control de acceso con gafete incluido.',
          variants: [
            {
              name: 'PVC',
              description: 'Credencial básica en PVC blanco',
              price: 40,
              image: 'assets/images/services/imagen1.jpg',
              features: ['PVC blanco', 'Impresión full color', 'Perforación para gafete'],
              details: 'Credencial básica en PVC con perforación para gafete e impresión a todo color.',
              material: 'PVC blanco 0.76mm',
              size: '8.6 x 5.4 cm (crédito)',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Con gafete',
              description: 'Credencial con gafete de seguridad incluido',
              price: 60,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Gafete incluido', 'Cordón personalizado', 'Seguridad básica'],
              details: 'Credencial en PVC con gafete de seguridad y cordón que incluye el color de tu marca.',
              material: 'PVC blanco 0.76mm + gafete',
              size: '8.6 x 5.4 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'Corporativas',
              description: 'Credencial corporativa con código de barras o QR',
              price: 85,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Código QR o barras', 'Diseño corporativo', 'Control de acceso', 'Gafete premium'],
              details: 'Credencial corporativa con código QR o de barras para control de acceso y registro de asistencia.',
              material: 'PVC 0.76mm con código impreso',
              size: '8.6 x 5.4 cm',
              deliveryTime: '3-5 días hábiles'
            },
            {
              name: 'VIP',
              description: 'Credencial VIP con acabados especiales',
              price: 120,
              image: 'assets/images/services/imagen1.jpg',
              features: ['Acabados de lujo', 'Holograma', 'Gafete premium', 'Cordón de seda'],
              details: 'Credencial VIP con acabados especiales incluyendo holograma para eventos de alto nivel.',
              material: 'PVC 0.76mm con acabados especiales',
              size: '8.6 x 5.4 cm',
              deliveryTime: '3-5 días hábiles'
            }
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