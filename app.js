// GeoProspector - Lógica con Firebase Firestore, Google Authentication & Google Maps Platform (Modern)
// CRM de campo y gestión de prospección comercial en Santa Fe

import * as fb from './firebase-service.js';

(function() {
  let currentUser = null;
  let places = [];
  let savedSearches = [];
  let currentFilter = 'all'; // all, mechanical, dental, medical, aesthetic, hardware
  let currentStatusFilter = 'all'; // all, pending, interested, callback, closed, rejected
  let activeSearchQuery = '';
  let activeSavedSearchId = null;
  let activeSavedSearchName = '';
  
  let selectedPlace = null;
  let map = null; // Leaflet instance
  let markers = {}; // id -> Marker object
  let currentMapEngine = 'leaflet'; // 'leaflet' o 'google'
  let googleMapInstance = null;
  let userLocationMarker = null;

  // Iconos SVG y Colores según categoría
  const CATEGORY_COLORS = {
    mechanical: '#2563eb', // Azul automotor / mecánica
    dental: '#0284c7', // Celeste odontología
    medical: '#dc2626', // Rojo salud
    aesthetic: '#ec4899', // Rosa estética
    hardware: '#ea580c', // Naranja ferretería / industria
    general: '#475569' // Pizarra neutro
  };

  const CATEGORY_ICONS_SVG = {
    mechanical: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    dental: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    medical: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>`,
    aesthetic: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`,
    hardware: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`,
    general: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`
  };

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  window.addEventListener('DOMContentLoaded', async () => {
    places = window.getStoredPlaces();
    initUIEvents();
    initDrawerGestures();
    
    const config = window.getStoredConfig();
    if (config.googleMapsApiKey && config.googleMapsApiKey.trim().length > 10) {
      loadGoogleMapsAPI(config.googleMapsApiKey);
    } else {
      initLeafletMap(config.defaultCoords);
    }

    renderPlacesList();
    updateStatsCounter();

    // Conectar con Firebase Auth & Firestore
    try {
      await fb.initFirebase();
      updateSyncBadge(true, "Conectado a Firebase");

      fb.subscribeAuthState(async (user) => {
        currentUser = user;
        updateAuthHeaderUI(user);

        if (user) {
          updateSyncBadge(true, `Firebase (${user.displayName || user.email.split('@')[0]})`);
          await loadUserCloudData(user.uid);
        } else {
          updateSyncBadge(false, "Modo Local");
          places = window.getStoredPlaces();
          savedSearches = getStoredLocalSearches();
          updateSavedSearchesBadge();
          await renderCurrentMapMarkers();
          renderPlacesList();
          updateStatsCounter();
        }
      });
    } catch (err) {
      console.warn("Firebase initialization warning (fallback local):", err);
      updateSyncBadge(false, "Modo Local");
    }
  });

  // Carga de datos aislados del usuario desde Firebase Firestore
  async function loadUserCloudData(userId) {
    try {
      updateSyncBadge(true, "Sincronizando...", true);
      
      const cloudPlaces = await fb.fetchUserPlaces(userId);
      if (cloudPlaces && cloudPlaces.length > 0) {
        places = cloudPlaces;
      } else {
        // Primera vez del usuario en Firestore: inicializamos con la base de Santa Fe
        places = [...window.DEFAULT_PLACES];
        await fb.saveUserPlacesBatch(userId, places);
      }

      savedSearches = await fb.fetchUserSavedSearches(userId);

      const userSettings = await fb.fetchUserSettings(userId);
      if (userSettings && userSettings.googleMapsApiKey) {
        const localConfig = window.getStoredConfig();
        if (localConfig.googleMapsApiKey !== userSettings.googleMapsApiKey) {
          localConfig.googleMapsApiKey = userSettings.googleMapsApiKey;
          window.saveStoredConfig(localConfig);
        }
      }

      window.saveStoredPlaces(places);
      updateSyncBadge(true, `Sincronizado (${places.length} locales)`);
      updateSavedSearchesBadge();
      await renderCurrentMapMarkers();
      renderPlacesList();
      updateStatsCounter();
    } catch (err) {
      console.error("Error loading user cloud data:", err);
      updateSyncBadge(true, "Error de sincronización");
    }
  }

  function updateSyncBadge(isConnected, label, isSyncing = false) {
    const badge = document.getElementById('cloud-sync-badge');
    const labelEl = document.getElementById('cloud-sync-label');
    if (!badge || !labelEl) return;

    labelEl.innerText = label;
    if (isSyncing) {
      badge.className = "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200";
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span><span>${label}</span>`;
    } else if (isConnected) {
      badge.className = "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200";
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>${label}</span>`;
    } else {
      badge.className = "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200";
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span><span>${label}</span>`;
    }
  }

  // ==========================================
  // GOOGLE AUTHENTICATION UI
  // ==========================================
  function updateAuthHeaderUI(user) {
    const container = document.getElementById('auth-header-container');
    if (!container) return;

    if (user) {
      const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=2563eb&color=fff`;
      container.innerHTML = `
        <button onclick="window.openSettingsModal()" class="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs">
          <img src="${avatarUrl}" alt="${user.displayName || 'Usuario'}" class="w-6 h-6 rounded-lg object-cover">
          <span class="text-xs font-bold text-slate-800 hidden md:inline truncate max-w-[100px]">${user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0]}</span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button onclick="window.handleGoogleLogin()" id="btn-login-google" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span class="hidden sm:inline">Ingresar</span>
        </button>
      `;
    }
  }

  window.handleGoogleLogin = async function() {
    try {
      updateSyncBadge(true, "Conectando Google...", true);
      const user = await fb.loginWithGoogle();
      alert(`¡Bienvenido/a, ${user.displayName || user.email}! Tus prospectos y búsquedas se sincronizarán en Firebase.`);
    } catch (err) {
      console.error("Error en login Google:", err);
      updateSyncBadge(false, "Modo Local");
      alert("No se pudo iniciar sesión con Google: " + (err.message || "Intenta nuevamente."));
    }
  };

  window.handleGoogleLogout = async function() {
    if (confirm("¿Deseas cerrar tu sesión de Google?")) {
      try {
        await fb.logoutUser();
        window.closeSettingsModal();
        alert("Sesión cerrada. Ahora estás en modo local.");
      } catch (e) {
        console.error("Error cerrando sesión:", e);
      }
    }
  };

  // ==========================================
  // MAPA BASE RÁPIDO (LEAFLET)
  // ==========================================
  function initLeafletMap(coords) {
    currentMapEngine = 'leaflet';
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';

    map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      tap: true
    }).setView([coords.lat, coords.lng], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    renderLeafletMarkers();
  }

  function createCustomMarkerIcon(place) {
    const color = CATEGORY_COLORS[place.categoryType] || CATEGORY_COLORS.general;
    const iconSvg = CATEGORY_ICONS_SVG[place.categoryType] || CATEGORY_ICONS_SVG.general;

    let statusBadge = '';
    if (place.visitStatus === 'interested') {
      statusBadge = '<span class="absolute -top-1 -right-1 flex h-4 w-4"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span></span>';
    } else if (place.visitStatus === 'callback') {
      statusBadge = '<span class="absolute -top-1 -right-1 inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>';
    } else if (place.visitStatus === 'closed') {
      statusBadge = '<span class="absolute -top-1 -right-1 inline-flex rounded-full h-4 w-4 bg-purple-600 border-2 border-white"></span>';
    }

    const html = `
      <div class="relative group cursor-pointer transform transition-transform active:scale-95">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white" style="background-color: ${color}">
          ${iconSvg}
        </div>
        <div class="w-2.5 h-2.5 bg-white transform rotate-45 mx-auto -mt-1 shadow-md"></div>
        ${statusBadge}
      </div>
    `;

    return L.divIcon({
      html: html,
      className: 'custom-map-pin',
      iconSize: [40, 48],
      iconAnchor: [20, 44]
    });
  }

  function renderLeafletMarkers() {
    if (!map) return;
    Object.values(markers).forEach(m => {
      if (m.remove) m.remove();
    });
    markers = {};

    const filtered = getFilteredPlaces();

    filtered.forEach(place => {
      const icon = createCustomMarkerIcon(place);
      const marker = L.marker([place.lat, place.lng], { icon: icon }).addTo(map);

      marker.on('click', () => {
        openPlaceDrawer(place);
      });

      markers[place.id] = marker;
    });
  }

  // ==========================================
  // GOOGLE MAPS JS API (MODERNO: loading=async, MapId, AdvancedMarkerElement)
  // ==========================================
  function loadGoogleMapsAPI(apiKey) {
    if (window.google && window.google.maps) {
      initGoogleMap();
      return;
    }

    // Bootstrap loader moderno con loading=async y v=weekly para evitar warnings
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places,marker&loading=async&callback=onGoogleMapsLoaded`;
    script.async = true;
    script.defer = true;
    window.onGoogleMapsLoaded = initGoogleMap;
    document.head.appendChild(script);
  }

  async function initGoogleMap() {
    currentMapEngine = 'google';
    const config = window.getStoredConfig();
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';

    try {
      const { Map } = await google.maps.importLibrary("maps");

      googleMapInstance = new Map(mapContainer, {
        center: config.defaultCoords,
        zoom: 14,
        mapId: 'DEMO_MAP_ID', // Requerido para AdvancedMarkerElement
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: 'greedy'
      });

      await renderGoogleMarkers();

      const badge = document.getElementById('engine-badge');
      if (badge) {
        badge.innerHTML = `
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Google Places (New) En Vivo
          </span>
        `;
      }
    } catch (err) {
      console.warn("Fallo al inicializar Google Maps (usando Leaflet fallback):", err);
      initLeafletMap(config.defaultCoords);
    }
  }

  async function renderGoogleMarkers() {
    if (!googleMapInstance) return;

    // Limpiar marcadores previos
    Object.values(markers).forEach(m => {
      if (m.map) m.map = null;
      else if (m.setMap) m.setMap(null);
    });
    markers = {};

    const filtered = getFilteredPlaces();

    try {
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

      filtered.forEach(place => {
        const color = CATEGORY_COLORS[place.categoryType] || CATEGORY_COLORS.general;

        const pin = new PinElement({
          background: color,
          borderColor: '#ffffff',
          glyphColor: '#ffffff',
          scale: 1.05
        });

        const marker = new AdvancedMarkerElement({
          position: { lat: place.lat, lng: place.lng },
          map: googleMapInstance,
          title: place.name,
          content: pin
        });

        marker.addEventListener('gmp-click', () => {
          openPlaceDrawer(place);
        });

        markers[place.id] = marker;
      });
    } catch (e) {
      console.warn("AdvancedMarkerElement fallback:", e);
    }
  }

  async function renderCurrentMapMarkers() {
    if (currentMapEngine === 'google' && googleMapInstance) {
      await renderGoogleMarkers();
    } else if (map) {
      renderLeafletMarkers();
    }
  }

  // ==========================================
  // BÚSQUEDA GENERAL (GOOGLE PLACES API NEW O LOCAL)
  // ==========================================
  window.searchPlacesQuery = async function(query) {
    if (!query || query.trim().length === 0) {
      activeSearchQuery = '';
      hideActiveListBanner();
      await renderCurrentMapMarkers();
      renderPlacesList();
      return;
    }

    const cleanQuery = query.trim().toLowerCase();
    activeSearchQuery = cleanQuery;

    // Si Google Maps API está activo en vivo, usa Place.searchByText moderno
    if (googleMapInstance && window.google && window.google.maps) {
      await executeGooglePlacesSearch(cleanQuery);
    } else {
      activeSavedSearchId = null;
      activeSavedSearchName = '';
      showActiveListBanner(`Búsqueda: "${query.trim()}"`);
      await renderCurrentMapMarkers();
      renderPlacesList();
      updateStatsCounter();

      const matched = getFilteredPlaces();
      if (matched.length > 0) {
        centerMapOnCoord(matched[0].lat, matched[0].lng);
      }
    }
  };

  // Búsqueda moderna usando google.maps.places.Place.searchByText (Places API New)
  async function executeGooglePlacesSearch(query) {
    const searchBtn = document.getElementById('btn-search-places');
    const origHtml = searchBtn.innerHTML;
    searchBtn.innerHTML = `<span class="animate-spin inline-block">⏳</span>`;
    searchBtn.disabled = true;

    try {
      const center = googleMapInstance.getCenter();
      const { Place } = await google.maps.importLibrary("places");

      const request = {
        textQuery: query,
        fields: [
          'id', 
          'displayName', 
          'formattedAddress', 
          'location', 
          'rating', 
          'userRatingCount', 
          'types', 
          'regularOpeningHours', 
          'photos', 
          'websiteURI', 
          'nationalPhoneNumber', 
          'googleMapsURI'
        ],
        locationBias: center ? { lat: center.lat(), lng: center.lng() } : undefined,
        maxResultCount: 20
      };

      const { places: results } = await Place.searchByText(request);

      searchBtn.innerHTML = origHtml;
      searchBtn.disabled = false;

      if (results && results.length > 0) {
        let addedCount = 0;
        const newPlacesBatch = [];

        results.forEach(res => {
          const placeId = res.id;
          const placeName = typeof res.displayName === 'string' ? res.displayName : (res.displayName?.text || 'Comercio');

          if (!places.some(p => p.id === placeId || p.name.toLowerCase() === placeName.toLowerCase())) {
            let catType = 'general';
            const types = res.types || [];
            const nameLower = placeName.toLowerCase();
            const queryLower = query.toLowerCase();

            if (types.includes('car_repair') || types.includes('car_dealer') || queryLower.includes('mecanic') || queryLower.includes('taller') || nameLower.includes('taller') || nameLower.includes('mecanic')) {
              catType = 'mechanical';
            } else if (types.includes('dentist') || queryLower.includes('odont') || queryLower.includes('dent')) {
              catType = 'dental';
            } else if (types.includes('doctor') || types.includes('hospital') || types.includes('health') || queryLower.includes('medic') || queryLower.includes('sanatorio')) {
              catType = 'medical';
            } else if (types.includes('beauty_salon') || types.includes('spa') || types.includes('hair_care') || queryLower.includes('estet') || queryLower.includes('belleza')) {
              catType = 'aesthetic';
            } else if (types.includes('hardware_store') || queryLower.includes('ferret')) {
              catType = 'hardware';
            }

            let photoUrl = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80';
            if (res.photos && res.photos.length > 0) {
              try {
                photoUrl = res.photos[0].getURI({ maxWidth: 600, maxHeight: 400 });
              } catch (e) {}
            }

            let latVal = -31.635;
            let lngVal = -60.702;
            if (res.location) {
              latVal = typeof res.location.lat === 'function' ? res.location.lat() : res.location.lat;
              lngVal = typeof res.location.lng === 'function' ? res.location.lng() : res.location.lng;
            }

            const newPlace = {
              id: placeId || 'pl-' + Date.now() + Math.random().toString(36).substr(2, 4),
              name: placeName,
              category: types && types[0] ? types[0].replace(/_/g, ' ') : 'Comercio',
              categoryType: catType,
              address: res.formattedAddress || '',
              phone: res.nationalPhoneNumber || '',
              website: res.websiteURI || '',
              rating: res.rating || 0,
              reviewCount: res.userRatingCount || 0,
              openStatus: res.regularOpeningHours?.openNow ? 'Abierto ahora' : 'Consultar horarios',
              lat: latVal,
              lng: lngVal,
              photos: [photoUrl],
              googleMapsUrl: res.googleMapsURI || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
              visitStatus: 'pending',
              contactName: '',
              contactPhone: '',
              notes: '',
              auditSummary: {
                hasWebsite: !!(res.websiteURI && res.websiteURI.length > 3),
                lowReviews: (res.userRatingCount || 0) < 20,
                unclaimedProfile: false,
                hook: `Tiene ${res.userRatingCount || 0} reseñas en Google con ${res.rating || 'sin'} estrellas.`
              }
            };
            places.unshift(newPlace);
            newPlacesBatch.push(newPlace);
            addedCount++;
          }
        });

        if (currentUser && newPlacesBatch.length > 0) {
          fb.saveUserPlacesBatch(currentUser.uid, newPlacesBatch).catch(console.error);
        }
        window.saveStoredPlaces(places);

        showActiveListBanner(`Resultados de "${query}"`);
        await renderCurrentMapMarkers();
        renderPlacesList();
        updateStatsCounter();

        alert(`¡Listo! Se encontraron y agregaron ${addedCount} locales nuevos de "${query}" con Places API (New).`);
      } else {
        alert("Google Places (New) no encontró nuevos resultados para esa búsqueda en la zona.");
      }
    } catch (err) {
      console.error("Error en Google Places searchByText:", err);
      searchBtn.innerHTML = origHtml;
      searchBtn.disabled = false;
      alert("Error al buscar en Google Places: " + (err.message || "Verifica tu clave o conexión."));
    }
  }

  function centerMapOnCoord(lat, lng) {
    if (currentMapEngine === 'google' && googleMapInstance) {
      googleMapInstance.panTo({ lat, lng });
      googleMapInstance.setZoom(15);
    } else if (map) {
      map.setView([lat, lng], 15);
    }
  }

  // ==========================================
  // FILTRADO DE LUGARES
  // ==========================================
  function getFilteredPlaces() {
    return places.filter(p => {
      // 1. Filtro de Búsqueda Guardada Específica
      if (activeSavedSearchId) {
        const saved = savedSearches.find(s => s.id === activeSavedSearchId);
        if (saved && saved.placeIds && saved.placeIds.length > 0) {
          if (!saved.placeIds.includes(p.id)) return false;
        }
      }

      // 2. Filtro de Búsqueda por Texto
      if (activeSearchQuery && !activeSavedSearchId) {
        const q = activeSearchQuery.toLowerCase();
        const textToSearch = `${p.name} ${p.category} ${p.address} ${p.notes || ''} ${p.categoryType}`.toLowerCase();
        const matchesQuery = textToSearch.includes(q) || 
          (q.includes('taller') && (p.categoryType === 'mechanical' || textToSearch.includes('mecanic'))) ||
          (q.includes('mecanic') && p.categoryType === 'mechanical') ||
          (q.includes('dent') && p.categoryType === 'dental') ||
          (q.includes('medic') && p.categoryType === 'medical') ||
          (q.includes('estet') && p.categoryType === 'aesthetic') ||
          (q.includes('ferret') && p.categoryType === 'hardware');
        
        if (!matchesQuery) return false;
      }

      // 3. Filtro de Categoría (Chips)
      const matchesCategory = (currentFilter === 'all') || (p.categoryType === currentFilter);
      if (!matchesCategory) return false;

      // 4. Filtro de Estado de Visita
      let matchesStatus = true;
      if (currentStatusFilter === 'pending') {
        matchesStatus = p.visitStatus === 'pending';
      } else if (currentStatusFilter === 'interested') {
        matchesStatus = p.visitStatus === 'interested';
      } else if (currentStatusFilter === 'callback') {
        matchesStatus = p.visitStatus === 'callback';
      } else if (currentStatusFilter === 'closed') {
        matchesStatus = p.visitStatus === 'closed';
      } else if (currentStatusFilter === 'rejected') {
        matchesStatus = p.visitStatus === 'rejected';
      }

      return matchesStatus;
    });
  }

  function renderPlacesList() {
    const container = document.getElementById('places-list-container');
    const filtered = getFilteredPlaces();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 space-y-2">
          <p class="text-xs">No hay locales registrados para este filtro o búsqueda.</p>
          <button onclick="window.clearActiveListFilter()" class="text-xs font-semibold text-blue-600 underline">
            Restablecer filtros
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(place => {
      const color = CATEGORY_COLORS[place.categoryType] || '#475569';
      const statusBadge = getStatusBadgeHTML(place.visitStatus);
      const isOpportunity = (!place.website) || (place.reviewCount < 20);

      return `
        <div onclick="window.selectPlaceFromList('${place.id}')" 
             class="p-3.5 border-b border-slate-100 hover:bg-blue-50/60 active:bg-blue-100/60 cursor-pointer transition-colors flex items-start gap-3 select-none">
          <div class="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-xs mt-0.5" style="background-color: ${color}">
            ${CATEGORY_ICONS_SVG[place.categoryType] || CATEGORY_ICONS_SVG.general}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h4 class="font-bold text-slate-900 text-xs truncate">${place.name}</h4>
              ${statusBadge}
            </div>
            <p class="text-[11px] text-slate-500 truncate mt-0.5">${place.address}</p>
            <div class="flex items-center gap-2 mt-1.5 text-[11px]">
              <span class="flex items-center text-amber-500 font-semibold">
                ★ ${place.rating > 0 ? place.rating : 'N/A'} <span class="text-slate-400 font-normal ml-0.5">(${place.reviewCount})</span>
              </span>
              <span class="text-slate-300">•</span>
              <span class="text-slate-600 truncate">${place.category}</span>
              ${isOpportunity ? '<span class="ml-auto text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Oportunidad</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function getStatusBadgeHTML(status) {
    switch (status) {
      case 'interested':
        return '<span class="text-[10px] px-2 py-0.5 font-bold rounded-full bg-emerald-100 text-emerald-800">Interesado</span>';
      case 'callback':
        return '<span class="text-[10px] px-2 py-0.5 font-bold rounded-full bg-amber-100 text-amber-800">Volver</span>';
      case 'rejected':
        return '<span class="text-[10px] px-2 py-0.5 font-medium rounded-full bg-slate-100 text-slate-600">No le interesa</span>';
      case 'closed':
        return '<span class="text-[10px] px-2 py-0.5 font-bold rounded-full bg-purple-100 text-purple-800">Cerrado 🎉</span>';
      default:
        return '<span class="text-[10px] px-2 py-0.5 font-medium rounded-full bg-slate-100 text-slate-500">Pendiente</span>';
    }
  }

  // ==========================================
  // GESTIÓN DE BÚSQUEDAS Y LISTAS GUARDADAS
  // ==========================================
  function showActiveListBanner(title) {
    const banner = document.getElementById('active-list-banner');
    const titleEl = document.getElementById('active-list-title');
    const countEl = document.getElementById('active-list-count');
    if (!banner || !titleEl || !countEl) return;

    const count = getFilteredPlaces().length;
    titleEl.innerText = title;
    countEl.innerText = count;
    banner.classList.remove('hidden');
  }

  function hideActiveListBanner() {
    const banner = document.getElementById('active-list-banner');
    if (banner) banner.classList.add('hidden');
  }

  window.clearActiveListFilter = async function() {
    activeSavedSearchId = null;
    activeSavedSearchName = '';
    activeSearchQuery = '';
    currentFilter = 'all';

    const searchInput = document.getElementById('search-query-input');
    if (searchInput) searchInput.value = '';

    document.querySelectorAll('.filter-chip').forEach(chip => {
      if (chip.dataset.category === 'all') {
        chip.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        chip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      } else {
        chip.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
        chip.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      }
    });

    hideActiveListBanner();
    await renderCurrentMapMarkers();
    renderPlacesList();
    updateStatsCounter();
  };

  window.promptSaveCurrentSearch = function() {
    const filtered = getFilteredPlaces();
    if (filtered.length === 0) {
      alert("No hay locales en la vista actual para guardar.");
      return;
    }

    const dialog = document.getElementById('save-search-dialog');
    const nameInput = document.getElementById('save-search-name-input');
    const queryPreview = document.getElementById('save-search-query-preview');
    const countPreview = document.getElementById('save-search-count-preview');

    let defaultName = "Lista de Prospectos";
    if (activeSearchQuery) {
      defaultName = capitalizeText(activeSearchQuery);
    } else if (currentFilter !== 'all') {
      const categoryNames = {
        mechanical: 'Talleres Mecánicos',
        dental: 'Consultorios Odontológicos',
        medical: 'Centros Médicos & Sanatorios',
        aesthetic: 'Centros de Estética',
        hardware: 'Ferreterías & Afines'
      };
      defaultName = categoryNames[currentFilter] || capitalizeText(currentFilter);
    }

    nameInput.value = defaultName;
    queryPreview.innerText = activeSearchQuery || (currentFilter !== 'all' ? `Categoría: ${currentFilter}` : 'Todos los locales visibles');
    countPreview.innerText = filtered.length;

    dialog.classList.remove('hidden');
    nameInput.focus();
  };

  window.closeSaveSearchDialog = function() {
    document.getElementById('save-search-dialog').classList.add('hidden');
  };

  window.confirmSaveSearch = async function() {
    const nameInput = document.getElementById('save-search-name-input');
    const name = (nameInput.value || '').trim();
    if (!name) {
      alert("Por favor ingresa un nombre para la lista.");
      return;
    }

    const filtered = getFilteredPlaces();
    const placeIds = filtered.map(p => p.id);

    const newSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name,
      query: activeSearchQuery || currentFilter,
      category: currentFilter,
      placeIds: placeIds,
      placesCount: placeIds.length,
      createdAt: Date.now()
    };

    if (currentUser) {
      try {
        await fb.saveUserSearch(currentUser.uid, newSearch);
      } catch (err) {
        console.error("Error guardando búsqueda en Firestore:", err);
      }
    }

    savedSearches.unshift(newSearch);
    saveStoredLocalSearches(savedSearches);
    updateSavedSearchesBadge();
    window.closeSaveSearchDialog();

    alert(`🎉 ¡Lista "${name}" guardada con éxito en tu cuenta de Firebase! Puedes acceder a ella en cualquier momento desde el botón "Mis Listas".`);
  };

  window.openSavedSearchesModal = function() {
    renderSavedSearchesList();
    document.getElementById('saved-searches-modal').classList.remove('hidden');
  };

  window.closeSavedSearchesModal = function() {
    document.getElementById('saved-searches-modal').classList.add('hidden');
  };

  function renderSavedSearchesList() {
    const container = document.getElementById('saved-searches-list-container');
    if (!container) return;

    if (savedSearches.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400 space-y-2">
          <div class="text-3xl">📁</div>
          <p class="font-semibold text-slate-600">No tienes listas guardadas aún.</p>
          <p class="text-[11px] text-slate-400 max-w-xs mx-auto">Realiza una búsqueda (ej: "talleres mecánicos", "odontología") y pulsa "Guardar Lista" para tener acceso rápido.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = savedSearches.map(item => {
      const dateStr = new Date(item.createdAt || Date.now()).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                ⭐
              </span>
              <div class="truncate">
                <h4 class="font-bold text-slate-900 text-xs truncate">${item.name}</h4>
                <p class="text-[10px] text-slate-500 truncate">Creada: ${dateStr}</p>
              </div>
            </div>
            <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full flex-shrink-0">
              ${item.placesCount || (item.placeIds ? item.placeIds.length : 0)} locales
            </span>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 text-xs">
            <button onclick="window.deleteSavedSearchItem('${item.id}')" class="text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg active:bg-rose-50 text-[11px]">
              Eliminar
            </button>
            <button onclick="window.exportSingleSearchToCSV('${item.id}')" class="text-emerald-700 font-bold px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px]">
              Excel
            </button>
            <button onclick="window.applySavedSearchFilter('${item.id}')" class="bg-blue-600 active:bg-blue-700 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg shadow-2xs text-[11px]">
              Ver en Mapa &rarr;
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.applySavedSearchFilter = async function(searchId) {
    const search = savedSearches.find(s => s.id === searchId);
    if (!search) return;

    activeSavedSearchId = search.id;
    activeSavedSearchName = search.name;
    activeSearchQuery = '';

    window.closeSavedSearchesModal();
    showActiveListBanner(`Lista: "${search.name}"`);

    await renderCurrentMapMarkers();
    renderPlacesList();
    updateStatsCounter();

    const filtered = getFilteredPlaces();
    if (filtered.length > 0) {
      centerMapOnCoord(filtered[0].lat, filtered[0].lng);
    }
  };

  window.deleteSavedSearchItem = async function(searchId) {
    if (!confirm("¿Deseas eliminar esta lista guardada?")) return;

    if (currentUser) {
      try {
        await fb.deleteUserSearch(currentUser.uid, searchId);
      } catch (err) {
        console.error("Error eliminando búsqueda de Firestore:", err);
      }
    }

    savedSearches = savedSearches.filter(s => s.id !== searchId);
    saveStoredLocalSearches(savedSearches);
    updateSavedSearchesBadge();
    renderSavedSearchesList();

    if (activeSavedSearchId === searchId) {
      await window.clearActiveListFilter();
    }
  };

  function updateSavedSearchesBadge() {
    const badge = document.getElementById('saved-searches-count-badge');
    if (badge) {
      badge.innerText = savedSearches.length;
    }
  }

  function getStoredLocalSearches() {
    try {
      const raw = localStorage.getItem(window.STORAGE_KEYS.SAVED_SEARCHES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function saveStoredLocalSearches(searches) {
    try {
      localStorage.setItem(window.STORAGE_KEYS.SAVED_SEARCHES, JSON.stringify(searches));
    } catch (e) {}
  }

  function capitalizeText(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ==========================================
  // SELECCIÓN Y DRAWER DE DETALLE / CRM
  // ==========================================
  window.selectPlaceFromList = function(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;

    const listView = document.getElementById('places-list-panel');
    const mapView = document.getElementById('map-panel');
    const btnToggle = document.getElementById('btn-toggle-view');

    if (!listView.classList.contains('hidden') && window.innerWidth < 768) {
      listView.classList.add('hidden');
      mapView.classList.remove('hidden');
      if (btnToggle) btnToggle.innerHTML = `<span>Lista</span>`;
    }

    centerMapOnCoord(place.lat, place.lng);
    openPlaceDrawer(place);
  };

  function openPlaceDrawer(place) {
    selectedPlace = place;
    const drawer = document.getElementById('place-drawer');
    drawer.classList.remove('translate-y-full', 'pointer-events-none', 'opacity-0');
    drawer.classList.add('translate-y-0', 'opacity-100');

    document.getElementById('drawer-title').innerText = place.name;
    document.getElementById('drawer-category').innerText = place.category;
    document.getElementById('drawer-address-text').innerText = place.address;
    document.getElementById('drawer-rating-num').innerText = place.rating > 0 ? place.rating : 'N/A';
    document.getElementById('drawer-reviews-count').innerText = `(${place.reviewCount})`;
    document.getElementById('drawer-open-status').innerText = place.openStatus || 'Consultar';

    const photoImg = document.getElementById('drawer-photo');
    if (place.photos && place.photos.length > 0) {
      photoImg.src = place.photos[0];
      photoImg.classList.remove('hidden');
    } else {
      photoImg.classList.add('hidden');
    }

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    document.getElementById('drawer-btn-directions').href = directionsUrl;
    document.getElementById('drawer-btn-gmaps').href = place.googleMapsUrl || directionsUrl;

    const btnWeb = document.getElementById('drawer-btn-web');
    if (place.website && place.website.trim().length > 3) {
      btnWeb.href = place.website;
      btnWeb.classList.remove('opacity-40', 'pointer-events-none');
      btnWeb.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg> Sitio web`;
    } else {
      btnWeb.href = "#";
      btnWeb.classList.add('opacity-40', 'pointer-events-none');
      btnWeb.innerHTML = `<span class="line-through text-slate-400">Sin web</span>`;
    }

    const btnCall = document.getElementById('drawer-btn-call');
    if (place.phone) {
      btnCall.href = `tel:${place.phone.replace(/[^0-9+]/g, '')}`;
      btnCall.classList.remove('hidden');
    } else {
      btnCall.classList.add('hidden');
    }

    const btnWhatsapp = document.getElementById('drawer-btn-whatsapp');
    if (place.phone) {
      let rawPhone = place.phone.replace(/[^0-9]/g, '');
      if (rawPhone.startsWith('54') && !rawPhone.startsWith('549')) {
        rawPhone = '549' + rawPhone.slice(2);
      } else if (!rawPhone.startsWith('54')) {
        rawPhone = '549' + rawPhone;
      }
      const msg = encodeURIComponent(`Hola ${place.name}, nos comunicamos para acercarles una propuesta de posicionamiento en Google Maps y captación de clientes.`);
      btnWhatsapp.href = `https://wa.me/${rawPhone}?text=${msg}`;
      btnWhatsapp.classList.remove('hidden');
    } else {
      btnWhatsapp.classList.add('hidden');
    }

    renderOpportunityAudit(place);

    document.getElementById('visit-status-select').value = place.visitStatus || 'pending';
    document.getElementById('visit-contact-name').value = place.contactName || '';
    document.getElementById('visit-contact-phone').value = place.contactPhone || '';
    document.getElementById('visit-notes').value = place.notes || '';
  }

  function renderOpportunityAudit(place) {
    const auditContainer = document.getElementById('drawer-audit-container');
    const hasWeb = place.website && place.website.length > 3;
    const isLowReviews = place.reviewCount < 20;

    auditContainer.innerHTML = `
      <div class="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-2">
        <div class="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Auditoría de Oportunidad para la Venta:
        </div>
        <div class="grid grid-cols-2 gap-2 pt-0.5">
          <div class="p-2 rounded-xl bg-white/80 border border-amber-100 flex items-center gap-1.5 ${hasWeb ? 'text-emerald-700' : 'text-rose-700 font-bold'}">
            ${hasWeb ? '✓ Web cargada' : '✗ NO TIENE SITIO WEB'}
          </div>
          <div class="p-2 rounded-xl bg-white/80 border border-amber-100 flex items-center gap-1.5 ${isLowReviews ? 'text-amber-800 font-bold' : 'text-emerald-700'}">
            ${isLowReviews ? `⚠️ Pocas reseñas (${place.reviewCount})` : `✓ ${place.reviewCount} reseñas`}
          </div>
        </div>
        <p class="text-slate-700 text-[11px] leading-relaxed border-t border-amber-200/80 pt-2 font-medium">
          ${place.auditSummary?.hook || 'Negocio con alta afluencia pero potencial de conversión desaprovechado.'}
        </p>
      </div>
    `;
  }

  window.closePlaceDrawer = function() {
    const drawer = document.getElementById('place-drawer');
    drawer.classList.remove('translate-y-0', 'opacity-100');
    drawer.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
    selectedPlace = null;
  };

  function initDrawerGestures() {
    const drawer = document.getElementById('place-drawer');
    let startY = 0;
    let currentY = 0;

    drawer.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      if (diff > 0 && drawer.scrollTop === 0) {
        drawer.style.transform = `translateY(${diff}px)`;
      }
    }, { passive: true });

    drawer.addEventListener('touchend', () => {
      const diff = currentY - startY;
      drawer.style.transform = '';
      if (diff > 120) {
        window.closePlaceDrawer();
      }
      startY = 0;
      currentY = 0;
    });
  }

  // ==========================================
  // CRM: GUARDAR VISITA (FIREBASE CLOUD)
  // ==========================================
  window.saveCurrentVisit = async function() {
    if (!selectedPlace) return;

    selectedPlace.visitStatus = document.getElementById('visit-status-select').value;
    selectedPlace.contactName = document.getElementById('visit-contact-name').value;
    selectedPlace.contactPhone = document.getElementById('visit-contact-phone').value;
    selectedPlace.notes = document.getElementById('visit-notes').value;

    if (currentUser) {
      try {
        await fb.saveUserPlace(currentUser.uid, selectedPlace);
      } catch (err) {
        console.error("Error guardando visita en Firestore:", err);
      }
    }

    window.saveStoredPlaces(places);
    await renderCurrentMapMarkers();
    renderPlacesList();
    updateStatsCounter();

    const saveBtn = document.getElementById('btn-save-visit');
    const orig = saveBtn.innerText;
    saveBtn.innerText = "✓ ¡Guardado en Firebase!";
    saveBtn.classList.remove('bg-blue-600');
    saveBtn.classList.add('bg-emerald-600');
    setTimeout(() => {
      saveBtn.innerText = orig;
      saveBtn.classList.remove('bg-emerald-600');
      saveBtn.classList.add('bg-blue-600');
    }, 1600);
  };

  function updateStatsCounter() {
    const total = places.length;
    const interested = places.filter(p => p.visitStatus === 'interested').length;
    const closed = places.filter(p => p.visitStatus === 'closed').length;

    const el = document.getElementById('stats-summary');
    if (el) {
      el.innerText = `${total} locales | ${interested} interesados | ${closed} cerrados`;
    }
  }

  // ==========================================
  // GPS EN VIVO (ANDROID / CHROME)
  // ==========================================
  window.locateUserPosition = function() {
    if (!navigator.geolocation) {
      alert("Geolocalización no disponible en este dispositivo.");
      return;
    }

    const btn = document.getElementById('btn-gps');
    btn.classList.add('animate-pulse', 'text-blue-600');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        btn.classList.remove('animate-pulse', 'text-blue-600');
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (currentMapEngine === 'google' && googleMapInstance) {
          googleMapInstance.panTo({ lat: userLat, lng: userLng });
          googleMapInstance.setZoom(16);

          try {
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
            if (!userLocationMarker) {
              const userPin = new PinElement({
                background: '#2563eb',
                borderColor: '#ffffff',
                glyphColor: '#ffffff',
                scale: 0.9
              });
              userLocationMarker = new AdvancedMarkerElement({
                position: { lat: userLat, lng: userLng },
                map: googleMapInstance,
                title: "Estás aquí",
                content: userPin
              });
            } else {
              userLocationMarker.position = { lat: userLat, lng: userLng };
            }
          } catch (e) {}
        } else if (map) {
          map.setView([userLat, userLng], 16);

          if (!userLocationMarker) {
            const gpsIcon = L.divIcon({
              html: `<div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xl animate-ping"></div>`,
              className: 'gps-dot',
              iconSize: [20, 20]
            });
            userLocationMarker = L.marker([userLat, userLng], { icon: gpsIcon }).addTo(map);
          } else {
            userLocationMarker.setLatLng([userLat, userLng]);
          }
        }
      },
      (err) => {
        btn.classList.remove('animate-pulse', 'text-blue-600');
        alert("Para usar el GPS, activa la ubicación en tu dispositivo.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==========================================
  // EVENTOS DE INTERFAZ & CHIPS
  // ==========================================
  function initUIEvents() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
          c.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
        });
        chip.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        chip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

        currentFilter = chip.dataset.category;
        activeSavedSearchId = null;
        activeSavedSearchName = '';
        activeSearchQuery = '';

        if (currentFilter !== 'all') {
          showActiveListBanner(`Categoría: ${chip.innerText.trim()}`);
        } else {
          hideActiveListBanner();
        }

        await renderCurrentMapMarkers();
        renderPlacesList();
        updateStatsCounter();
      });
    });

    const statusSelect = document.getElementById('filter-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        currentStatusFilter = e.target.value;
        await renderCurrentMapMarkers();
        renderPlacesList();
      });
    }

    const btnToggleView = document.getElementById('btn-toggle-view');
    const listView = document.getElementById('places-list-panel');
    const mapView = document.getElementById('map-panel');

    if (btnToggleView) {
      btnToggleView.addEventListener('click', () => {
        if (listView.classList.contains('hidden')) {
          listView.classList.remove('hidden');
          mapView.classList.add('hidden');
          btnToggleView.innerHTML = `<span>Mapa</span>`;
        } else {
          listView.classList.add('hidden');
          mapView.classList.remove('hidden');
          btnToggleView.innerHTML = `<span>Lista</span>`;
          if (map) map.invalidateSize();
        }
      });
    }

    const searchInput = document.getElementById('search-query-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.searchPlacesQuery(searchInput.value.trim());
        }
      });
    }
  }

  // ==========================================
  // CONFIGURACIÓN & MODAL DE AJUSTES
  // ==========================================
  window.openSettingsModal = function() {
    const config = window.getStoredConfig();
    document.getElementById('input-google-key').value = config.googleMapsApiKey || '';

    const profileSection = document.getElementById('user-profile-section');
    if (profileSection) {
      if (currentUser) {
        profileSection.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img src="${currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || currentUser.email)}&background=2563eb&color=fff`}" 
                   class="w-10 h-10 rounded-xl object-cover border border-slate-200">
              <div>
                <h4 class="font-bold text-slate-900 text-xs">${currentUser.displayName || 'Usuario Google'}</h4>
                <p class="text-[11px] text-slate-500">${currentUser.email}</p>
                <span class="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Datos aislados en Firestore (Capa Gratuita)
                </span>
              </div>
            </div>
            <button onclick="window.handleGoogleLogout()" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-[11px] transition-colors">
              Cerrar Sesión
            </button>
          </div>
        `;
      } else {
        profileSection.innerHTML = `
          <div class="space-y-2">
            <div class="font-bold text-slate-900 text-xs flex items-center justify-between">
              <span>Sincronización en la Nube:</span>
              <span class="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-semibold">Modo Invitado / Local</span>
            </div>
            <p class="text-[11px] text-slate-500 leading-relaxed">
              Inicia sesión con Google para guardar tus prospectos, notas de visitas y listas de búsqueda en Firebase Firestore y acceder desde cualquier celular o PC.
            </p>
            <button onclick="window.handleGoogleLogin()" class="w-full py-2.5 bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Conectar con Google Auth
            </button>
          </div>
        `;
      }
    }

    document.getElementById('settings-modal').classList.remove('hidden');
  };

  window.closeSettingsModal = function() {
    document.getElementById('settings-modal').classList.add('hidden');
  };

  window.saveSettings = async function() {
    const googleKey = document.getElementById('input-google-key').value.trim();
    const currentCfg = window.getStoredConfig();
    
    const newCfg = {
      ...currentCfg,
      googleMapsApiKey: googleKey
    };

    window.saveStoredConfig(newCfg);

    if (currentUser) {
      await fb.saveUserSettings(currentUser.uid, { googleMapsApiKey: googleKey });
    }

    closeSettingsModal();

    if (googleKey && googleKey !== currentCfg.googleMapsApiKey) {
      if (confirm("Se guardó tu Google Maps API Key. ¿Deseas recargar la app para activar el motor de Google Maps en vivo?")) {
        window.location.reload();
      }
    } else {
      alert("Ajustes guardados correctamente.");
    }
  };

  // ==========================================
  // EXPORTACIÓN A CSV / EXCEL
  // ==========================================
  window.exportLeadsToCSV = function() {
    exportPlacesListToCSV(places, `prospeccion_santa_fe_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  window.exportSingleSearchToCSV = function(searchId) {
    const search = savedSearches.find(s => s.id === searchId);
    if (!search) return;

    const listPlaces = places.filter(p => search.placeIds && search.placeIds.includes(p.id));
    const safeName = search.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    exportPlacesListToCSV(listPlaces, `lista_${safeName}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  function exportPlacesListToCSV(placesToExport, fileName) {
    if (!placesToExport || placesToExport.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ["Nombre", "Rubro", "Dirección", "Teléfono", "Web", "Calificación", "Reseñas", "Estado Visita", "Contacto", "Notas"];
    const rows = placesToExport.map(p => [
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.address || '').replace(/"/g, '""')}"`,
      `"${(p.phone || '').replace(/"/g, '""')}"`,
      `"${(p.website || '').replace(/"/g, '""')}"`,
      p.rating || 0,
      p.reviewCount || 0,
      `"${p.visitStatus || 'pending'}"`,
      `"${(p.contactName || '').replace(/"/g, '""')}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  // Restablecer base inicial
  window.resetToDefaultPlaces = async function() {
    if (confirm("¿Deseas restablecer los locales a la lista inicial de Santa Fe? Esto sobreescribirá tus notas actuales.")) {
      places = [...window.DEFAULT_PLACES];
      if (currentUser) {
        await fb.saveUserPlacesBatch(currentUser.uid, places);
      }
      window.saveStoredPlaces(places);
      await renderCurrentMapMarkers();
      renderPlacesList();
      updateStatsCounter();
      alert("Base restablecida con éxito.");
    }
  };

})();
