/**
 * Blood Donor Finder System - Main Application Logic
 */

const App = {
  selectedBloodGroup: '',
  selectedCountry: 'India',
  selectedState: '',
  selectedDistrict: '',
  selectedMandal: '',
  selectedVillage: '',
  selectedCity: '',
  donorsList: [],
  currentViewMode: 'split',

  init() {
    Auth.init();
    this.setupLocationFilters();
    this.bindEvents();
    this.loadStats();
    if (typeof DonorMap !== 'undefined') {
      DonorMap.init();
    }
    this.loadDonors();
  },

  setupLocationFilters() {
    if (typeof Locations !== 'undefined') {
      Locations.setupFullCascading({
        country: 'India',
        stateEl: document.getElementById('hero-state'),
        districtEl: document.getElementById('hero-district'),
        mandalEl: document.getElementById('hero-mandal'),
        villageEl: document.getElementById('hero-village')
      });
    }
  },

  bindEvents() {
    // Blood Group Filter Pills
    document.querySelectorAll('.blood-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.blood-filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedBloodGroup = e.target.dataset.bloodGroup || '';
        const heroSelect = document.getElementById('hero-blood-group');
        if (heroSelect) heroSelect.value = this.selectedBloodGroup;
        this.loadDonors();
      });
    });

    // Search Form Submit
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.selectedCity = document.getElementById('search-city')?.value?.trim() || '';
        if (typeof DonorMap !== 'undefined' && this.selectedCity) {
          DonorMap.focusOnLocation({ city: this.selectedCity });
        }
        this.loadDonors();
      });
    }

    // Hero Cascading Search Form Submit
    const heroCascadingForm = document.getElementById('hero-cascading-search-form');
    if (heroCascadingForm) {
      heroCascadingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.selectedBloodGroup = document.getElementById('hero-blood-group')?.value || '';
        this.selectedState = document.getElementById('hero-state')?.value || '';
        this.selectedDistrict = document.getElementById('hero-district')?.value || '';
        this.selectedMandal = document.getElementById('hero-mandal')?.value || '';
        this.selectedVillage = document.getElementById('hero-village')?.value || '';

        // Ignore custom option key if selected without entering custom string
        if (this.selectedDistrict === Locations.customOptionValue) this.selectedDistrict = '';
        if (this.selectedMandal === Locations.customOptionValue) this.selectedMandal = '';
        if (this.selectedVillage === Locations.customOptionValue) this.selectedVillage = '';

        // Sync with blood filter pills
        document.querySelectorAll('.blood-filter-btn').forEach(b => {
          b.classList.toggle('active', (b.dataset.bloodGroup || '') === this.selectedBloodGroup);
        });

        // Smooth scroll to results
        const searchSec = document.getElementById('search-section');
        if (searchSec) searchSec.scrollIntoView({ behavior: 'smooth' });

        if (typeof DonorMap !== 'undefined') {
          DonorMap.focusOnLocation({
            state: this.selectedState,
            district: this.selectedDistrict,
            mandal: this.selectedMandal,
            village: this.selectedVillage,
            city: this.selectedCity
          });
        }

        this.loadDonors();
      });
    }

    // Hero Reset Button
    const heroResetBtn = document.getElementById('hero-reset-btn');
    if (heroResetBtn) {
      heroResetBtn.addEventListener('click', () => {
        const bloodGroupEl = document.getElementById('hero-blood-group');
        const stateEl = document.getElementById('hero-state');
        const districtEl = document.getElementById('hero-district');
        const mandalEl = document.getElementById('hero-mandal');
        const villageEl = document.getElementById('hero-village');

        if (bloodGroupEl) bloodGroupEl.value = '';
        if (stateEl) stateEl.value = '';
        if (districtEl) districtEl.innerHTML = '<option value="">All Districts</option>';
        if (mandalEl) mandalEl.innerHTML = '<option value="">All Mandals / Taluks</option>';
        if (villageEl) villageEl.innerHTML = '<option value="">All Villages / Towns</option>';

        this.selectedBloodGroup = '';
        this.selectedState = '';
        this.selectedDistrict = '';
        this.selectedMandal = '';
        this.selectedVillage = '';
        this.selectedCity = '';

        document.querySelectorAll('.blood-filter-btn').forEach(b => {
          b.classList.toggle('active', (b.dataset.bloodGroup || '') === '');
        });

        const mainCity = document.getElementById('search-city');
        if (mainCity) mainCity.value = '';

        this.loadDonors();
      });
    }

    // Availability Filter Checkbox
    const availOnlyCheck = document.getElementById('filter-available-only');
    if (availOnlyCheck) {
      availOnlyCheck.addEventListener('change', () => {
        this.loadDonors();
      });
    }

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = loginForm.querySelector('button[type="submit"]');

        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
          await Auth.login(email, password);
          bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
          this.showToast('Welcome back, ' + Auth.currentUser.name + '!', 'success');
          loginForm.reset();
        } catch (err) {
          this.showToast(err.message || 'Login failed', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Sign In';
        }
      });
    }

    // Register Form Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const phone = document.getElementById('reg-phone').value;
        const role = document.getElementById('reg-role').value;
        const btn = registerForm.querySelector('button[type="submit"]');

        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registering...';
          await Auth.register(name, email, password, phone, role);
          bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
          this.showToast('Registration successful! Welcome, ' + name, 'success');
          registerForm.reset();

          if (role === 'ROLE_DONOR') {
            this.openDonorRegistrationModal();
          }
        } catch (err) {
          this.showToast(err.message || 'Registration failed', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Create Account';
        }
      });
    }

    // Blood Request Form Submit
    const requestForm = document.getElementById('blood-request-form');
    if (requestForm) {
      requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!Auth.isAuthenticated()) {
          this.showToast('Please sign in to send a blood request', 'warning');
          new bootstrap.Modal(document.getElementById('authModal')).show();
          return;
        }

        const btn = requestForm.querySelector('button[type="submit"]');
        const donorId = document.getElementById('req-donor-id').value;
        const payload = {
          donorId: donorId ? parseInt(donorId) : null,
          patientName: document.getElementById('req-patient-name').value,
          bloodGroup: document.getElementById('req-blood-group').value,
          hospitalName: document.getElementById('req-hospital-name').value,
          hospitalAddress: document.getElementById('req-hospital-address').value,
          city: document.getElementById('req-city').value,
          contactNumber: document.getElementById('req-contact').value,
          requiredUnits: parseInt(document.getElementById('req-units').value) || 1,
          urgencyLevel: document.getElementById('req-urgency').value,
          neededBefore: document.getElementById('req-date').value || null,
          additionalNotes: document.getElementById('req-notes').value || null
        };

        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
          const response = await API.post('/requests', payload);
          if (response && response.success) {
            bootstrap.Modal.getInstance(document.getElementById('bloodRequestModal')).hide();
            this.showToast('Blood request submitted successfully!', 'success');
            requestForm.reset();
            this.loadStats();
          }
        } catch (err) {
          this.showToast(err.message || 'Failed to submit blood request', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Submit Blood Request';
        }
      });
    }

    // Profile Form Submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const phone = document.getElementById('profile-phone').value;
        const btn = profileForm.querySelector('button[type="submit"]');

        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
          const response = await API.put('/users/profile', { name, phone });
          if (response && response.success) {
            Auth.currentUser.name = name;
            Auth.currentUser.phone = phone;
            API.setUser(Auth.currentUser);
            Auth.updateUI();
            this.showToast('Profile updated successfully!', 'success');
          }
        } catch (err) {
          this.showToast(err.message || 'Failed to update profile', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Save Changes';
        }
      });
    }

    // Change Password Form Submit
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
      passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('pwd-current').value;
        const newPassword = document.getElementById('pwd-new').value;
        const confirmPassword = document.getElementById('pwd-confirm').value;

        if (newPassword !== confirmPassword) {
          this.showToast('New passwords do not match', 'warning');
          return;
        }

        const btn = passwordForm.querySelector('button[type="submit"]');
        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...';
          const res = await API.put('/users/change-password', { currentPassword, newPassword });
          if (res && res.success) {
            this.showToast('Password changed successfully!', 'success');
            passwordForm.reset();
          }
        } catch (err) {
          this.showToast(err.message || 'Failed to change password', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Change Password';
        }
      });
    }

    // Donor Profile Form Submit
    const donorForm = document.getElementById('donor-profile-form');
    if (donorForm) {
      donorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const isUpdate = document.getElementById('donor-is-update').value === 'true';
        const payload = {
          bloodGroup: document.getElementById('donor-blood-group').value,
          country: 'India',
          state: document.getElementById('donor-state')?.value || '',
          district: document.getElementById('donor-district')?.value || '',
          mandal: document.getElementById('donor-mandal')?.value || '',
          village: document.getElementById('donor-village')?.value || '',
          city: document.getElementById('donor-city')?.value || '',
          address: document.getElementById('donor-address').value,
          contactNumber: document.getElementById('donor-contact').value,
          lastDonationDate: document.getElementById('donor-last-date').value || null,
          availabilityStatus: document.getElementById('donor-availability').value,
          latitude: parseFloat(document.getElementById('donor-latitude')?.value) || null,
          longitude: parseFloat(document.getElementById('donor-longitude')?.value) || null,
            profilePhoto: document.getElementById('donor-profile-photo-url')?.value || null
        };

        const btn = donorForm.querySelector('button[type="submit"]');
        try {
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
          
          let response;
          if (isUpdate) {
            response = await API.put('/donors/profile', payload);
          } else {
            response = await API.post('/donors/register', payload);
          }

          if (response && response.success) {
            Auth.currentUser.isDonor = true;
            Auth.currentUser.donorId = response.data.id;
            API.setUser(Auth.currentUser);
            Auth.updateUI();
            bootstrap.Modal.getInstance(document.getElementById('donorModal')).hide();
            this.showToast(isUpdate ? 'Donor profile updated!' : 'Congratulations! You are now a registered blood donor.', 'success');
            this.loadDonors();
            this.loadStats();
          }
        } catch (err) {
          this.showToast(err.message || 'Failed to save donor details', 'danger');
        } finally {
          btn.disabled = false;
          btn.innerHTML = 'Save Donor Details';
        }
      });
    }
  },

  // =========================================================================
  // Donors & Search
  // =========================================================================

  async loadStats() {
    try {
      const response = await API.get('/donors/stats/summary');
      if (response && response.success) {
        const stats = response.data;
        let totalDonors = 0;
        for (const count of Object.values(stats)) {
          totalDonors += count;
        }
        const statDonors = document.getElementById('stat-total-donors');
        if (statDonors) statDonors.textContent = totalDonors;

        // Render mini stats in hero/section
        this.renderBloodGroupBadges(stats);
      }
    } catch (err) {
      console.warn('Could not load summary stats:', err);
    }
  },

  renderBloodGroupBadges(stats) {
    const container = document.getElementById('blood-group-stats-strip');
    if (!container) return;

    let html = '';
    for (const [bg, count] of Object.entries(stats)) {
      html += `
        <div class="col-6 col-sm-3 col-md-3 col-lg-auto mb-2">
          <div class="p-2 border rounded text-center bg-white shadow-sm">
            <span class="badge bg-danger mb-1">${bg}</span>
            <div class="fw-bold fs-6 text-dark">${count} Donors</div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  },

  async loadDonors() {
    const container = document.getElementById('donors-grid');
    const loadingEl = document.getElementById('donors-loading');
    const noResultsEl = document.getElementById('donors-no-results');

    if (loadingEl) loadingEl.classList.remove('d-none');
    if (noResultsEl) noResultsEl.classList.add('d-none');
    if (container) container.innerHTML = '';

    const cityInput = document.getElementById('search-city')?.value?.trim() || '';
    const city = this.selectedCity || cityInput;
    const availableOnly = document.getElementById('filter-available-only')?.checked;

    const params = {};
    if (this.selectedBloodGroup) params.bloodGroup = this.selectedBloodGroup;
    if (this.selectedCountry) params.country = this.selectedCountry;
    if (this.selectedState) params.state = this.selectedState;
    if (this.selectedDistrict) params.district = this.selectedDistrict;
    if (this.selectedMandal) params.mandal = this.selectedMandal;
    if (this.selectedVillage) params.village = this.selectedVillage;
    if (city) params.city = city;
    if (availableOnly) params.availability = 'AVAILABLE';

    try {
      const response = await API.get('/donors/search', params);
      if (loadingEl) loadingEl.classList.add('d-none');

      if (response && response.success && response.data) {
        this.donorsList = response.data;
        if (this.donorsList.length === 0) {
          if (noResultsEl) noResultsEl.classList.remove('d-none');
        } else {
          this.renderDonors(this.donorsList);
        }
        if (typeof DonorMap !== 'undefined') {
          DonorMap.renderDonors(this.donorsList);
        }
      }
    } catch (err) {
      if (loadingEl) loadingEl.classList.add('d-none');
      if (noResultsEl) noResultsEl.classList.remove('d-none');
      console.error('Failed to load donors:', err);
    }
  },

  renderDonors(donors) {
    const container = document.getElementById('donors-grid');
    if (!container) return;

    let html = '';
    donors.forEach(donor => {
      const isAvail = donor.availabilityStatus === 'AVAILABLE';
      const statusBadge = isAvail
        ? '<span class="status-badge-available"><span class="status-dot available"></span> Available</span>'
        : '<span class="status-badge-unavailable"><span class="status-dot unavailable"></span> Unavailable</span>';

      const lastDonation = donor.lastDonationDate 
        ? new Date(donor.lastDonationDate).toLocaleDateString()
        : 'First Time Donor';

      // Build hierarchical location display
      const locParts = [];
      if (donor.village) locParts.push(`<span class="fw-semibold text-dark">${this.escapeHtml(donor.village)}</span>`);
      if (donor.mandal) locParts.push(`<span>${this.escapeHtml(donor.mandal)} (M)</span>`);
      if (donor.district) locParts.push(`<span>${this.escapeHtml(donor.district)}</span>`);
      else if (donor.city) locParts.push(`<span>${this.escapeHtml(donor.city)}</span>`);
      if (donor.state) locParts.push(`<span class="text-secondary">${this.escapeHtml(donor.state)}</span>`);

      const locationMarkup = locParts.length > 0
        ? locParts.join(', ')
        : this.escapeHtml(donor.city || 'India');

      const cardColClass = this.currentViewMode === 'cards' ? 'col-md-6 col-lg-4 mb-4' : 'col-12 mb-3';
      html += `
        <div class="${cardColClass} donor-card-wrapper">
          <div class="donor-card shadow-sm h-100 d-flex flex-column">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-3">
                ${donor.profilePhoto ? `<img src="${this.escapeHtml(donor.profilePhoto)}" alt="${this.escapeHtml(donor.name)}" class="donor-card-avatar" onerror="this.style.display='none'">` : ''}
                  <div class="blood-badge">${donor.bloodGroupDisplay || donor.bloodGroup}</div>
                <div>
                  <h6 class="mb-0 fw-bold text-dark">${this.escapeHtml(donor.name)}</h6>
                  <small class="text-muted"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${this.escapeHtml(donor.city || donor.district || '')}</small>
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="btn btn-sm btn-locate-donor" onclick="App.locateDonorOnMap(${donor.id})" title="Locate on Radar Map">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>Map
                </button>
                ${statusBadge}
              </div>
            </div>

            <div class="donor-location-tag mb-3">
              <i class="bi bi-pin-map-fill text-danger me-1"></i> ${locationMarkup}
            </div>

            <div class="small text-secondary mb-3">
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span><i class="bi bi-telephone me-1 text-muted"></i>Contact:</span>
                <span class="fw-semibold text-dark">${this.escapeHtml(donor.contactNumber)}</span>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span><i class="bi bi-calendar2-check me-1 text-muted"></i>Last Donation:</span>
                <span class="text-dark">${lastDonation}</span>
              </div>
              <div class="d-flex justify-content-between py-1">
                <span><i class="bi bi-award me-1 text-muted"></i>Donations:</span>
                <span class="badge bg-danger-subtle text-danger fw-bold">${donor.totalDonations || 0} times</span>
              </div>
            </div>

            <div class="mt-auto pt-2">
              <button class="btn btn-blood-red w-100 btn-sm" onclick="App.openRequestModalForDonor(${donor.id}, '${this.escapeHtml(donor.name)}', '${donor.bloodGroup}', '${this.escapeHtml(donor.city)}')">
                <i class="bi bi-send-fill me-1"></i> Request Blood
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  // =========================================================================
  // Blood Request Handling
  // =========================================================================

  openGeneralRequestModal() {
    if (!Auth.isAuthenticated()) {
      this.showToast('Please sign in to post a blood request', 'warning');
      new bootstrap.Modal(document.getElementById('authModal')).show();
      return;
    }

    const modalEl = document.getElementById('bloodRequestModal');
    document.getElementById('blood-request-form').reset();
    document.getElementById('req-donor-id').value = '';
    document.getElementById('requestModalLabel').innerHTML = '<i class="bi bi-megaphone-fill text-danger me-2"></i>Post Emergency Blood Request';
    document.getElementById('req-donor-target-info').innerHTML = `
      <div class="alert alert-info small py-2 mb-3">
        <i class="bi bi-info-circle me-1"></i> This is an <strong>Open Request</strong>. Any available donor in your city will be able to see and respond.
      </div>
    `;

    // Pre-fill user contact if known
    if (Auth.currentUser?.phone) {
      document.getElementById('req-contact').value = Auth.currentUser.phone;
    }

    new bootstrap.Modal(modalEl).show();
  },

  openRequestModalForDonor(donorId, donorName, bloodGroup, city) {
    if (!Auth.isAuthenticated()) {
      this.showToast('Please sign in to send a blood request to this donor', 'warning');
      new bootstrap.Modal(document.getElementById('authModal')).show();
      return;
    }

    const modalEl = document.getElementById('bloodRequestModal');
    document.getElementById('blood-request-form').reset();
    document.getElementById('req-donor-id').value = donorId;
    document.getElementById('requestModalLabel').innerHTML = `<i class="bi bi-heart-pulse-fill text-danger me-2"></i>Request Blood from ${donorName}`;
    document.getElementById('req-donor-target-info').innerHTML = `
      <div class="alert alert-primary small py-2 mb-3">
        <i class="bi bi-person-check-fill me-1"></i> Direct request will be sent to <strong>${donorName}</strong> (${bloodGroup}, ${city}).
      </div>
    `;

    document.getElementById('req-blood-group').value = bloodGroup;
    document.getElementById('req-city').value = city;
    if (Auth.currentUser?.phone) {
      document.getElementById('req-contact').value = Auth.currentUser.phone;
    }

    new bootstrap.Modal(modalEl).show();
  },

  async openMyRequestsModal() {
    if (!Auth.isAuthenticated()) {
      new bootstrap.Modal(document.getElementById('authModal')).show();
      return;
    }

    const modalEl = document.getElementById('requestsModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    await this.loadSentRequests();
    await this.loadReceivedRequests();
  },

  async loadSentRequests() {
    const container = document.getElementById('sent-requests-list');
    container.innerHTML = '<div class="text-center py-4"><span class="spinner-border spinner-border-sm text-danger"></span> Loading sent requests...</div>';

    try {
      const res = await API.get('/requests/sent');
      if (res && res.success) {
        const requests = res.data;
        if (requests.length === 0) {
          container.innerHTML = '<div class="text-center py-4 text-muted"><i class="bi bi-inbox fs-2 d-block mb-2"></i>No blood requests sent yet.</div>';
          return;
        }

        let html = '';
        requests.forEach(req => {
          const badgeStatus = this.getStatusBadge(req.status);
          const badgeUrgency = this.getUrgencyBadge(req.urgencyLevel);
          const cancelBtn = req.status === 'PENDING'
            ? `<button class="btn btn-outline-danger btn-sm" onclick="App.cancelBloodRequest(${req.id})"><i class="bi bi-x-circle me-1"></i>Cancel</button>`
            : '';

          html += `
            <div class="request-card ${req.urgencyLevel ? req.urgencyLevel.toLowerCase() : 'medium'}">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="mb-0 fw-bold text-dark">${this.escapeHtml(req.patientName)} 
                    <span class="badge bg-danger ms-1">${req.bloodGroupDisplay || req.bloodGroup}</span>
                    <span class="badge bg-light text-dark border ms-1">${req.requiredUnits} Unit(s)</span>
                  </h6>
                  <small class="text-muted"><i class="bi bi-hospital me-1"></i>${this.escapeHtml(req.hospitalName)}, ${this.escapeHtml(req.city)}</small>
                </div>
                <div class="text-end">
                  ${badgeStatus}
                  <div class="mt-1">${badgeUrgency}</div>
                </div>
              </div>

              <div class="small text-secondary mb-2">
                <div><strong>Assigned To:</strong> ${this.escapeHtml(req.donorName || 'Open Request')}</div>
                ${req.additionalNotes ? `<div><strong>Notes:</strong> ${this.escapeHtml(req.additionalNotes)}</div>` : ''}
                <div class="text-muted"><i class="bi bi-clock me-1"></i>Created on: ${new Date(req.createdAt).toLocaleString()}</div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                ${cancelBtn}
              </div>
            </div>
          `;
        });
        container.innerHTML = html;
      }
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">${err.message || 'Failed to load sent requests'}</div>`;
    }
  },

  async loadReceivedRequests() {
    const container = document.getElementById('received-requests-list');
    container.innerHTML = '<div class="text-center py-4"><span class="spinner-border spinner-border-sm text-danger"></span> Loading received requests...</div>';

    try {
      const res = await API.get('/requests/received');
      if (res && res.success) {
        const requests = res.data;
        if (requests.length === 0) {
          container.innerHTML = '<div class="text-center py-4 text-muted"><i class="bi bi-bell-slash fs-2 d-block mb-2"></i>No incoming blood requests for you at this time.</div>';
          return;
        }

        let html = '';
        requests.forEach(req => {
          const badgeStatus = this.getStatusBadge(req.status);
          const badgeUrgency = this.getUrgencyBadge(req.urgencyLevel);

          let actionButtons = '';
          if (req.status === 'PENDING') {
            actionButtons = `
              <button class="btn btn-success btn-sm" onclick="App.updateRequestStatus(${req.id}, 'ACCEPTED')"><i class="bi bi-check-circle me-1"></i>Accept</button>
              <button class="btn btn-outline-danger btn-sm" onclick="App.updateRequestStatus(${req.id}, 'REJECTED')"><i class="bi bi-x-circle me-1"></i>Decline</button>
            `;
          } else if (req.status === 'ACCEPTED') {
            actionButtons = `
              <button class="btn btn-primary btn-sm" onclick="App.updateRequestStatus(${req.id}, 'COMPLETED')"><i class="bi bi-check2-all me-1"></i>Mark Completed</button>
            `;
          }

          html += `
            <div class="request-card ${req.urgencyLevel ? req.urgencyLevel.toLowerCase() : 'medium'}">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 class="mb-0 fw-bold text-dark">Patient: ${this.escapeHtml(req.patientName)}
                    <span class="badge bg-danger ms-1">${req.bloodGroupDisplay || req.bloodGroup}</span>
                    <span class="badge bg-light text-dark border ms-1">${req.requiredUnits} Unit(s)</span>
                  </h6>
                  <small class="text-muted"><i class="bi bi-hospital me-1"></i>${this.escapeHtml(req.hospitalName)}, ${this.escapeHtml(req.city)}</small>
                </div>
                <div class="text-end">
                  ${badgeStatus}
                  <div class="mt-1">${badgeUrgency}</div>
                </div>
              </div>

              <div class="small text-secondary mb-2">
                <div><strong>Requester:</strong> ${this.escapeHtml(req.requesterName)} (${this.escapeHtml(req.requesterPhone)})</div>
                ${req.additionalNotes ? `<div><strong>Notes:</strong> ${this.escapeHtml(req.additionalNotes)}</div>` : ''}
                <div class="text-muted"><i class="bi bi-clock me-1"></i>Requested on: ${new Date(req.createdAt).toLocaleString()}</div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                ${actionButtons}
              </div>
            </div>
          `;
        });
        container.innerHTML = html;
      }
    } catch (err) {
      container.innerHTML = `<div class="alert alert-danger">${err.message || 'Failed to load received requests'}</div>`;
    }
  },

  async updateRequestStatus(requestId, status) {
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status });
      if (res && res.success) {
        this.showToast(`Request marked as ${status}`, 'success');
        this.loadReceivedRequests();
        this.loadSentRequests();
        this.loadStats();
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to update request status', 'danger');
    }
  },

  async cancelBloodRequest(requestId) {
    if (!confirm('Are you sure you want to cancel this blood request?')) return;

    try {
      const res = await API.delete(`/requests/${requestId}`);
      if (res && res.success) {
        this.showToast('Blood request cancelled', 'info');
        this.loadSentRequests();
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to cancel request', 'danger');
    }
  },

  // =========================================================================
  // User Profile & Donor Profile
  // =========================================================================

  async openProfileModal() {
    if (!Auth.isAuthenticated()) {
      new bootstrap.Modal(document.getElementById('authModal')).show();
      return;
    }

    try {
      const res = await API.get('/users/profile');
      if (res && res.success) {
        const user = res.data;
        document.getElementById('profile-name').value = user.name || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-phone').value = user.phone || '';
        document.getElementById('profile-role').textContent = user.role;
        document.getElementById('profile-status').textContent = user.status;

        new bootstrap.Modal(document.getElementById('profileModal')).show();
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to load profile', 'danger');
    }
  },

  async openDonorRegistrationModal() {
    if (!Auth.isAuthenticated()) {
      new bootstrap.Modal(document.getElementById('authModal')).show();
      return;
    }

    const modalEl = document.getElementById('donorModal');
    const form = document.getElementById('donor-profile-form');
    form.reset();

    // Default contact to user phone
    document.getElementById('donor-contact').value = Auth.currentUser?.phone || '';

    if (Auth.isDonor()) {
      // Load current donor details
      try {
        const res = await API.get('/donors/my-profile');
        if (res && res.success) {
          const donor = res.data;
          document.getElementById('donorModalLabel').innerHTML = '<i class="bi bi-pencil-square text-danger me-2"></i>Edit Donor Profile';
          document.getElementById('donor-is-update').value = 'true';
          document.getElementById('donor-blood-group').value = donor.bloodGroup;
          document.getElementById('donor-address').value = donor.address || '';
          document.getElementById('donor-contact').value = donor.contactNumber;
          document.getElementById('donor-last-date').value = donor.lastDonationDate || '';
          document.getElementById('donor-availability').value = donor.availabilityStatus;
          if (donor.profilePhoto) {
            const preview = document.getElementById('donor-photo-preview');
            if (preview) preview.src = donor.profilePhoto;
            const urlInput = document.getElementById('donor-profile-photo-url');
            if (urlInput) urlInput.value = donor.profilePhoto;
            const statusEl = document.getElementById('donor-photo-status');
            if (statusEl) statusEl.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i>Current photo active</span>';
          }

          if (typeof DonorMap !== 'undefined') {
            DonorMap.initPicker(donor.latitude, donor.longitude);
          }

          if (typeof Locations !== 'undefined') {
            Locations.setupFullCascading({
              country: 'India',
              stateEl: document.getElementById('donor-state'),
              districtEl: document.getElementById('donor-district'),
              mandalEl: document.getElementById('donor-mandal'),
              villageEl: document.getElementById('donor-village'),
              initialValues: {
                state: donor.state || '',
                district: donor.district || '',
                mandal: donor.mandal || '',
                village: donor.village || ''
              }
            });
          }
        }
      } catch (err) {
        console.warn('Could not load donor profile:', err);
      }
    } else {
      document.getElementById('donorModalLabel').innerHTML = '<i class="bi bi-heart-pulse-fill text-danger me-2"></i>Register as Blood Donor';
      document.getElementById('donor-is-update').value = 'false';
        const preview = document.getElementById('donor-photo-preview');
        if (preview) {
          preview.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'/%3E%3Cpath fill-rule='evenodd' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'/%3E%3C/svg%3E";
        }
        const urlInput = document.getElementById('donor-profile-photo-url');
        if (urlInput) urlInput.value = '';
        const fileInput = document.getElementById('donor-photo-file');
        if (fileInput) fileInput.value = '';
        const statusEl = document.getElementById('donor-photo-status');
        if (statusEl) statusEl.innerHTML = 'Choose a PNG, JPG, or WEBP photo (Max 5MB)';

      if (typeof DonorMap !== 'undefined') {
        DonorMap.initPicker();
      }

      if (typeof Locations !== 'undefined') {
        Locations.setupFullCascading({
          country: 'India',
          stateEl: document.getElementById('donor-state'),
          districtEl: document.getElementById('donor-district'),
          mandalEl: document.getElementById('donor-mandal'),
          villageEl: document.getElementById('donor-village'),
          initialValues: {}
        });
      }
    }

    new bootstrap.Modal(modalEl).show();
  },

  async toggleDonorAvailability() {
    try {
      const res = await API.patch('/donors/toggle-availability');
      if (res && res.success) {
        const status = res.data.availabilityStatus;
        this.showToast(`Your availability status has been updated to: ${status}`, 'success');
        this.loadDonors();
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to toggle availability', 'danger');
    }
  },

  // =========================================================================
  // Admin Module
  // =========================================================================

  async openAdminDashboard() {
    if (!Auth.isAdmin()) {
      this.showToast('Access denied: Administrator privileges required', 'danger');
      return;
    }

    const modalEl = document.getElementById('adminModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    await this.loadAdminStats();
    await this.loadAdminUsers();
    await this.loadAdminDonors();
    await this.loadAdminRequests();
  },

  async loadAdminStats() {
    try {
      const res = await API.get('/admin/dashboard');
      if (res && res.success) {
        const stats = res.data;
        document.getElementById('admin-stat-users').textContent = stats.totalUsers;
        document.getElementById('admin-stat-donors').textContent = stats.totalDonors;
        document.getElementById('admin-stat-available').textContent = stats.availableDonors;
        document.getElementById('admin-stat-requests').textContent = stats.totalBloodRequests;

        // Render blood group breakdown
        const bgContainer = document.getElementById('admin-bg-breakdown');
        if (bgContainer && stats.bloodGroupCounts) {
          let html = '';
          const total = stats.totalDonors || 1;
          for (const [group, count] of Object.entries(stats.bloodGroupCounts)) {
            const percent = Math.round((count / total) * 100);
            html += `
              <div class="mb-2">
                <div class="d-flex justify-content-between small fw-semibold">
                  <span>${group}</span>
                  <span>${count} (${percent}%)</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-danger" role="progressbar" style="width: ${percent}%;"></div>
                </div>
              </div>
            `;
          }
          bgContainer.innerHTML = html;
        }
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  },

  async loadAdminUsers() {
    const tbody = document.getElementById('admin-users-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3"><span class="spinner-border spinner-border-sm text-danger"></span> Loading users...</td></tr>';

    try {
      const res = await API.get('/admin/users');
      if (res && res.success) {
        const users = res.data;
        let html = '';
        users.forEach(user => {
          const isBlocked = user.status === 'BLOCKED';
          const statusBadge = isBlocked
            ? '<span class="badge bg-danger">Blocked</span>'
            : '<span class="badge bg-success">Active</span>';

          const actionBtn = isBlocked
            ? `<button class="btn btn-outline-success btn-sm" onclick="App.toggleUserBlock(${user.id}, 'ACTIVE')"><i class="bi bi-unlock me-1"></i>Activate</button>`
            : `<button class="btn btn-outline-danger btn-sm" onclick="App.toggleUserBlock(${user.id}, 'BLOCKED')" ${user.role === 'ROLE_ADMIN' ? 'disabled' : ''}><i class="bi bi-slash-circle me-1"></i>Block</button>`;

          html += `
            <tr>
              <td>#${user.id}</td>
              <td class="fw-semibold">${this.escapeHtml(user.name)}</td>
              <td>${this.escapeHtml(user.email)}</td>
              <td>${this.escapeHtml(user.phone)}</td>
              <td><span class="badge bg-dark">${user.role}</span></td>
              <td>${statusBadge}</td>
              <td>${actionBtn}</td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">${err.message}</td></tr>`;
    }
  },

  async toggleUserBlock(userId, status) {
    try {
      const res = await API.put(`/admin/users/${userId}/status`, { status });
      if (res && res.success) {
        this.showToast(`User status updated to ${status}`, 'success');
        this.loadAdminUsers();
        this.loadAdminStats();
      }
    } catch (err) {
      this.showToast(err.message || 'Failed to update user status', 'danger');
    }
  },

  async loadAdminDonors() {
    const tbody = document.getElementById('admin-donors-tbody');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3"><span class="spinner-border spinner-border-sm text-danger"></span> Loading donors...</td></tr>';

    try {
      const res = await API.get('/admin/donors');
      if (res && res.success) {
        const donors = res.data;
        let html = '';
        donors.forEach(donor => {
          const availBadge = donor.availabilityStatus === 'AVAILABLE'
            ? '<span class="badge bg-success">Available</span>'
            : '<span class="badge bg-secondary">Unavailable</span>';

          html += `
            <tr>
              <td>#${donor.id}</td>
              <td class="fw-semibold">${this.escapeHtml(donor.name)}</td>
              <td><span class="badge bg-danger">${donor.bloodGroupDisplay || donor.bloodGroup}</span></td>
              <td>${this.escapeHtml(donor.city)}</td>
              <td>${this.escapeHtml(donor.contactNumber)}</td>
              <td>${donor.totalDonations || 0} times</td>
              <td>${availBadge}</td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-danger text-center">${err.message}</td></tr>`;
    }
  },

  async loadAdminRequests() {
    const tbody = document.getElementById('admin-requests-tbody');
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-3"><span class="spinner-border spinner-border-sm text-danger"></span> Loading requests...</td></tr>';

    try {
      const res = await API.get('/admin/requests');
      if (res && res.success) {
        const requests = res.data;
        let html = '';
        requests.forEach(req => {
          html += `
            <tr>
              <td>#${req.id}</td>
              <td class="fw-semibold">${this.escapeHtml(req.patientName)}</td>
              <td><span class="badge bg-danger">${req.bloodGroupDisplay || req.bloodGroup}</span></td>
              <td>${this.escapeHtml(req.hospitalName)}, ${this.escapeHtml(req.city)}</td>
              <td>${this.escapeHtml(req.donorName || 'Open')}</td>
              <td>${this.getUrgencyBadge(req.urgencyLevel)}</td>
              <td>${this.getStatusBadge(req.status)}</td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
      }
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">${err.message}</td></tr>`;
    }
  },

  // =========================================================================
  // Helpers & UI Utilities
  // =========================================================================

  getStatusBadge(status) {
    switch (status) {
      case 'PENDING': return '<span class="badge badge-status-pending"><i class="bi bi-hourglass-split me-1"></i>Pending</span>';
      case 'ACCEPTED': return '<span class="badge badge-status-accepted"><i class="bi bi-check-circle me-1"></i>Accepted</span>';
      case 'REJECTED': return '<span class="badge badge-status-rejected"><i class="bi bi-x-circle me-1"></i>Rejected</span>';
      case 'COMPLETED': return '<span class="badge badge-status-completed"><i class="bi bi-check-all me-1"></i>Completed</span>';
      case 'CANCELLED': return '<span class="badge badge-status-cancelled"><i class="bi bi-slash-circle me-1"></i>Cancelled</span>';
      default: return `<span class="badge bg-secondary">${status}</span>`;
    }
  },

  getUrgencyBadge(urgency) {
    switch (urgency) {
      case 'CRITICAL': return '<span class="badge badge-urgency-critical"><i class="bi bi-exclamation-triangle-fill me-1"></i>Critical</span>';
      case 'HIGH': return '<span class="badge badge-urgency-high"><i class="bi bi-exclamation-circle-fill me-1"></i>High</span>';
      case 'MEDIUM': return '<span class="badge badge-urgency-medium">Medium</span>';
      case 'LOW': return '<span class="badge badge-urgency-low">Low</span>';
      default: return `<span class="badge bg-light text-dark">${urgency}</span>`;
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'danger' ? 'text-bg-danger' : 
                   type === 'success' ? 'text-bg-success' : 
                   type === 'warning' ? 'text-bg-warning' : 'text-bg-primary';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center ${bgClass} border-0 shadow`;
    toastEl.id = toastId;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-medium">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
      toastEl.remove();
    });
  },

  // =========================================================================
  // Donor Profile Photo Handling
  // =========================================================================

  previewDonorPhoto(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Photo size must be less than 5MB', 'warning');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('donor-photo-preview');
        if (preview) preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  },

  async uploadDonorPhoto() {
    if (!Auth.isAuthenticated()) {
      this.showToast('Please sign in to upload a profile photo', 'warning');
      return;
    }

    const fileInput = document.getElementById('donor-photo-file');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      this.showToast('Please select a photo file first', 'warning');
      return;
    }

    const file = fileInput.files[0];
    const btn = document.getElementById('btn-upload-photo');
    const statusEl = document.getElementById('donor-photo-status');

    const formData = new FormData();
    formData.append('file', file);

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Uploading...';
      }
      if (statusEl) {
        statusEl.innerHTML = '<span class="text-primary"><i class="bi bi-arrow-repeat spin me-1"></i>Uploading photo...</span>';
      }

      const res = await API.upload('/donors/profile-photo', formData);
      if (res && res.success && res.data) {
        const photoUrl = res.data.profilePhoto;
        document.getElementById('donor-profile-photo-url').value = photoUrl;
        const preview = document.getElementById('donor-photo-preview');
        if (preview) preview.src = photoUrl;
        if (statusEl) {
          statusEl.innerHTML = '<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Photo uploaded successfully!</span>';
        }
        this.showToast('Profile photo uploaded successfully!', 'success');
        this.loadDonors();
      }
    } catch (err) {
      console.error('Photo upload failed:', err);
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i>${err.message || 'Upload failed'}</span>`;
      }
      this.showToast(err.message || 'Failed to upload photo', 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-upload me-1"></i>Upload Profile Photo';
      }
    }
  },
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
