// Base de datos y almacenamiento de GeoProspector
// Se inicializa vacía esperando búsquedas activas del usuario

window.DEFAULT_PLACES = [];

window.STORAGE_KEYS = {
  PLACES: "geoprospector_places_v6",
  CONFIG: "geoprospector_config_v5",
  SAVED_SEARCHES: "geoprospector_searches_v5"
};

window.getStoredPlaces = function() {
  try {
    const raw = localStorage.getItem(window.STORAGE_KEYS.PLACES);
    if (!raw) {
      // Migrar posibles prospectos guardados por el usuario desde v5 (excluyendo datos demo sf-)
      const oldRaw = localStorage.getItem("geoprospector_places_v5");
      if (oldRaw) {
        try {
          const oldParsed = JSON.parse(oldRaw);
          if (Array.isArray(oldParsed)) {
            const userSaved = oldParsed.filter(p => !p.id?.startsWith('sf-') || p.notes || p.contactName || (p.visitStatus && p.visitStatus !== 'pending'));
            if (userSaved.length > 0) {
              localStorage.setItem(window.STORAGE_KEYS.PLACES, JSON.stringify(userSaved));
              return userSaved;
            }
          }
        } catch (e) {}
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filtrar siempre elementos demo predefinidos si no tienen notas ni gestión comercial
    return parsed.filter(p => !p.id?.startsWith('sf-') || p.notes || p.contactName || (p.visitStatus && p.visitStatus !== 'pending'));
  } catch (e) {
    console.error("Error leyendo lugares de localStorage:", e);
    return [];
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
