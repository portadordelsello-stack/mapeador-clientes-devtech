// Base de datos de locales comerciales para Santa Fe, Argentina
// Incluye Supermercados, Tiendas de Telas & Mercerías, Talleres Mecánicos,
// Odontología, Medicina & Sanatorios, Estética & Belleza y Ferreterías.

window.DEFAULT_PLACES = [
  // --- SUPERMERCADOS & AUTOSERVICIOS (SANTA FE) ---
  {
    id: "sf-super-coto-puerto",
    name: "Hipermercado Coto - Puerto Santa Fe",
    category: "Supermercado / Hipermercado",
    categoryType: "supermarket",
    address: "Dique 1, Puerto de Santa Fe, Santa Fe",
    phone: "+54 342 450-4500",
    website: "https://www.coto.com.ar",
    rating: 4.4,
    reviewCount: 4210,
    openStatus: "Abierto · Cierra 21:30",
    lat: -31.6515,
    lng: -60.6978,
    photos: [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Coto+Puerto+Santa+Fe",
    visitStatus: "pending",
    contactName: "Gerencia Comercial",
    contactPhone: "+54 342 450-4500",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Punto neurálgico en Puerto Santa Fe. Alto tráfico diario y potencial para alianzas comerciales y promociones geolocalizadas."
    }
  },
  {
    id: "sf-super-kilbel-candido",
    name: "Supermercados Kilbel - Sucursal San Jerónimo",
    category: "Cadena de Supermercados",
    categoryType: "supermarket",
    address: "San Jerónimo 3450 y Cándido Pujato, Santa Fe",
    phone: "+54 342 453-2900",
    website: "https://www.kilbel.com.ar",
    rating: 4.2,
    reviewCount: 312,
    openStatus: "Abierto · Cierra 21:00",
    lat: -31.6368,
    lng: -60.7065,
    photos: [
      "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercados+Kilbel+San+Jeronimo+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Supermercado tradicional en zona centro-norte. Oportunidad en optimización de catálogo digital y delivery en Santa Fe."
    }
  },
  {
    id: "sf-super-alvear-boulevard",
    name: "Supermercados Alvear - Boulevard",
    category: "Supermercado y Fiambrería",
    categoryType: "supermarket",
    address: "Bv. Pellegrini 2780 esq. San Jerónimo, Santa Fe",
    phone: "+54 342 455-8822",
    website: "https://supermercadosalvear.com.ar",
    rating: 4.5,
    reviewCount: 540,
    openStatus: "Abierto · Cierra 21:30",
    lat: -31.6382,
    lng: -60.7052,
    photos: [
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercados+Alvear+Boulevard+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Ubicación prémium en Barrio Candioti / Boulevard. Oportunidad para captar clientes corporativos y eventos."
    }
  },
  {
    id: "sf-super-mayorista-buensol",
    name: "Supermercado Mayorista Buen Sol S.R.L.",
    category: "Mayorista de Alimentos & Bebidas",
    categoryType: "supermarket",
    address: "Santiago del Estero 2850, Santa Fe",
    phone: "+54 342 453-9911",
    website: "", // Sin web = Oportunidad
    rating: 4.3,
    reviewCount: 68,
    openStatus: "Abierto · Cierra 18:30",
    lat: -31.6390,
    lng: -60.6999,
    photos: [
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercado+Mayorista+Buen+Sol+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Mayorista de gran volumen pero SIN SITIO WEB NI CATÁLOGO ONLINE. Clave para ofrecer tienda B2B mayorista."
    }
  },
  {
    id: "sf-super-patricia",
    name: "Supermercado Patricia - Aristóbulo",
    category: "Supermercado de Barrio",
    categoryType: "supermarket",
    address: "Av. Aristóbulo del Valle 5840, Santa Fe",
    phone: "+54 342 460-1420",
    website: "", // Sin web = Oportunidad
    rating: 4.1,
    reviewCount: 45,
    openStatus: "Abierto · Cierra 20:30",
    lat: -31.6276,
    lng: -60.7001,
    photos: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Supermercado+Patricia+Aristobulo+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Supermercado barrial consolidado sobre avenida comercial pero sin presencia web ni promociones digitales."
    }
  },

  // --- TIENDAS DE TELAS, MERCERÍAS & TEXTILES (SANTA FE) ---
  {
    id: "sf-telas-tienda-sanjeronimo",
    name: "Tienda de Telas San Jerónimo",
    category: "Telas por Metro, Seda & Confección",
    categoryType: "textile",
    address: "San Jerónimo 3120, Ex-Plaza España, Santa Fe",
    phone: "+54 342 455-8910",
    website: "", // Sin web = Oportunidad
    rating: 4.7,
    reviewCount: 24,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6385,
    lng: -60.7058,
    photos: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tienda+de+Telas+San+Jeronimo+Santa+Fe",
    visitStatus: "pending",
    contactName: "Silvia (Propietaria)",
    contactPhone: "+54 342 455-8910",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Tienda histórica de telas en San Jerónimo. Clientes buscan catálogo de telas de fiesta y tapicería pero NO tiene web ni WhatsApp Business integrado."
    }
  },
  {
    id: "sf-telas-la-tijera-peatonal",
    name: "La Tijera - Telas & Mercería Peatonal",
    category: "Venta de Telas, Lanas y Mercería",
    categoryType: "textile",
    address: "San Martín 2450, Peatonal Santa Fe",
    phone: "+54 342 455-1234",
    website: "", // Sin web = Oportunidad
    rating: 4.8,
    reviewCount: 38,
    openStatus: "Abierto · Cierra 20:00",
    lat: -31.6490,
    lng: -60.7080,
    photos: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=La+Tijera+Telas+San+Martin+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Plena peatonal comercial santafesina. Gran tráfico de costureras y modistas que necesitan consultar stock y precios online."
    }
  },
  {
    id: "sf-telas-rivadavia",
    name: "Telas & Diseños Rivadavia",
    category: "Telas de Vestir, Punto & Cortinería",
    categoryType: "textile",
    address: "Av. Rivadavia 2840, Santa Fe",
    phone: "+54 342 456-7788",
    website: "",
    rating: 4.6,
    reviewCount: 16,
    openStatus: "Abierto · Cierra 19:00",
    lat: -31.6410,
    lng: -60.7012,
    photos: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Telas+Rivadavia+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Muy pocas reseñas en Google Maps (16) a pesar de estar sobre el corredor mayorista de Av. Rivadavia. Oportunidad en captación de talleres de indumentaria."
    }
  },
  {
    id: "sf-telas-boulevard-sederia",
    name: "Sedería & Telas Finas Boulevard",
    category: "Sedería, Encajes & Telas de Alta Costura",
    categoryType: "textile",
    address: "Bv. Pellegrini 2610, Santa Fe",
    phone: "+54 342 454-0012",
    website: "https://sederiaboulevard.com.ar",
    rating: 4.9,
    reviewCount: 52,
    openStatus: "Abierto · Cierra 19:30",
    lat: -31.6375,
    lng: -60.7035,
    photos: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sederia+Boulevard+Santa+Fe",
    visitStatus: "pending",
    contactName: "Mirta (Diseñadora)",
    contactPhone: "+54 342 454-0012",
    notes: "",
    auditSummary: {
      hasWebsite: true,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Negocio de alta gama especializado en novias y 15 años. Buena presencia pero requiere campañas de posicionamiento geolocalizado en Santa Fe y Paraná."
    }
  },
  {
    id: "sf-textil-retazos-suipacha",
    name: "Telas & Retazos del Litoral",
    category: "Retacería y Mayorista de Telas",
    categoryType: "textile",
    address: "Suipacha 2730, Santa Fe",
    phone: "+54 342 452-9800",
    website: "",
    rating: 4.4,
    reviewCount: 11,
    openStatus: "Abierto · Cierra 18:00",
    lat: -31.6391,
    lng: -60.7085,
    photos: [
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Retazos+Suipacha+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: true,
      unclaimedProfile: false,
      hook: "Precios competitivos por kilo pero solo 11 reseñas en Google. Oportunidad para mejorar presencia en el mapa comercial."
    }
  },

  // --- TALLERES MECÁNICOS & AUTOMOTRIZ ---
  {
    id: "sf-taller-santafe-motors",
    name: "Taller Mecánico Santa Fe Motors - Inyección & Frenos",
    category: "Taller Mecánico / Electricidad del Automotor",
    categoryType: "mechanical",
    address: "Av. Facundo Zuviría 5240, Santa Fe",
    phone: "+54 342 460-8812",
    website: "",
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

  // --- ODONTOLOGÍA & SALUD DENTAL ---
  {
    id: "sf-cio-odonto",
    name: "Centro Integral en Odontología (CIO)",
    category: "Dentista / Odontología",
    categoryType: "dental",
    address: "Mariano Comas 2650, Santa Fe",
    phone: "+54 342 455-8921",
    website: "",
    rating: 5.0,
    reviewCount: 4,
    openStatus: "Abierto · Cierra 18:00",
    lat: -31.6315,
    lng: -60.7025,
    photos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80"
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
      hook: "Calificación perfecta (5.0) pero solo 4 reseñas y SIN sitio web oficial. Oportunidad en captación de pacientes."
    }
  },

  // --- FERRETERÍAS & CONSTRUCCIÓN ---
  {
    id: "sf-ferret-central",
    name: "Ferretería Industrial Santa Fe Central",
    category: "Ferretería Industrial / Maquinarias",
    categoryType: "hardware",
    address: "Av. Rivadavia 3200, Santa Fe",
    phone: "+54 342 456-1122",
    website: "",
    rating: 4.6,
    reviewCount: 42,
    openStatus: "Abierto · Cierra 18:30",
    lat: -31.6345,
    lng: -60.7010,
    photos: [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80"
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ferreteria+Industrial+Rivadavia+Santa+Fe",
    visitStatus: "pending",
    contactName: "",
    contactPhone: "",
    notes: "",
    auditSummary: {
      hasWebsite: false,
      lowReviews: false,
      unclaimedProfile: false,
      hook: "Ferretería comercial consolidada en el centro pero sin catálogo digital ni lista de precios online."
    }
  }
];

window.STORAGE_KEYS = {
  PLACES: "geoprospector_places_v5",
  CONFIG: "geoprospector_config_v5",
  SAVED_SEARCHES: "geoprospector_searches_v5"
};

window.getStoredPlaces = function() {
  try {
    const raw = localStorage.getItem(window.STORAGE_KEYS.PLACES);
    if (!raw) {
      localStorage.setItem(window.STORAGE_KEYS.PLACES, JSON.stringify(window.DEFAULT_PLACES));
      return window.DEFAULT_PLACES;
    }
    const parsed = JSON.parse(raw);
    // Asegurar que si la base guardada tiene menos lugares o no tiene las nuevas categorías, se incorporen
    if (!Array.isArray(parsed) || parsed.length < window.DEFAULT_PLACES.length) {
      const merged = [...parsed];
      window.DEFAULT_PLACES.forEach(def => {
        if (!merged.some(m => m.id === def.id || m.name.toLowerCase() === def.name.toLowerCase())) {
          merged.push(def);
        }
      });
      localStorage.setItem(window.STORAGE_KEYS.PLACES, JSON.stringify(merged));
      return merged;
    }
    return parsed;
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
  const possibleKeys = [
    window.STORAGE_KEYS.CONFIG,
    "geoprospector_config_v5",
    "geoprospector_config_v4",
    "geoprospector_config_v3",
    "geoprospector_config_v2",
    "geoprospector_config",
    "google_maps_api_key"
  ];
  for (const k of possibleKeys) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        if (raw.startsWith('{')) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.googleMapsApiKey && parsed.googleMapsApiKey.trim().length > 5) {
            return parsed;
          }
        } else if (raw.trim().length > 10) {
          return {
            googleMapsApiKey: raw.trim(),
            defaultCity: "Santa Fe, Argentina",
            defaultCoords: { lat: -31.635, lng: -60.702 }
          };
        }
      }
    } catch (e) {}
  }
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
