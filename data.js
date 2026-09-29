// Base de datos inicial para Santa Fe (Precargada para funcionar de inmediato)
// Incluye talleres mecánicos, odontología, medicina, estética y ferreterías

window.DEFAULT_PLACES = [
  // --- TALLERES MECÁNICOS & AUTOMOTRIZ ---
  {
    id: "sf-taller-santafe-motors",
    name: "Taller Mecánico Santa Fe Motors - Inyección & Frenos",
    category: "Taller Mecánico / Electricidad del Automotor",
    categoryType: "mechanical",
    address: "Av. Facundo Zuviría 5240, Santa Fe",
    phone: "+54 342 460-8812",
    website: "", // Sin web = Oportunidad
    rating: 4.8,
    reviewCount: 34,
    openStatus: "Abierto · Cierra 18:30",
    lat: -31.6210,
    lng: -60.7085,
    photos: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Taller+Mecanico+Facundo+Zuviria+Santa+Fe",
    visitStatus: "pending",
    contactName: "Mariano (Jefe de Taller)",
    contactPhone: "+54 342 460-8812",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Taller con excelente reputación (4.8) sobre Av. Facundo Zuviría pero sin sitio web ni catálogo de servicios de diagnóstico computarizado."
    }
  },
  {
    id: "sf-taller-candioti-garage",
    name: "Candioti Garage & Mecánica Integral",
    category: "Taller Mecánico Multimarca",
    categoryType: "mechanical",
    address: "Iturraspe 1950, Candioti Sur, Santa Fe",
    phone: "+54 342 455-7730",
    website: "",
    rating: 4.6,
    reviewCount: 14,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6350,
    lng: -60.6910,
    photos: [
      "https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mecanica+Integral+Iturraspe+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Ubicado en zona de alto poder adquisitivo pero con solo 14 reseñas y sin botón de WhatsApp en su perfil de Google Maps."
    }
  },
  {
    id: "sf-taller-diesel-freyre",
    name: "Inyección Diesel & Nafta Freyre",
    category: "Mecánica Pesada y Diagnóstico Diesel",
    categoryType: "mechanical",
    address: "Av. Gobernador Freyre 3420, Santa Fe",
    phone: "+54 342 453-6622",
    website: "https://dieselfreyre.com.ar",
    rating: 4.4,
    reviewCount: 52,
    openStatus: "Abierto · Cierra 18:00",
    lat: -31.6330,
    lng: -60.7120,
    photos: [
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Inyeccion+Diesel+Av+Freyre+Santa+Fe",
    visitStatus: "pending",
    contactName: "Roberto",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Gran flujo de camionetas y utilitarios comerciales. Necesitan canal ágil de turnos rápidos."
    }
  },
  {
    id: "sf-taller-suspension-aristobulo",
    name: "Alineación, Balanceo & Suspensión del Norte",
    category: "Gomería y Tren Delantero",
    categoryType: "mechanical",
    address: "Av. Aristóbulo del Valle 6120, Santa Fe",
    phone: "+54 342 489-3344",
    website: "",
    rating: 4.7,
    reviewCount: 28,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6180,
    lng: -60.6980,
    photos: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Alineacion+Aristobulo+del+Valle+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Punto clave sobre Aristóbulo del Valle pero sin fotos del equipamiento de alineación computarizada."
    }
  },

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
  }
];

window.STORAGE_KEYS = {
  PLACES: "geoprospector_places_v3",
  CONFIG: "geoprospector_config_v3",
  SAVED_SEARCHES: "geoprospector_searches_v3"
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
