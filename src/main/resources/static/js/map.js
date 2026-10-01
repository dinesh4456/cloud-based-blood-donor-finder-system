/**
 * Blood Donor Finder System - Address-Based Interactive Donor Radar & Maps Engine
 * Powered by Leaflet.js with:
 * - Address Geocoding (OpenStreetMap Nominatim + Offline Hierarchical Dictionary)
 * - Automatic Pin Placement from Mentioned Addresses (State, District, Mandal, Village, City, Street)
 * - Address & Landmark Search on the Live Map
 * - Live Distance Calculation from Mentioned Address / GPS
 * - Custom SVG Blood Droplet Markers with Pulsing Radar
 */

const DonorMap = {
  map: null,
  markersLayer: null,
  userLocationMarker: null,
  userAccuracyCircle: null,
  addressSearchMarker: null,
  addressSearchCircle: null,
  userCoords: null,
  searchCoords: null,
  donorMarkers: {}, // donorId -> L.marker
  currentDonors: [],
  currentViewMode: 'split', // 'split', 'cards', 'map'
  pickerMap: null,
  pickerMarker: null,
  addressGeocodeCache: {}, // address string -> { lat, lng }
  addressDebounceTimer: null,

  // Fallback Coordinates for Indian States & Major Cities
  locationCoordinates: {
    // Top Cities & Localities
    "Mumbai": { lat: 19.0760, lng: 72.8777 },
    "Andheri": { lat: 19.1136, lng: 72.8697 },
    "Andheri West": { lat: 19.1363, lng: 72.8277 },
    "Bandra": { lat: 19.0596, lng: 72.8295 },
    "Bandra West": { lat: 19.0596, lng: 72.8295 },
    "Delhi": { lat: 28.6139, lng: 77.2090 },
    "New Delhi": { lat: 28.6139, lng: 77.2090 },
    "Connaught Place": { lat: 28.6315, lng: 77.2167 },
    "Janpath": { lat: 28.6255, lng: 77.2185 },
    "Bangalore": { lat: 12.9716, lng: 77.5946 },
    "Bengaluru": { lat: 12.9716, lng: 77.5946 },
    "Koramangala": { lat: 12.9352, lng: 77.6245 },
    "Hyderabad": { lat: 17.3850, lng: 78.4867 },
    "Madhapur": { lat: 17.4483, lng: 78.3915 },
    "Shaikpet": { lat: 17.4087, lng: 78.3986 },
    "Pune": { lat: 18.5204, lng: 73.8567 },
    "Kothrud": { lat: 18.5074, lng: 73.8077 },
    "Haveli": { lat: 18.5074, lng: 73.8077 },
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Kolkata": { lat: 22.5726, lng: 88.3639 },
    "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "Jaipur": { lat: 26.9124, lng: 75.7873 },
    "Surat": { lat: 21.1702, lng: 72.8311 },
    "Lucknow": { lat: 26.8467, lng: 80.9462 },
    "Kanpur": { lat: 26.4499, lng: 80.3319 },
    "Nagpur": { lat: 21.1458, lng: 79.0882 },
    "Indore": { lat: 22.7196, lng: 75.8577 },
    "Thane": { lat: 19.2183, lng: 72.9781 },
    "Bhopal": { lat: 23.2599, lng: 77.4126 },
    "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
    "Patna": { lat: 25.5941, lng: 85.1376 },
    "Vadodara": { lat: 22.3072, lng: 73.1812 },
    "Ghaziabad": { lat: 28.6692, lng: 77.4538 },
    "Ludhiana": { lat: 30.9010, lng: 75.8573 },
    "Agra": { lat: 27.1767, lng: 78.0081 },
    "Nashik": { lat: 19.9975, lng: 73.7898 },
    "Faridabad": { lat: 28.4089, lng: 77.3178 },
    "Meerut": { lat: 28.9845, lng: 77.7064 },
    "Rajkot": { lat: 22.3039, lng: 70.8022 },
    "Varanasi": { lat: 25.3176, lng: 82.9739 },
    "Srinagar": { lat: 34.0837, lng: 74.7973 },
    "Aurangabad": { lat: 19.8762, lng: 75.3433 },
    "Chhatrapati Sambhajinagar": { lat: 19.8762, lng: 75.3433 },
    "Dhanbad": { lat: 23.7957, lng: 86.4304 },
    "Amritsar": { lat: 31.6340, lng: 74.8723 },
    "Navi Mumbai": { lat: 19.0330, lng: 73.0297 },
    "Allahabad": { lat: 25.4358, lng: 81.8463 },
    "Prayagraj": { lat: 25.4358, lng: 81.8463 },
    "Ranchi": { lat: 23.3441, lng: 85.3096 },
    "Howrah": { lat: 22.5958, lng: 88.2636 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Jabalpur": { lat: 23.1815, lng: 79.9864 },
    "Gwalior": { lat: 26.2183, lng: 78.1828 },
    "Vijayawada": { lat: 16.5062, lng: 80.6480 },
    "Jodhpur": { lat: 26.2389, lng: 73.0243 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Raipur": { lat: 21.2514, lng: 81.6296 },
    "Kota": { lat: 25.2138, lng: 75.8648 },
    "Guwahati": { lat: 26.1445, lng: 91.7362 },
    "Chandigarh": { lat: 30.7333, lng: 76.7794 },
    "Solapur": { lat: 17.6599, lng: 75.9064 },
    "Hubli": { lat: 15.3647, lng: 75.1240 },
    "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
    "Bareilly": { lat: 28.3670, lng: 79.4304 },
    "Mysore": { lat: 12.2958, lng: 76.6394 },
    "Tirupati": { lat: 13.6288, lng: 79.4192 },
    "Dehradun": { lat: 30.3165, lng: 78.0322 },
    "Shimla": { lat: 31.1048, lng: 77.1734 },
    "Kochi": { lat: 9.9312, lng: 76.2673 },
    "Thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
    "Kozhikode": { lat: 11.2588, lng: 75.7804 },
    "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
    "Cuttack": { lat: 20.4625, lng: 85.8828 },
    "Jammu": { lat: 32.7266, lng: 74.8570 },
    "Udaipur": { lat: 24.5854, lng: 73.7125 },
    "Noida": { lat: 28.5355, lng: 77.3910 },
    "Greater Noida": { lat: 28.4744, lng: 77.5040 },
    "Gurgaon": { lat: 28.4595, lng: 77.0266 },
    "Gurugram": { lat: 28.4595, lng: 77.0266 },
    "Panaji": { lat: 15.4909, lng: 73.8278 },

    // Indian States (Center Fallback)
    "Maharashtra": { lat: 19.7515, lng: 75.7139 },
    "Karnataka": { lat: 15.3173, lng: 75.7139 },
    "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
    "Telangana": { lat: 18.1124, lng: 79.0193 },
    "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
    "Gujarat": { lat: 22.2587, lng: 71.1924 },
    "Rajasthan": { lat: 27.0238, lng: 74.2179 },
    "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
    "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
    "West Bengal": { lat: 22.9868, lng: 87.8550 },
    "Bihar": { lat: 25.0961, lng: 85.3131 },
    "Punjab": { lat: 31.1471, lng: 75.3412 },
    "Haryana": { lat: 29.0588, lng: 76.0856 },
    "Kerala": { lat: 10.8505, lng: 76.2711 },
    "Odisha": { lat: 20.9517, lng: 85.0985 },
    "Assam": { lat: 26.2006, lng: 92.9376 },
    "Jharkhand": { lat: 23.6102, lng: 85.2799 },
    "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
    "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
    "Himachal Pradesh": { lat: 31.7433, lng: 77.1000 },
    "Goa": { lat: 15.2993, lng: 74.1240 },
    "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762 }
  },

  /**
   * Initialize Main Leaflet Map Radar
   */
  init() {
    const mapContainer = document.getElementById('donors-map');
    if (!mapContainer || this.map) return;

    const defaultCenter = [20.5937, 78.9629];
    const defaultZoom = 5;

    try {
      this.map = L.map('donors-map', {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false
      });

      const cartoKey = 'cb1_44ix_1_6785756ee7ddbc0d49312512';
      const cartoUrl = `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;
      
      const primaryTileLayer = L.tileLayer(cartoUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      });

      // Automatic fallback to OpenStreetMap if Carto has any network/tile errors
      primaryTileLayer.on('tileerror', function() {
        if (!this._hasFallback) {
          this._hasFallback = true;
          console.warn('Carto tile error detected, falling back to OpenStreetMap tiles');
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(DonorMap.map);
        }
      });

      primaryTileLayer.addTo(this.map);

      L.control.attribution({
        position: 'bottomright',
        prefix: '<a href="https://leafletjs.com" title="Leaflet">Leaflet</a> | BloodFinder Geocoder'
      }).addTo(this.map);

      this.markersLayer = L.layerGroup().addTo(this.map);

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);

    } catch (err) {
      console.error('Failed to initialize Leaflet Map:', err);
    }
  },

  /**
   * Smart Geocoding Engine:
   * Resolves any mentioned address string to { lat, lng } using:
   * 1. Memory / LocalStorage Cache
   * 2. Local Knowledge Dictionary
   * 3. OpenStreetMap Nominatim Live Geocoding API
   */
  async geocodeAddress(addressStr) {
    if (!addressStr || !addressStr.trim()) return null;
    const cleanStr = addressStr.trim();
    const cacheKey = cleanStr.toLowerCase();

    // 1. Check in-memory cache
    if (this.addressGeocodeCache[cacheKey]) {
      return this.addressGeocodeCache[cacheKey];
    }

    // Check LocalStorage cache
    try {
      const stored = localStorage.getItem('bf_geo_' + cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.addressGeocodeCache[cacheKey] = parsed;
        return parsed;
      }
    } catch (e) {}

    // 2. Check Local Dictionary for direct matches in address parts
    const parts = cleanStr.split(',').map(s => s.trim());
    for (const part of parts) {
      if (this.locationCoordinates[part]) {
        const coords = this.locationCoordinates[part];
        this.addressGeocodeCache[cacheKey] = coords;
        return coords;
      }
    }

    // 3. Online Geocoding via OpenStreetMap Nominatim
    try {
      const encoded = encodeURIComponent(cleanStr);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=in&limit=1`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            displayName: data[0].display_name
          };
          this.addressGeocodeCache[cacheKey] = result;
          try {
            localStorage.setItem('bf_geo_' + cacheKey, JSON.stringify(result));
          } catch (e) {}
          return result;
        }
      }
    } catch (err) {
      console.warn('Nominatim geocoding network notice:', err);
    }

    // 4. Fallback: try removing street/house numbers and geocoding city/district/state
    if (parts.length > 1) {
      const broaderAddress = parts.slice(1).join(', ');
      return await this.geocodeAddress(broaderAddress);
    }

    return null;
  },

  /**
   * Resolve best latitude and longitude for a donor based on their mentioned address
   */
  resolveCoordinates(donor) {
    if (donor.latitude && donor.longitude) {
      return { lat: parseFloat(donor.latitude), lng: parseFloat(donor.longitude) };
    }

    // Direct match by village/locality
    if (donor.village && this.locationCoordinates[donor.village]) {
      const base = this.locationCoordinates[donor.village];
      return this.addJitter(base, donor.id || 1);
    }

    // Direct match by mandal
    if (donor.mandal && this.locationCoordinates[donor.mandal]) {
      const base = this.locationCoordinates[donor.mandal];
      return this.addJitter(base, donor.id || 1);
    }

    // Lookup by City
    if (donor.city && this.locationCoordinates[donor.city]) {
      const base = this.locationCoordinates[donor.city];
      return this.addJitter(base, donor.id || 1);
    }

    // Lookup by District
    if (donor.district && this.locationCoordinates[donor.district]) {
      const base = this.locationCoordinates[donor.district];
      return this.addJitter(base, donor.id || 1);
    }

    // Lookup by State
    if (donor.state && this.locationCoordinates[donor.state]) {
      const base = this.locationCoordinates[donor.state];
      return this.addJitter(base, donor.id || 1);
    }

    // Fallback central India
    return this.addJitter({ lat: 20.5937, lng: 78.9629 }, donor.id || 1);
  },

  /**
   * Deterministic slight jitter so multiple donors in the same village/mandal don't overlap completely
   */
  addJitter(base, id) {
    const seed = (id * 9301 + 49297) % 233280;
    const rnd1 = (seed / 233280) - 0.5;
    const rnd2 = (((seed * 9301 + 49297) % 233280) / 233280) - 0.5;
    return {
      lat: base.lat + (rnd1 * 0.035),
      lng: base.lng + (rnd2 * 0.035)
    };
  },

  /**
   * Create custom SVG Blood Pin marker icon
   */
  createDonorIcon(bloodGroupDisplay, isAvailable, isHighlighted = false) {
    const bg = isAvailable ? '#dc2626' : '#64748b';
    const highlightClass = isHighlighted ? 'highlighted-pin' : '';
    const pulseHtml = isAvailable ? '<div class="donor-radar-pulse"></div>' : '';
    const label = (bloodGroupDisplay || 'O+').replace(' POSITIVE', '+').replace(' NEGATIVE', '-');

    return L.divIcon({
      className: 'custom-donor-pin-outer',
      html: `
        <div class="donor-pin-container ${isAvailable ? 'is-available' : 'is-unavailable'} ${highlightClass}">
          ${pulseHtml}
          <div class="donor-pin-head" style="background: ${bg};">
            <i class="bi bi-droplet-fill pin-droplet-icon"></i>
            <span class="pin-blood-group">${label}</span>
          </div>
          <div class="donor-pin-arrow" style="border-top-color: ${bg};"></div>
        </div>
      `,
      iconSize: [42, 52],
      iconAnchor: [21, 50],
      popupAnchor: [0, -46]
    });
  },

  /**
   * Render all donors as interactive markers on the radar map
   */
  renderDonors(donors) {
    if (!this.map) {
      this.init();
    }
    if (!this.map || !this.markersLayer) return;

    this.currentDonors = donors || [];
    this.markersLayer.clearLayers();
    this.donorMarkers = {};

    const bounds = [];
    const countBadge = document.getElementById('map-donor-count');
    if (countBadge) countBadge.textContent = this.currentDonors.length;

    const emptyOverlay = document.getElementById('map-empty-overlay');
    if (this.currentDonors.length === 0) {
      if (emptyOverlay) emptyOverlay.classList.remove('d-none');
      if (this.searchCoords) {
        this.map.setView([this.searchCoords.lat, this.searchCoords.lng], 13);
      } else if (this.userCoords) {
        this.map.setView([this.userCoords.lat, this.userCoords.lng], 13);
      } else {
        this.map.setView([20.5937, 78.9629], 5);
      }
      return;
    } else {
      if (emptyOverlay) emptyOverlay.classList.add('d-none');
    }

    this.currentDonors.forEach(donor => {
      const coords = this.resolveCoordinates(donor);
      if (!coords || isNaN(coords.lat) || isNaN(coords.lng)) return;

      const isAvail = donor.availabilityStatus === 'AVAILABLE';
      const icon = this.createDonorIcon(donor.bloodGroupDisplay || donor.bloodGroup, isAvail);

      const marker = L.marker([coords.lat, coords.lng], {
        icon: icon,
        title: `${donor.name} (${donor.bloodGroupDisplay || donor.bloodGroup})`,
        riseOnHover: true
      });

      // Build full mentioned address string
      const addrComponents = [];
      if (donor.address) addrComponents.push(donor.address);
      if (donor.village) addrComponents.push(donor.village);
      if (donor.mandal) addrComponents.push(donor.mandal + ' (M)');
      if (donor.district) addrComponents.push(donor.district);
      if (donor.city && donor.city !== donor.district) addrComponents.push(donor.city);
      if (donor.state) addrComponents.push(donor.state);
      const fullAddressString = addrComponents.length > 0 ? addrComponents.join(', ') : (donor.city || 'India');

      // Distance tag if reference position exists (User GPS or Searched Address)
      let distanceBadge = '';
      const refPoint = this.searchCoords || this.userCoords;
      if (refPoint) {
        const distKm = this.calculateDistanceKm(refPoint.lat, refPoint.lng, coords.lat, coords.lng);
        const refLabel = this.searchCoords ? 'searched address' : 'you';
        distanceBadge = `
          <div class="popup-distance-tag">
            <i class="bi bi-cursor-fill text-primary me-1"></i><strong>${distKm.toFixed(1)} km</strong> from ${refLabel}
          </div>
        `;
      }

      // Rich Popup Content with full Mentioned Address
      const popupHtml = `
        <div class="donor-map-popup">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge ${isAvail ? 'bg-success' : 'bg-secondary'} rounded-pill px-2 py-1 small">
              <i class="bi ${isAvail ? 'bi-check-circle-fill' : 'bi-dash-circle'} me-1"></i>${isAvail ? 'Available' : 'Unavailable'}
            </span>
            <span class="badge bg-danger-subtle text-danger fw-bold fs-6">
              ${donor.bloodGroupDisplay || donor.bloodGroup}
            </span>
          </div>

          <h6 class="donor-popup-name mb-1">${this.escapeHtml(donor.name)}</h6>
          
          <!-- Mentioned Address Card -->
          <div class="donor-popup-address my-2 p-2 bg-light rounded border small">
            <div class="fw-bold text-dark mb-1">
              <i class="bi bi-geo-alt-fill text-danger me-1"></i>Mentioned Address:
            </div>
            <div class="text-secondary" style="font-size: 0.8rem; line-height: 1.35;">
              ${this.escapeHtml(fullAddressString)}
            </div>
          </div>

          ${distanceBadge}

          <div class="donor-popup-details small py-1 my-2 border-top border-bottom">
            <div class="d-flex justify-content-between text-secondary py-1">
              <span><i class="bi bi-telephone-fill me-1 text-muted"></i>Contact:</span>
              <a href="tel:${this.escapeHtml(donor.contactNumber)}" class="fw-semibold text-danger text-decoration-none">
                ${this.escapeHtml(donor.contactNumber)}
              </a>
            </div>
            <div class="d-flex justify-content-between text-secondary py-1">
              <span><i class="bi bi-award-fill me-1 text-warning"></i>Total Donations:</span>
              <span class="fw-semibold text-dark">${donor.totalDonations || 0} times</span>
            </div>
          </div>

          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-blood-red btn-sm flex-grow-1" onclick="App.openRequestModalForDonor(${donor.id}, '${this.escapeHtml(donor.name)}', '${donor.bloodGroup}', '${this.escapeHtml(donor.city)}')">
              <i class="bi bi-send-fill me-1"></i>Request Blood
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddressString)}" target="_blank" class="btn btn-outline-secondary btn-sm" title="Directions to Mentioned Address">
              <i class="bi bi-sign-turn-right-fill"></i>
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: 'custom-leaflet-popup'
      });

      marker.addTo(this.markersLayer);
      this.donorMarkers[donor.id] = marker;
      bounds.push([coords.lat, coords.lng]);
    });

    if (this.searchCoords) bounds.push([this.searchCoords.lat, this.searchCoords.lng]);
    if (this.userCoords) bounds.push([this.userCoords.lat, this.userCoords.lng]);

    if (bounds.length > 0) {
      if (bounds.length === 1) {
        this.map.setView(bounds[0], 13);
      } else {
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  },

  /**
   * Search any mentioned address, hospital, or locality directly on the map
   */
  async searchAddressOnMap() {
    const input = document.getElementById('map-address-input');
    const query = input?.value?.trim();
    if (!query) {
      if (typeof App !== 'undefined') App.showToast('Please type an address, area, or hospital to search', 'warning');
      return;
    }

    const btn = document.querySelector('#map-address-search-form button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Locating...';
    }

    try {
      const coords = await this.geocodeAddress(query);
      if (coords && coords.lat && coords.lng) {
        this.searchCoords = coords;

        if (!this.map) this.init();

        // Clear existing address search marker
        if (this.addressSearchMarker) this.map.removeLayer(this.addressSearchMarker);
        if (this.addressSearchCircle) this.map.removeLayer(this.addressSearchCircle);

        // Custom Target Marker
        const targetIcon = L.divIcon({
          className: 'custom-address-search-pin',
          html: `
            <div class="address-search-marker">
              <div class="address-radar-ring"></div>
              <div class="address-marker-center"><i class="bi bi-geo-alt-fill text-white"></i></div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        this.addressSearchMarker = L.marker([coords.lat, coords.lng], { icon: targetIcon, zIndexOffset: 1200 })
          .bindPopup(`
            <div class="p-2 text-center">
              <span class="badge bg-danger-subtle text-danger mb-1"><i class="bi bi-pin-map-fill me-1"></i>Searched Address</span>
              <h6 class="fw-bold mb-1">${this.escapeHtml(query)}</h6>
              <p class="text-muted small mb-0">Showing nearby lifesaving blood donors within radius.</p>
            </div>
          `)
          .addTo(this.map);

        this.addressSearchCircle = L.circle([coords.lat, coords.lng], {
          radius: 5000, // 5 km search radius circle
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(this.map);

        this.map.flyTo([coords.lat, coords.lng], 13, { duration: 1.2 });
        setTimeout(() => this.addressSearchMarker.openPopup(), 1250);

        // Re-render donors to calculate distances from this searched address
        if (this.currentDonors.length > 0) {
          this.renderDonors(this.currentDonors);
        }

        if (typeof App !== 'undefined') {
          App.showToast(`Map centered on: "${query}"`, 'success');
        }
      } else {
        if (typeof App !== 'undefined') {
          App.showToast(`Could not pinpoint address "${query}". Please check spelling.`, 'warning');
        }
      }
    } catch (err) {
      console.error('Address search error:', err);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-search me-1"></i>Locate';
      }
    }
  },

  /**
   * Clear the active address search from the map
   */
  clearAddressSearch() {
    const input = document.getElementById('map-address-input');
    if (input) input.value = '';

    if (this.addressSearchMarker) {
      this.map.removeLayer(this.addressSearchMarker);
      this.addressSearchMarker = null;
    }
    if (this.addressSearchCircle) {
      this.map.removeLayer(this.addressSearchCircle);
      this.addressSearchCircle = null;
    }
    this.searchCoords = null;

    if (this.currentDonors.length > 0) {
      this.renderDonors(this.currentDonors);
    }
    this.resetView();
  },

  /**
   * Smoothly pan, zoom, and open popup for a specific donor
   */
  locateDonor(donorId) {
    if (!this.map) return;

    if (this.currentViewMode === 'cards') {
      this.setViewMode('split');
    }

    const marker = this.donorMarkers[donorId];
    if (marker) {
      const latLng = marker.getLatLng();

      const mapCol = document.getElementById('donors-map-column');
      if (mapCol) {
        mapCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      this.map.flyTo(latLng, 14, {
        animate: true,
        duration: 1.2
      });

      setTimeout(() => {
        marker.openPopup();
      }, 1250);
    }
  },

  /**
   * Focus map on cascading search selections (State / District / Mandal / Village)
   */
  async focusOnLocation({ state, district, mandal, village, city }) {
    if (!this.map) this.init();
    const parts = [village, mandal, district, city, state, 'India'].filter(Boolean);
    if (parts.length === 1 && parts[0] === 'India') return;

    const query = parts.join(', ');
    const coords = await this.geocodeAddress(query);
    if (coords && coords.lat && coords.lng) {
      const zoom = village ? 14 : (mandal ? 13 : (district || city ? 11 : 7));
      this.map.flyTo([coords.lat, coords.lng], zoom, { duration: 1.2 });
    }
  },

  /**
   * Locate the user using Browser Geolocation API
   */
  locateUser() {
    if (!navigator.geolocation) {
      if (typeof App !== 'undefined') App.showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    const btn = document.getElementById('btn-user-location');
    if (btn) {
      btn.classList.add('disabled');
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Locating...';
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (btn) {
          btn.classList.remove('disabled');
          btn.innerHTML = '<i class="bi bi-crosshair me-1"></i>Near Me';
        }

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.userCoords = { lat, lng };

        if (!this.map) this.init();

        if (this.userLocationMarker) this.map.removeLayer(this.userLocationMarker);
        if (this.userAccuracyCircle) this.map.removeLayer(this.userAccuracyCircle);

        const userIcon = L.divIcon({
          className: 'custom-user-location-pin',
          html: `
            <div class="user-location-marker">
              <div class="user-radar-ring"></div>
              <div class="user-marker-center"><i class="bi bi-person-fill text-white"></i></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        this.userLocationMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 })
          .bindPopup(`
            <div class="p-2 text-center">
              <h6 class="fw-bold mb-1"><i class="bi bi-geo-alt-fill text-primary me-1"></i>Your Current Location</h6>
              <p class="text-muted small mb-0">Searching for lifesaving donors around you.</p>
            </div>
          `)
          .addTo(this.map);

        this.userAccuracyCircle = L.circle([lat, lng], {
          radius: pos.coords.accuracy || 2500,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.12,
          weight: 1
        }).addTo(this.map);

        this.map.flyTo([lat, lng], 13, { duration: 1.5 });

        if (this.currentDonors.length > 0) {
          this.renderDonors(this.currentDonors);
        }

        if (typeof App !== 'undefined') {
          App.showToast('Your GPS location detected! Radar centered on you.', 'success');
        }
      },
      (err) => {
        if (btn) {
          btn.classList.remove('disabled');
          btn.innerHTML = '<i class="bi bi-crosshair me-1"></i>Near Me';
        }
        console.warn('Geolocation error:', err);
        if (typeof App !== 'undefined') {
          App.showToast('Could not access GPS. You can search any address in the map search bar.', 'info');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  },

  /**
   * Reset map view to fit all currently displayed donors
   */
  resetView() {
    if (!this.map || !this.markersLayer) return;
    const bounds = [];
    Object.values(this.donorMarkers).forEach(m => bounds.push(m.getLatLng()));
    if (this.userLocationMarker) bounds.push(this.userLocationMarker.getLatLng());
    if (this.addressSearchMarker) bounds.push(this.addressSearchMarker.getLatLng());

    if (bounds.length > 0) {
      this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      this.map.setView([20.5937, 78.9629], 5);
    }
  },

  /**
   * Switch View Mode: 'split' | 'cards' | 'map'
   */
  setViewMode(mode) {
    this.currentViewMode = mode;
    const container = document.getElementById('donors-view-container');
    const cardsCol = document.getElementById('donors-cards-column');
    const mapCol = document.getElementById('donors-map-column');
    const grid = document.getElementById('donors-grid');

    const btnSplit = document.getElementById('btn-view-split');
    const btnCards = document.getElementById('btn-view-cards');
    const btnMap = document.getElementById('btn-view-map');

    if (btnSplit) btnSplit.classList.toggle('active', mode === 'split');
    if (btnCards) btnCards.classList.toggle('active', mode === 'cards');
    if (btnMap) btnMap.classList.toggle('active', mode === 'map');

    if (!container || !cardsCol || !mapCol) return;

    if (mode === 'split') {
      container.className = 'view-split';
      cardsCol.className = 'col-lg-6';
      cardsCol.style.display = 'block';
      mapCol.className = 'col-lg-6';
      mapCol.style.display = 'block';
      if (grid) {
        grid.querySelectorAll('.donor-card-wrapper').forEach(w => {
          w.className = 'col-12 mb-3 donor-card-wrapper';
        });
      }
    } else if (mode === 'cards') {
      container.className = 'view-cards';
      cardsCol.className = 'col-12';
      cardsCol.style.display = 'block';
      mapCol.style.display = 'none';
      if (grid) {
        grid.querySelectorAll('.donor-card-wrapper').forEach(w => {
          w.className = 'col-md-6 col-lg-4 mb-4 donor-card-wrapper';
        });
      }
    } else if (mode === 'map') {
      container.className = 'view-map';
      cardsCol.style.display = 'none';
      mapCol.className = 'col-12';
      mapCol.style.display = 'block';
    }

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 200);
  },

  // =========================================================================
  // Donor Registration / Edit: Address-based Mini-Map Integration
  // =========================================================================

  /**
   * Initialize or update picker map in the Donor Registration / Profile Modal
   */
  initPicker(defaultLat = 19.0760, defaultLng = 72.8777) {
    const pickerContainer = document.getElementById('donor-picker-map');
    if (!pickerContainer) return;

    const lat = defaultLat || 19.0760;
    const lng = defaultLng || 72.8777;

    if (!this.pickerMap) {
      this.pickerMap = L.map('donor-picker-map', {
        center: [lat, lng],
        zoom: 12,
        attributionControl: false
      });

      const cartoKey = 'cb1_44ix_1_6785756ee7ddbc0d49312512';
      const cartoUrl = `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${cartoKey}`;

      const pickerTileLayer = L.tileLayer(cartoUrl, {
        maxZoom: 19
      });

      pickerTileLayer.on('tileerror', function() {
        if (!this._hasFallback) {
          this._hasFallback = true;
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(DonorMap.pickerMap);
        }
      });

      pickerTileLayer.addTo(this.pickerMap);

      const pickerIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div class="picker-pin-bubble">
            <i class="bi bi-geo-alt-fill text-danger fs-3"></i>
          </div>
        `,
        iconSize: [30, 36],
        iconAnchor: [15, 36]
      });

      this.pickerMarker = L.marker([lat, lng], {
        draggable: true,
        icon: pickerIcon
      }).addTo(this.pickerMap);

      this.pickerMarker.on('dragend', () => {
        const pos = this.pickerMarker.getLatLng();
        this.updatePickerFields(pos.lat, pos.lng);
        const feedback = document.getElementById('picker-address-feedback');
        if (feedback) feedback.innerHTML = '<i class="bi bi-pin-angle-fill me-1 text-primary"></i>Pin manually adjusted';
      });

      this.pickerMap.on('click', (e) => {
        this.pickerMarker.setLatLng(e.latlng);
        this.updatePickerFields(e.latlng.lat, e.latlng.lng);
        const feedback = document.getElementById('picker-address-feedback');
        if (feedback) feedback.innerHTML = '<i class="bi bi-pin-angle-fill me-1 text-primary"></i>Pin manually placed';
      });

      // Bind address change listeners to auto-pin from mentioned address
      this.bindAddressInputListeners();

    } else {
      this.pickerMap.setView([lat, lng], 12);
      this.pickerMarker.setLatLng([lat, lng]);
    }

    this.updatePickerFields(lat, lng);

    setTimeout(() => {
      if (this.pickerMap) this.pickerMap.invalidateSize();
    }, 300);
  },

  /**
   * Auto-bind address change events to synchronize map pin with mentioned address
   */
  bindAddressInputListeners() {
    const addressFields = ['donor-state', 'donor-district', 'donor-mandal', 'donor-village', 'donor-city', 'donor-address'];
    addressFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => this.debounceLocateFromFormAddress());
        if (id === 'donor-city' || id === 'donor-address') {
          el.addEventListener('blur', () => this.locateFromFormAddress());
        }
      }
    });
  },

  debounceLocateFromFormAddress() {
    clearTimeout(this.addressDebounceTimer);
    this.addressDebounceTimer = setTimeout(() => {
      this.locateFromFormAddress();
    }, 500);
  },

  /**
   * Geocode and synchronize picker pin based on current form address fields
   */
  async locateFromFormAddress() {
    const state = document.getElementById('donor-state')?.value || '';
    const district = document.getElementById('donor-district')?.value || '';
    const mandal = document.getElementById('donor-mandal')?.value || '';
    const village = document.getElementById('donor-village')?.value || '';
    const city = document.getElementById('donor-city')?.value || '';
    const address = document.getElementById('donor-address')?.value || '';

    // Ignore placeholder/custom dropdown values
    const cleanDistrict = (district && district !== 'CUSTOM_ENTRY') ? district : '';
    const cleanMandal = (mandal && mandal !== 'CUSTOM_ENTRY') ? mandal : '';
    const cleanVillage = (village && village !== 'CUSTOM_ENTRY') ? village : '';

    const parts = [address, cleanVillage, cleanMandal, cleanDistrict, city, state, 'India'].filter(Boolean);
    if (parts.length <= 1) return; // Only 'India'

    const query = parts.join(', ');
    const feedback = document.getElementById('picker-address-feedback');
    if (feedback) {
      feedback.innerHTML = '<span class="spinner-border spinner-border-sm me-1 text-primary"></span>Finding address on map...';
    }

    const coords = await this.geocodeAddress(query);
    if (coords && coords.lat && coords.lng) {
      if (this.pickerMap && this.pickerMarker) {
        this.pickerMarker.setLatLng([coords.lat, coords.lng]);
        const zoom = (address || cleanVillage) ? 14 : (cleanMandal ? 13 : (cleanDistrict || city ? 11 : 7));
        this.pickerMap.setView([coords.lat, coords.lng], zoom);
        this.updatePickerFields(coords.lat, coords.lng);
      }

      if (feedback) {
        const shortAddr = [address, cleanVillage, cleanMandal, city || cleanDistrict, state].filter(Boolean).join(', ');
        feedback.innerHTML = `<i class="bi bi-check-circle-fill text-success me-1"></i>Pin placed at: <strong>${this.escapeHtml(shortAddr)}</strong>`;
      }
    } else {
      if (feedback) {
        feedback.innerHTML = '<span class="text-muted"><i class="bi bi-info-circle me-1"></i>Could not auto-resolve address. You can click on the map to pin.</span>';
      }
    }
  },

  updatePickerFields(lat, lng) {
    const latInput = document.getElementById('donor-latitude');
    const lngInput = document.getElementById('donor-longitude');
    const latDisp = document.getElementById('disp-donor-lat');
    const lngDisp = document.getElementById('disp-donor-lng');

    const formattedLat = parseFloat(lat).toFixed(6);
    const formattedLng = parseFloat(lng).toFixed(6);

    if (latInput) latInput.value = formattedLat;
    if (lngInput) lngInput.value = formattedLng;
    if (latDisp) latDisp.textContent = formattedLat;
    if (lngDisp) lngDisp.textContent = formattedLng;
  },

  /**
   * Detect Donor's GPS position in the registration modal
   */
  detectDonorGPS() {
    if (!navigator.geolocation) {
      if (typeof App !== 'undefined') App.showToast('Geolocation is not supported by your browser', 'warning');
      return;
    }

    const btn = document.getElementById('btn-detect-gps');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Detecting...';
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-crosshair me-1"></i>GPS Location';
        }
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (this.pickerMap && this.pickerMarker) {
          this.pickerMarker.setLatLng([lat, lng]);
          this.pickerMap.setView([lat, lng], 14);
          this.updatePickerFields(lat, lng);
        }

        const feedback = document.getElementById('picker-address-feedback');
        if (feedback) {
          feedback.innerHTML = '<i class="bi bi-check-circle-fill text-success me-1"></i>Pinpoint set from device GPS!';
        }

        if (typeof App !== 'undefined') {
          App.showToast('Location pinpointed from your device GPS!', 'success');
        }
      },
      (err) => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-crosshair me-1"></i>GPS Location';
        }
        if (typeof App !== 'undefined') {
          App.showToast('Could not fetch GPS. Click "Pin from Address" to locate by entered address.', 'info');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  },

  /**
   * Helper: Great-circle distance between two points in km (Haversine Formula)
   */
  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
