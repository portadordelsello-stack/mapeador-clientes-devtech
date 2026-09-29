// Base de datos inicial para Santa Fe (Precargada para funcionar de inmediato sin API Keys)
// Permite comenzar a prospectar consultorios y ferreterías de inmediato

window.DEFAULT_PLACES = [
  // --- ODONTOLOGÍA ---
  {
    id: "sf-cio-odonto",
    name: "Centro Integral en Odontología (CIO)",
    category: "Dentista / Odontología",
    categoryType: "dental",
    address: "Mariano Comas 2650, Santa Fe",
    phone: "+54 342 455-8921",
    website: "", // Sin web = Oportunidad
    rating: 5.0,
    reviewCount: 4,
    openStatus: "Cerrado · Abre lunes 9:00 a.m.",
    lat: -31.6315,
    lng: -60.7025,
    photos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro+Integral+en+Odontologia+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Tienen calificación perfecta (5.0) pero solo 4 reseñas y NO tienen sitio web oficial. Están perdiendo pacientes frente a consultorios con más presencia en Google Maps."
    }
  },
  {
    id: "sf-cirugia-bucomax",
    name: "Centro de Cirugía Bucomaxilofacial e Implantes",
    category: "Cirugía Odontológica",
    categoryType: "dental",
    address: "San Jerónimo 3140, Santa Fe",
    phone: "+54 342 452-1134",
    website: "https://odontologiasantafe.com.ar",
    rating: 4.8,
    reviewCount: 22,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6365,
    lng: -60.7018,
    photos: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro+Cirugia+Bucomaxilofacial+San+Jeronimo+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Tienen sitio web pero sin canal de mensajería rápida ni optimización para búsqueda local de urgencias dentales."
    }
  },

  // --- CONSULTORIOS MÉDICOS / SANATORIOS ---
  {
    id: "sf-sanatorio-diag",
    name: "Sanatorio Diagnóstico",
    category: "Sanatorio / Centro Médico",
    categoryType: "medical",
    address: "25 de Mayo 3240, Santa Fe",
    phone: "+54 342 457-3300",
    website: "https://sanatoriodiagnostico.com.ar",
    rating: 4.1,
    reviewCount: 148,
    openStatus: "Abierto 24 horas",
    lat: -31.6372,
    lng: -60.7001,
    photos: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sanatorio+Diagnostico+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Mucho tráfico de pacientes. Frecuentes consultas en reseñas sobre líneas ocupadas para solicitar turnos."
    }
  },
  {
    id: "sf-med-constituyentes",
    name: "Centro Médico Constituyentes",
    category: "Consultorios Médicos Múltiples",
    categoryType: "medical",
    address: "Obispo Gelabert 2840, Santa Fe",
    phone: "+54 342 453-7722",
    website: "", // Sin web
    rating: 4.3,
    reviewCount: 19,
    openStatus: "Abierto · Cierra 20:00",
    lat: -31.6358,
    lng: -60.7032,
    photos: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro+Medico+Constituyentes+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Sin sitio web y con horarios incompletos en Google Maps. Múltiples profesionales compartiendo recepción."
    }
  },
  {
    id: "sf-vital-centro",
    name: "Vital Centro Médico",
    category: "Consultorio Médico y Diagnóstico",
    categoryType: "medical",
    address: "San Martín 3120, Santa Fe",
    phone: "+54 342 456-0200",
    website: "",
    rating: 4.5,
    reviewCount: 12,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6380,
    lng: -60.6990,
    photos: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Vital+Centro+Medico+San+Martin+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Ubicación privilegiada en pleno centro sobre San Martín pero con baja presencia digital y pocas reseñas."
    }
  },
  {
    id: "sf-deportmed",
    name: "Clínica DeportMed - Traumatología & Kinesiología",
    category: "Kinesiología y Medicina Deportiva",
    categoryType: "medical",
    address: "Suipacha 2750, Santa Fe",
    phone: "+54 342 454-9988",
    website: "https://deportmed.com.ar",
    rating: 4.7,
    reviewCount: 38,
    openStatus: "Abierto · Cierra 20:30",
    lat: -31.6395,
    lng: -60.7040,
    photos: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Clinica+DeportMed+Suipacha+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Pacientes recurrentes de rehabilitación deportiva y kinesiología."
    }
  },

  // --- ESTÉTICA / BELLEZA ---
  {
    id: "sf-belkys-estetica",
    name: "Belkys - Centro Integral de Estética",
    category: "Estética y Cosmetología",
    categoryType: "aesthetic",
    address: "San Jerónimo 3420, Santa Fe",
    phone: "+54 342 458-1200",
    website: "https://instagram.com/belkysestetica",
    rating: 4.9,
    reviewCount: 31,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6340,
    lng: -60.7015,
    photos: [
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Belkys+Centro+Integral+Estetica+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Derivan tráfico a Instagram en lugar de tener ficha optimizada en Google Business con agendamiento directo."
    }
  },
  {
    id: "sf-sm-estetica",
    name: "SM Estética Integral & Spa",
    category: "Centro de Estética",
    categoryType: "aesthetic",
    address: "1 de Mayo 3260, Santa Fe",
    phone: "+54 342 452-9011",
    website: "",
    rating: 4.6,
    reviewCount: 15,
    openStatus: "Abierto · Cierra 18:30",
    lat: -31.6375,
    lng: -60.7050,
    photos: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=SM+Estetica+Integral+1+de+Mayo+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Faltan fotos de tratamientos y lista de precios/servicios en su perfil de Google."
    }
  },
  {
    id: "sf-calvo-estetica",
    name: "Calvo Estética & Cirugía Plástica",
    category: "Estética Médica y Plástica",
    categoryType: "aesthetic",
    address: "Bv. Pellegrini 2640, Santa Fe",
    phone: "+54 342 455-6677",
    website: "https://calvoestetica.com.ar",
    rating: 4.8,
    reviewCount: 44,
    openStatus: "Abierto · Cierra 20:00",
    lat: -31.6335,
    lng: -60.6975,
    photos: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Calvo+Estetica+Bv+Pellegrini+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Tratamientos de alto valor en Bulevar. Clave mejorar la conversión de consultas a citas presenciales."
    }
  },
  {
    id: "sf-harmony-beauty",
    name: "Harmony Beauty & Lash Studio",
    category: "Belleza y Pestañas / Cejas",
    categoryType: "aesthetic",
    address: "Sarmiento 3510, Candioti Norte, Santa Fe",
    phone: "+54 342 459-3312",
    website: "",
    rating: 5.0,
    reviewCount: 8,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6320,
    lng: -60.6930,
    photos: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Harmony+Beauty+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Barrio Candioti con clientes de alto poder adquisitivo pero solo 8 reseñas en Google Maps."
    }
  },

  // --- FERRETERÍAS / COMERCIO INDUSTRIAL ---
  {
    id: "sf-ferr-industrial",
    name: "Ferretería Industrial Santa Fe",
    category: "Ferretería Industrial & Maquinaria",
    categoryType: "hardware",
    address: "Av. Facundo Zuviría 4520, Santa Fe",
    phone: "+54 342 489-1020",
    website: "", // Sin web
    rating: 4.4,
    reviewCount: 65,
    openStatus: "Abierto · Cierra 18:00",
    lat: -31.6240,
    lng: -60.7070,
    photos: [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ferreteria+Industrial+Facundo+Zuviria+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Gran volumen de mostrador pero sin catálogo digital ni canal de cotización rápida."
    }
  },
  {
    id: "sf-bulonera-freyre",
    name: "Bulonera Santa Fe & Herramientas",
    category: "Bulonería y Ferretería",
    categoryType: "hardware",
    address: "Av. Gobernador Freyre 2940, Santa Fe",
    phone: "+54 342 455-4422",
    website: "",
    rating: 4.6,
    reviewCount: 48,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6360,
    lng: -60.7110,
    photos: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bulonera+Santa+Fe+Av+Freyre",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Negocio estratégico sobre Av. Freyre sin presencia web ni fotos actualizadas de su stock."
    }
  },
  {
    id: "sf-ferr-don-pedro",
    name: "Ferretería y Pinturería Don Pedro",
    category: "Ferretería Barrial y Pinturería",
    categoryType: "hardware",
    address: "Bv. Pellegrini 3020, Santa Fe",
    phone: "+54 342 456-7890",
    website: "",
    rating: 4.2,
    reviewCount: 18,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6345,
    lng: -60.7060,
    photos: [
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ferreteria+Don+Pedro+Bv+Pellegrini+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Pocas reseñas y horarios de siesta no especificados en Google Maps."
    }
  },
  {
    id: "sf-ferr-candioti",
    name: "Ferretería Candioti",
    category: "Ferretería y Sanitarios",
    categoryType: "hardware",
    address: "Güemes 3410, Candioti Norte, Santa Fe",
    phone: "+54 342 453-2211",
    website: "",
    rating: 4.7,
    reviewCount: 29,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6310,
    lng: -60.6920,
    photos: [
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ferreteria+Candioti+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Ferretería de barrio con clientes constantes pero sin ficha verificada."
    }
  }
];

// Helper para guardar / cargar en localStorage
window.STORAGE_KEYS = {
  PLACES: "geoprospector_places_v2",
  CONFIG: "geoprospector_config_v2"
};

window.getStoredPlaces = function() {
  try {
    const raw = localStorage.getItem(window.STORAGE_KEYS.PLACES);
    if (!raw) {
      localStorage.setItem(window.STORAGE_KEYS.PLACES, JSON.stringify(window.DEFAULT_PLACES));
      return window.DEFAULT_PLACES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error leyendo lugares de localStorage:", e);
    return window.DEFAULT_PLACES;
  }
};

window.saveStoredPlaces = function(places) {
  try {
    localStorage.setItem(window.STORAGE_KEYS.PLACES, JSON.stringify(places));
  } catch (e) {
    console.error("Error guardando lugares en localStorage:", e);
  }
};

window.getStoredConfig = function() {
  try {
    const raw = localStorage.getItem(window.STORAGE_KEYS.CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    googleMapsApiKey: "",
    defaultCity: "Santa Fe, Argentina",
    defaultCoords: { lat: -31.635, lng: -60.702 }
  };
};

window.saveStoredConfig = function(cfg) {
  try {
    localStorage.setItem(window.STORAGE_KEYS.CONFIG, JSON.stringify(cfg));
  } catch (e) {
    console.error("Error guardando config en localStorage:", e);
  }
};
