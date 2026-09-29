// GeoProspector - Lógica Optimizada para Android Chrome & Vercel
// Conexión nativa con Google Maps JavaScript API + Places API
// CRM de campo para prospección comercial en Santa Fe

(function() {
  let places = [];
  let currentFilter = 'all'; // all, dental, medical, aesthetic, hardware
  let currentStatusFilter = 'all'; // all, pending, interested, closed
  let selectedPlace = null;
  let map = null;
  let markers = {};
  let currentMapEngine = 'leaflet'; // 'leaflet' o 'google'
  let googleMapInstance = null;
  let googlePlacesService = null;
  let userLocationMarker = null;

  // Iconos SVG para Leaflet según categoría
  const CATEGORY_COLORS = {
    dental: '#0284c7', // Celeste / Azul odontología
    medical: '#dc2626', // Rojo salud
    aesthetic: '#ec4899', // Rosa estética
    hardware: '#ea580c', // Naranja ferretería / industria
    general: '#475569' // Pizarra neutro
  };

  const CATEGORY_ICONS_SVG = {
    dental: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
    medical: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>`,
    aesthetic: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`,
    hardware: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>`,
    general: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`
  };

  // Inicialización
  window.addEventListener('DOMContentLoaded', () => {
    places = window.getStoredPlaces();
    initSettingsUI();
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
  });

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
    Object.values(markers).forEach(m => m.remove());
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
  // GOOGLE MAPS JS API + PLACES
  // ==========================================
  function loadGoogleMapsAPI(apiKey) {
    if (window.google && window.google.maps) {
      initGoogleMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=onGoogleMapsLoaded`;
    script.async = true;
    script.defer = true;
    window.onGoogleMapsLoaded = initGoogleMap;
    document.head.appendChild(script);
  }

  function initGoogleMap() {
    currentMapEngine = 'google';
    const config = window.getStoredConfig();
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = '';

    googleMapInstance = new google.maps.Map(mapContainer, {
      center: config.defaultCoords,
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      gestureHandling: 'greedy' // Ideal para pantallas táctiles de Android
    });

    googlePlacesService = new google.maps.places.PlacesService(googleMapInstance);

    renderGoogleMarkers();

    // Actualizar indicador visual
    const badge = document.getElementById('engine-badge');
    if (badge) {
      badge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Google Places En Vivo
        </span>
      `;
    }
  }

  function renderGoogleMarkers() {
    Object.values(markers).forEach(m => m.setMap(null));
    markers = {};

    const filtered = getFilteredPlaces();

    filtered.forEach(place => {
      const color = CATEGORY_COLORS[place.categoryType] || CATEGORY_COLORS.general;

      const marker = new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: googleMapInstance,
        title: place.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2.5
        }
      });

      marker.addListener('click', () => {
        openPlaceDrawer(place);
      });

      markers[place.id] = marker;
    });
  }

  // ==========================================
  // BUSCADOR EN VIVO DE GOOGLE PLACES
  // ==========================================
  window.searchGooglePlacesInZone = function(query) {
    if (!query || query.trim().length === 0) return;

    if (!googlePlacesService || !googleMapInstance) {
      alert("Para buscar en vivo con Google Places necesitas configurar tu Google API Key en Ajustes (⚙️). Mientras tanto puedes explorar los locales ya guardados en Santa Fe.");
      openSettingsModal();
      return;
    }

    const center = googleMapInstance.getCenter();
    const request = {
      location: center,
      radius: 3000,
      query: query
    };

    const searchBtn = document.getElementById('btn-search-places');
    const origHtml = searchBtn.innerHTML;
    searchBtn.innerHTML = `<span class="animate-spin inline-block">⏳</span>`;
    searchBtn.disabled = true;

    googlePlacesService.textSearch(request, (results, status) => {
      searchBtn.innerHTML = origHtml;
      searchBtn.disabled = false;

      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        let addedCount = 0;

        results.forEach(res => {
          if (!places.some(p => p.id === res.place_id || p.name.toLowerCase() === res.name.toLowerCase())) {
            let catType = 'general';
            const types = res.types || [];
            if (types.includes('dentist')) catType = 'dental';
            else if (types.includes('doctor') || types.includes('hospital') || types.includes('health')) catType = 'medical';
            else if (types.includes('beauty_salon') || types.includes('spa') || types.includes('hair_care')) catType = 'aesthetic';
            else if (types.includes('hardware_store') || query.toLowerCase().includes('ferreter')) catType = 'hardware';

            const photoUrl = res.photos && res.photos.length > 0 
              ? res.photos[0].getUrl({ maxWidth: 600, maxHeight: 400 })
              : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80';

            const newPlace = {
              id: res.place_id || 'pl-' + Date.now() + Math.random().toString(36).substr(2, 4),
              name: res.name,
              category: res.types ? res.types[0].replace(/_/g, ' ') : 'Comercio',
              categoryType: catType,
              address: res.formatted_address || '',
              phone: '',
              website: '',
              rating: res.rating || 0,
              reviewCount: res.user_ratings_total || 0,
              openStatus: res.opening_hours?.isOpen?.() ? 'Abierto ahora' : 'Consultar horarios',
              lat: res.geometry.location.lat(),
              lng: res.geometry.location.lng(),
              photos: [photoUrl],
              googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${res.place_id}`,
              visitStatus: 'pending',
              contactName: '',
              contactPhone: '',
              notes: '',
              auditSummary: {
                hasWebsite: false,
                lowReviews: (res.user_ratings_total || 0) < 20,
                unclaimedProfile: false,
                hook: `Tiene ${res.user_ratings_total || 0} reseñas en Google con ${res.rating || 'sin'} estrellas.`
              }
            };
            places.unshift(newPlace);
            addedCount++;
          }
        });

        window.saveStoredPlaces(places);
        renderCurrentMapMarkers();
        renderPlacesList();
        updateStatsCounter();

        // Feedback al usuario
        alert(`¡Listo! Se agregaron ${addedCount} locales de "${query}" a tu mapa.`);
      } else {
        alert("Google Places no encontró resultados para esa búsqueda en la zona visible.");
      }
    });
  };

  function renderCurrentMapMarkers() {
    if (currentMapEngine === 'google' && googleMapInstance) {
      renderGoogleMarkers();
    } else if (map) {
      renderLeafletMarkers();
    }
  }

  // ==========================================
  // FILTRADO Y LISTA LATERAL
  // ==========================================
  function getFilteredPlaces() {
    return places.filter(p => {
      const matchesCategory = (currentFilter === 'all') || (p.categoryType === currentFilter);
      let matchesStatus = true;
      if (currentStatusFilter === 'pending') {
        matchesStatus = p.visitStatus === 'pending';
      } else if (currentStatusFilter === 'interested') {
        matchesStatus = p.visitStatus === 'interested';
      } else if (currentStatusFilter === 'closed') {
        matchesStatus = p.visitStatus === 'closed';
      }
      return matchesCategory && matchesStatus;
    });
  }

  function renderPlacesList() {
    const container = document.getElementById('places-list-container');
    const filtered = getFilteredPlaces();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <p class="text-xs">No hay locales registrados para este filtro.</p>
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

  window.selectPlaceFromList = function(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;

    // Si estamos en móvil y viendo la lista, regresar al mapa
    const listView = document.getElementById('places-list-panel');
    const mapView = document.getElementById('map-panel');
    const btnToggle = document.getElementById('btn-toggle-view');

    if (!listView.classList.contains('hidden') && window.innerWidth < 768) {
      listView.classList.add('hidden');
      mapView.classList.remove('hidden');
      if (btnToggle) btnToggle.innerHTML = `<span>Lista</span>`;
    }

    // Centrar mapa
    if (currentMapEngine === 'google' && googleMapInstance) {
      googleMapInstance.panTo({ lat: place.lat, lng: place.lng });
      googleMapInstance.setZoom(16);
    } else if (map) {
      map.setView([place.lat, place.lng], 16);
    }

    openPlaceDrawer(place);
  };

  // ==========================================
  // FICHA ESTILO GOOGLE BUSINESS (DRAWER)
  // ==========================================
  function openPlaceDrawer(place) {
    selectedPlace = place;
    const drawer = document.getElementById('place-drawer');
    drawer.classList.remove('translate-y-full', 'pointer-events-none', 'opacity-0');
    drawer.classList.add('translate-y-0', 'opacity-100');

    // Título y categoría
    document.getElementById('drawer-title').innerText = place.name;
    document.getElementById('drawer-category').innerText = place.category;
    document.getElementById('drawer-address').innerText = place.address;
    document.getElementById('drawer-rating-num').innerText = place.rating > 0 ? place.rating : 'N/A';
    document.getElementById('drawer-reviews-count').innerText = `(${place.reviewCount})`;
    document.getElementById('drawer-open-status').innerText = place.openStatus || 'Consultar';

    // Foto
    const photoImg = document.getElementById('drawer-photo');
    if (place.photos && place.photos.length > 0) {
      photoImg.src = place.photos[0];
      photoImg.classList.remove('hidden');
    } else {
      photoImg.classList.add('hidden');
    }

    // Botones de acción Android
    const btnDirections = document.getElementById('drawer-btn-directions');
    // Enlace universal compatible con Android Google Maps App
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    btnDirections.href = directionsUrl;

    const btnGmaps = document.getElementById('drawer-btn-gmaps');
    btnGmaps.href = place.googleMapsUrl || directionsUrl;

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

    // WhatsApp para Argentina (+54 9 ...)
    const btnWhatsapp = document.getElementById('drawer-btn-whatsapp');
    if (place.phone) {
      let rawPhone = place.phone.replace(/[^0-9]/g, '');
      if (rawPhone.startsWith('54') && !rawPhone.startsWith('549')) {
        rawPhone = '549' + rawPhone.slice(2);
      } else if (!rawPhone.startsWith('54')) {
        rawPhone = '549' + rawPhone;
      }
      const msg = encodeURIComponent(`Hola ${place.name}, nos comunicamos para acercarles una propuesta de optimización de su presencia en Google Maps y captación de clientes.`);
      btnWhatsapp.href = `https://wa.me/${rawPhone}?text=${msg}`;
      btnWhatsapp.classList.remove('hidden');
    } else {
      btnWhatsapp.classList.add('hidden');
    }

    // Auditoría de Oportunidad Google
    renderOpportunityAudit(place);

    // CRM / Formulario de Visita
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

  // Gesto táctil deslizar hacia abajo para cerrar en Android
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
  // CRM: GUARDAR VISITA
  // ==========================================
  window.saveCurrentVisit = function() {
    if (!selectedPlace) return;

    selectedPlace.visitStatus = document.getElementById('visit-status-select').value;
    selectedPlace.contactName = document.getElementById('visit-contact-name').value;
    selectedPlace.contactPhone = document.getElementById('visit-contact-phone').value;
    selectedPlace.notes = document.getElementById('visit-notes').value;

    window.saveStoredPlaces(places);
    renderCurrentMapMarkers();
    renderPlacesList();
    updateStatsCounter();

    const saveBtn = document.getElementById('btn-save-visit');
    const orig = saveBtn.innerText;
    saveBtn.innerText = "✓ ¡Guardado!";
    saveBtn.classList.add('bg-emerald-600');
    setTimeout(() => {
      saveBtn.innerText = orig;
      saveBtn.classList.remove('bg-emerald-600');
    }, 1500);
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
      (pos) => {
        btn.classList.remove('animate-pulse', 'text-blue-600');
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        if (currentMapEngine === 'google' && googleMapInstance) {
          googleMapInstance.panTo({ lat: userLat, lng: userLng });
          googleMapInstance.setZoom(16);

          if (!userLocationMarker) {
            userLocationMarker = new google.maps.Marker({
              position: { lat: userLat, lng: userLng },
              map: googleMapInstance,
              title: "Estás aquí",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: '#2563eb',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
              }
            });
          } else {
            userLocationMarker.setPosition({ lat: userLat, lng: userLng });
          }
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
        alert("Para usar el GPS, activa la ubicación en tu Android Chrome.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ==========================================
  // EVENTOS DE INTERFAZ
  // ==========================================
  function initUIEvents() {
    // Chips de categorías
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip').forEach(c => {
          c.classList.remove('bg-blue-600', 'text-white', 'border-blue-600');
          c.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
        });
        chip.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
        chip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

        currentFilter = chip.dataset.category;
        renderCurrentMapMarkers();
        renderPlacesList();
      });
    });

    // Filtro de estado
    const statusSelect = document.getElementById('filter-status-select');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderCurrentMapMarkers();
        renderPlacesList();
      });
    }

    // Toggle Vista Lista / Mapa en móviles
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

    // Búsqueda con tecla Enter
    const searchInput = document.getElementById('search-query-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          window.searchGooglePlacesInZone(searchInput.value.trim());
        }
      });
    }
  }

  // ==========================================
  // CONFIGURACIÓN (AJUSTES GOOGLE MAPS)
  // ==========================================
  function initSettingsUI() {
    const config = window.getStoredConfig();
    document.getElementById('input-google-key').value = config.googleMapsApiKey || '';
  }

  window.openSettingsModal = function() {
    document.getElementById('settings-modal').classList.remove('hidden');
  };

  window.closeSettingsModal = function() {
    document.getElementById('settings-modal').classList.add('hidden');
  };

  window.saveSettings = function() {
    const googleKey = document.getElementById('input-google-key').value.trim();
    const currentCfg = window.getStoredConfig();
    
    const newCfg = {
      ...currentCfg,
      googleMapsApiKey: googleKey
    };

    window.saveStoredConfig(newCfg);
    closeSettingsModal();

    if (googleKey && googleKey !== currentCfg.googleMapsApiKey) {
      if (confirm("Se guardó tu Google Maps API Key. ¿Deseas recargar la app para activar el motor de Google Maps en vivo?")) {
        window.location.reload();
      }
    } else {
      alert("Ajustes guardados correctamente.");
    }
  };

  // Exportar a CSV/Excel
  window.exportLeadsToCSV = function() {
    if (places.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ["Nombre", "Rubro", "Dirección", "Teléfono", "Web", "Calificación", "Reseñas", "Estado Visita", "Contacto", "Notas"];
    const rows = places.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      `"${p.address.replace(/"/g, '""')}"`,
      `"${p.phone.replace(/"/g, '""')}"`,
      `"${(p.website || '').replace(/"/g, '""')}"`,
      p.rating,
      p.reviewCount,
      `"${p.visitStatus}"`,
      `"${(p.contactName || '').replace(/"/g, '""')}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `prospeccion_santa_fe_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Restablecer base inicial
  window.resetToDefaultPlaces = function() {
    if (confirm("¿Deseas restablecer los locales a la lista inicial de Santa Fe? Esto borrará tus notas actuales.")) {
      localStorage.removeItem(window.STORAGE_KEYS.PLACES);
      window.location.reload();
    }
  };

})();
