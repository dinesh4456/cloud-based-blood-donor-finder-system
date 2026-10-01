/**
 * Blood Donor Finder System - Authentication State Management
 */

const Auth = {
  currentUser: null,

  init() {
    this.currentUser = API.getUser();
    this.updateUI();

    window.addEventListener('auth:expired', () => {
      this.currentUser = null;
      this.updateUI();
      App.showToast('Session expired. Please sign in again.', 'warning');
      const authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
      if (!authModal) {
        new bootstrap.Modal(document.getElementById('authModal')).show();
      }
    });
  },

  isAuthenticated() {
    return !!API.getToken() && !!this.currentUser;
  },

  isAdmin() {
    return this.isAuthenticated() && this.currentUser?.role === 'ROLE_ADMIN';
  },

  isDonor() {
    return this.isAuthenticated() && (this.currentUser?.isDonor === true || this.currentUser?.role === 'ROLE_DONOR');
  },

  async login(email, password) {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response && response.success) {
        const authData = response.data;
        API.setToken(authData.token);
        this.currentUser = authData;
        API.setUser(authData);
        this.updateUI();
        return authData;
      }
      throw new Error(response?.message || 'Login failed');
    } catch (err) {
      throw err;
    }
  },

  async register(name, email, password, phone, role) {
    try {
      const payload = { name, email, password, phone, role: role || 'ROLE_USER' };
      const response = await API.post('/auth/register', payload);
      if (response && response.success) {
        const authData = response.data;
        API.setToken(authData.token);
        this.currentUser = authData;
        API.setUser(authData);
        this.updateUI();
        return authData;
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (err) {
      throw err;
    }
  },

  logout() {
    API.clearAuth();
    this.currentUser = null;
    this.updateUI();
    App.showToast('You have been logged out successfully.', 'info');
    // Refresh page sections if in admin or my-requests
    if (window.location.hash.includes('admin') || window.location.hash.includes('requests')) {
      window.location.hash = '#search';
    }
    App.loadDonors();
  },

  updateUI() {
    const loggedOutNav = document.getElementById('nav-logged-out');
    const loggedInNav = document.getElementById('nav-logged-in');
    const navUserName = document.getElementById('nav-user-name');
    const navUserRole = document.getElementById('nav-user-role');
    const navAdminLink = document.getElementById('nav-admin-link');
    const navDonorDashboard = document.getElementById('nav-donor-dashboard');
    const navBecomeDonor = document.getElementById('nav-become-donor');
    const navRequests = document.getElementById('nav-requests');

    if (this.isAuthenticated()) {
      if (loggedOutNav) loggedOutNav.classList.add('d-none');
      if (loggedInNav) loggedInNav.classList.remove('d-none');

      if (navUserName) navUserName.textContent = this.currentUser.name || 'My Account';
      if (navUserRole) {
        let roleBadge = 'User';
        let badgeClass = 'bg-secondary';
        if (this.currentUser.role === 'ROLE_ADMIN') {
          roleBadge = 'Admin';
          badgeClass = 'bg-dark';
        } else if (this.currentUser.role === 'ROLE_DONOR' || this.currentUser.isDonor) {
          roleBadge = 'Donor';
          badgeClass = 'bg-danger';
        }
        navUserRole.className = `badge ${badgeClass} ms-1`;
        navUserRole.textContent = roleBadge;
      }

      if (navAdminLink) {
        if (this.isAdmin()) {
          navAdminLink.classList.remove('d-none');
        } else {
          navAdminLink.classList.add('d-none');
        }
      }

      if (navDonorDashboard && navBecomeDonor) {
        if (this.isDonor()) {
          navDonorDashboard.classList.remove('d-none');
          navBecomeDonor.classList.add('d-none');
        } else {
          navDonorDashboard.classList.add('d-none');
          navBecomeDonor.classList.remove('d-none');
        }
      }

      if (navRequests) navRequests.classList.remove('d-none');
    } else {
      if (loggedOutNav) loggedOutNav.classList.remove('d-none');
      if (loggedInNav) loggedInNav.classList.add('d-none');
      if (navAdminLink) navAdminLink.classList.add('d-none');
      if (navDonorDashboard) navDonorDashboard.classList.add('d-none');
      if (navBecomeDonor) navBecomeDonor.classList.remove('d-none');
      if (navRequests) navRequests.classList.add('d-none');
    }
  }
};
