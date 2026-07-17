// ─── MechTech Frontend Router & Controller ───

// State Management
const state = {
  currentRoute: 'home',
  categories: [],
  cities: [],
  activeBooking: {
    category: null,
    service: null,
    city: '',
    area: '',
    pincode: '',
    vehicleInfo: { make: '', model: '', year: '' },
    provider: null,
    slot: '',
    paymentMode: '',
    bookingId: ''
  },
  bookingStep: 1,
  chatMessages: [
    { sender: 'bot', text: 'Hey there! 👋 Welcome to MechTech. How can I help you today?\n\nConnect your backend service to chat with the assistant or book services!' }
  ]
};

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

// Router
function initRouter() {
  const handleRoute = () => {
    const hash = window.location.hash.slice(1) || 'home';
    state.currentRoute = hash;
    updateNavActiveState(hash);
    renderPage(hash);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('load', handleRoute);
}

function navigateTo(route) {
  window.location.hash = route;
}

function updateNavActiveState(route) {
  const links = document.querySelectorAll('#nav-links a');
  links.forEach(link => {
    if (link.getAttribute('data-route') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Global Loader helper
function showLoading(container, text = 'Loading data from backend...') {
  container.innerHTML = `
    <div style="text-align:center; padding:60px 20px;">
      <div style="border: 4px solid var(--glass-border); border-top: 4px solid var(--accent); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
      <p style="color:var(--text2); font-size:0.9rem;">${text}</p>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
}

function showBackendOfflineMsg(container, customMsg = 'Connect your backend API server to view listing details.') {
  container.innerHTML = `
    <div class="empty-state">
      <div class="emoji" style="font-size: 2.5rem; margin-bottom: 12px;">🔌</div>
      <h3 style="margin-bottom:8px;">Backend Offline</h3>
      <p style="color: var(--text2); max-width: 400px; margin: 0 auto 20px;">${customMsg}</p>
      <button class="btn btn-secondary btn-sm" onclick="window.location.reload()"><i data-lucide="refresh-cw"></i> Retry Connection</button>
    </div>
  `;
  lucide.createIcons();
}

// Page Render Controller
async function renderPage(route) {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = ''; 

  // Pre-load base lists if empty
  if (state.categories.length === 0) {
    state.categories = await MechTechAPI.getCategories();
  }
  if (state.cities.length === 0) {
    state.cities = await MechTechAPI.getCities();
  }

  switch (route) {
    case 'home':
      appContainer.appendChild(await createHomePage());
      break;
    case 'services':
      appContainer.appendChild(await createServicesPage());
      break;
    case 'booking':
      appContainer.appendChild(await createBookingPage());
      break;
    case 'track':
      appContainer.appendChild(createTrackerPage());
      break;
    default:
      appContainer.appendChild(await createHomePage());
  }
  lucide.createIcons();
}

// ─── TOAST NOTIFICATION SYSTEM ───
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ─── HOME PAGE ───
async function createHomePage() {
  const page = document.createElement('div');
  page.className = 'fade-in';

  // Hero Section
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="container">
      <h1>Verified Local Experts for <span>Home & Auto Services</span></h1>
      <p>On-demand professional servicing, appliances repair, plumbing, and general maintenance in India. Transparent pricing & 100% satisfaction guaranteed.</p>
      <a href="#booking" class="hero-cta">Book Service Now <i data-lucide="arrow-right"></i></a>
    </div>
  `;
  page.appendChild(hero);

  // Category Cards Grid
  const categoriesSection = document.createElement('section');
  categoriesSection.className = 'section';
  categoriesSection.innerHTML = `
    <div class="container">
      <h2 class="section-title">Explore Our Categories</h2>
      <p class="section-sub">Select a category to find specialized local professionals near you</p>
      <div id="home-categories-container"></div>
    </div>
  `;
  page.appendChild(categoriesSection);

  const containerGrid = categoriesSection.querySelector('#home-categories-container');
  
  if (state.categories.length === 0) {
    showBackendOfflineMsg(containerGrid, 'No service categories found. Start your backend database to populate list.');
  } else {
    const grid = document.createElement('div');
    grid.className = 'cat-grid';
    state.categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.style.setProperty('--cat-color', cat.color || '#6366f1');
      card.innerHTML = `
        <div class="cat-icon" style="color: ${cat.color || '#6366f1'}; background: ${(cat.color || '#6366f1')}15">
          <i data-lucide="${cat.icon || 'wrench'}"></i>
        </div>
        <h3>${cat.name}</h3>
        <p>${cat.description || ''}</p>
      `;
      card.addEventListener('click', () => {
        state.activeBooking.category = cat;
        state.bookingStep = 2; // skip category choice
        navigateTo('booking');
      });
      grid.appendChild(card);
    });
    containerGrid.appendChild(grid);
  }

  // How it works
  const howItWorks = document.createElement('section');
  howItWorks.className = 'section';
  howItWorks.style.background = 'var(--glass)';
  howItWorks.innerHTML = `
    <div class="container">
      <h2 class="section-title">How MechTech Works</h2>
      <p class="section-sub">Getting your task done is simple, reliable, and secure</p>
      <div class="how-grid">
        <div class="how-step">
          <div class="how-num">1</div>
          <h3>Select Service & Category</h3>
          <p>Choose from our list of standard repair, installation, and maintenance options.</p>
        </div>
        <div class="how-step">
          <div class="how-num">2</div>
          <h3>Choose Local Provider</h3>
          <p>Browse nearby verified experts sorted by real-time rating, price, and ETA.</p>
        </div>
        <div class="how-step">
          <div class="how-num">3</div>
          <h3>Relax & Pay Later</h3>
          <p>Confirm the slot. Pay securely via UPI, or opt for Cash on Delivery after completion.</p>
        </div>
      </div>
    </div>
  `;
  page.appendChild(howItWorks);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4>⚡ MechTech</h4>
          <p style="font-size: 0.8rem; color: var(--text3);">India's premium on-demand marketplace for quality home maintenance & auto repair services.</p>
        </div>
        <div>
          <h4>Services</h4>
          <a href="#services">Automobiles</a>
          <a href="#services">Appliances</a>
          <a href="#services">Mobile & Electronics</a>
          <a href="#services">Plumbing & Electrical</a>
          <a href="#services">General Maintenance</a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 MechTech Marketplace. All rights reserved.
      </div>
    </div>
  `;
  page.appendChild(footer);

  return page;
}

// ─── SERVICES BROWSER PAGE ───
async function createServicesPage() {
  const page = document.createElement('div');
  page.className = 'container section fade-in';

  // Title
  const header = document.createElement('div');
  header.style.marginBottom = '32px';
  header.innerHTML = `
    <h2>Find Verified Local Experts</h2>
    <p style="color: var(--text2)">Explore services and real-time availability of providers in your location</p>
  `;
  page.appendChild(header);

  // If no backend config found, warn directly
  if (state.cities.length === 0 || state.categories.length === 0) {
    showBackendOfflineMsg(page, 'Service configuration and cities data could not be fetched from API. Connect backend server.');
    return page;
  }

  // Filter Bar controls
  const filterSection = document.createElement('div');
  filterSection.innerHTML = `
    <div class="filter-bar">
      <select class="form-input" id="service-city-select" style="max-width: 150px;">
        ${state.cities.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      </select>
      <select class="form-input" id="service-area-select" style="max-width: 180px;">
        <option value="">All Areas</option>
      </select>
      <select class="form-input" id="service-sort-select" style="max-width: 150px;">
        <option value="rating">Top Rated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="eta">Fastest ETA</option>
      </select>
    </div>
    <div class="filter-pills" id="category-filter-pills" style="margin-bottom: 24px;">
      <span class="filter-pill active" data-cat="all">All Services</span>
      ${state.categories.map(c => `<span class="filter-pill" data-cat="${c.id}">${c.name}</span>`).join('')}
    </div>
  `;
  page.appendChild(filterSection);

  // Provider Grid mount
  const gridContainer = document.createElement('div');
  gridContainer.className = 'provider-grid';
  gridContainer.id = 'services-provider-grid';
  page.appendChild(gridContainer);

  const citySelect = filterSection.querySelector('#service-city-select');
  const areaSelect = filterSection.querySelector('#service-area-select');
  const sortSelect = filterSection.querySelector('#service-sort-select');
  const categoryPills = filterSection.querySelectorAll('.filter-pill');

  let activeCat = 'all';

  const populateAreas = () => {
    const selectedCity = state.cities.find(c => c.name === citySelect.value);
    areaSelect.innerHTML = '<option value="">All Areas</option>';
    if (selectedCity && selectedCity.areas) {
      selectedCity.areas.forEach(area => {
        const opt = document.createElement('option');
        opt.value = area;
        opt.textContent = area;
        areaSelect.appendChild(opt);
      });
    }
  };

  const updateProviderList = async () => {
    showLoading(gridContainer, 'Loading matched providers...');
    
    const filters = {
      categoryId: activeCat,
      city: citySelect.value,
      area: areaSelect.value,
      sort: sortSelect.value
    };

    const providers = await MechTechAPI.getProviders(filters);
    gridContainer.innerHTML = '';

    if (providers.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="emoji">🔍</div>
          <h3>No Providers Found</h3>
          <p>No active providers were returned by the API for your query filters.</p>
        </div>
      `;
      return;
    }

    providers.forEach(p => {
      const card = document.createElement('div');
      card.className = 'provider-card';
      const badgeClass = p.isAvailable ? 'badge-available' : 'badge-unavailable';
      const badgeText = p.isAvailable ? 'Available Now' : 'Unavailable (Busy)';
      
      card.innerHTML = `
        <div class="provider-header">
          <div class="provider-avatar">${p.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div class="provider-name">${p.name}</div>
            <div class="provider-exp">${p.experience || ''} Exp • ${p.area}</div>
          </div>
        </div>
        <div class="provider-rating">
          <span class="stars">★ ${p.rating}</span>
          <span class="count">(${p.reviews || 0} reviews)</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text2); margin-bottom: 12px;">
          <strong>Specialties:</strong> ${p.specialties ? p.specialties.join(', ') : ''}
        </div>
        <div class="provider-details">
          <div class="provider-price">₹${p.basePrice} <span>Base Price</span></div>
          <div class="provider-eta">${p.isAvailable ? `ETA: ${p.etaMinutes} mins` : 'Next slot available'}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
          <span class="provider-badge ${badgeClass}">
            <span class="badge-dot"></span>${badgeText}
          </span>
          <button class="btn btn-primary btn-sm" id="book-p-${p.id}">Book Now</button>
        </div>
      `;

      card.querySelector(`#book-p-${p.id}`).addEventListener('click', () => {
        state.activeBooking.category = state.categories.find(c => c.id === p.categoryId);
        state.activeBooking.city = p.city;
        state.activeBooking.area = p.area;
        state.activeBooking.provider = p;
        state.bookingStep = 4; // jump to slot page
        navigateTo('booking');
      });

      gridContainer.appendChild(card);
    });
    lucide.createIcons();
  };

  citySelect.addEventListener('change', () => {
    populateAreas();
    updateProviderList();
  });

  areaSelect.addEventListener('change', updateProviderList);
  sortSelect.addEventListener('change', updateProviderList);

  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.getAttribute('data-cat');
      updateProviderList();
    });
  });

  populateAreas();
  await updateProviderList();

  return page;
}

// ─── BOOKING WIZARD PAGE (6 Steps) ───
async function createBookingPage() {
  const page = document.createElement('div');
  page.className = 'container fade-in';

  if (state.categories.length === 0 || state.cities.length === 0) {
    showBackendOfflineMsg(page, 'Booking service configuration must be loaded from API. Connect backend server.');
    return page;
  }

  const wizard = document.createElement('div');
  wizard.className = 'wizard';
  
  const stepsDef = [
    { s: 1, name: 'Category' },
    { s: 2, name: 'Location' },
    { s: 3, name: 'Provider' },
    { s: 4, name: 'Confirm Slot' },
    { s: 5, name: 'Payment' },
    { s: 6, name: 'Receipt' }
  ];

  const buildProgress = () => {
    let html = '<div class="wizard-progress">';
    stepsDef.forEach((step, idx) => {
      let stepClass = '';
      if (state.bookingStep === step.s) stepClass = 'active';
      else if (state.bookingStep > step.s) stepClass = 'done';
      
      html += `<div class="wizard-step-dot ${stepClass}" title="${step.name}">${step.s}</div>`;
      if (idx < stepsDef.length - 1) {
        let lineClass = state.bookingStep > step.s ? 'done' : '';
        html += `<div class="wizard-line ${lineClass}"></div>`;
      }
    });
    html += '</div>';
    return html;
  };

  wizard.innerHTML = buildProgress();

  const wizardBody = document.createElement('div');
  wizardBody.className = 'wizard-body';
  wizard.appendChild(wizardBody);

  const renderStep = async () => {
    wizardBody.innerHTML = '';
    
    switch (state.bookingStep) {
      case 1:
        renderStep1(wizardBody);
        break;
      case 2:
        renderStep2(wizardBody);
        break;
      case 3:
        await renderStep3(wizardBody);
        break;
      case 4:
        renderStep4(wizardBody);
        break;
      case 5:
        renderStep5(wizardBody);
        break;
      case 6:
        await renderStep6(wizardBody);
        break;
    }
    
    // Action Buttons
    if (state.bookingStep < 6) {
      const actions = document.createElement('div');
      actions.className = 'wizard-actions';
      
      if (state.bookingStep > 1) {
        const btnBack = document.createElement('button');
        btnBack.className = 'btn btn-secondary';
        btnBack.innerHTML = '<i data-lucide="arrow-left"></i> Back';
        btnBack.addEventListener('click', () => {
          if (state.bookingStep === 4 && !state.activeBooking.area) {
            state.bookingStep = 2;
          } else {
            state.bookingStep--;
          }
          wizard.innerHTML = buildProgress();
          wizard.appendChild(wizardBody);
          renderStep();
          lucide.createIcons();
        });
        actions.appendChild(btnBack);
      }
      
      if (state.bookingStep === 1 || state.bookingStep === 5) {
        const btnNext = document.createElement('button');
        btnNext.className = 'btn btn-primary';
        btnNext.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
        btnNext.addEventListener('click', () => {
          if (validateCurrentStep()) {
            state.bookingStep++;
            wizard.innerHTML = buildProgress();
            wizard.appendChild(wizardBody);
            renderStep();
            lucide.createIcons();
          }
        });
        actions.appendChild(btnNext);
      }
      
      wizardBody.appendChild(actions);
    }
  };

  const validateCurrentStep = () => {
    if (state.bookingStep === 1 && !state.activeBooking.category) {
      showToast('Please select a service category', 'error');
      return false;
    }
    if (state.bookingStep === 5 && !state.activeBooking.paymentMode) {
      showToast('Please select a payment preference', 'error');
      return false;
    }
    return true;
  };

  // STEP 1: CATEGORY SELECTION
  const renderStep1 = (container) => {
    container.innerHTML = `
      <h3 class="wizard-title">What service category do you need?</h3>
      <p class="wizard-sub">Select one category to begin booking your verified helper</p>
      <div class="service-grid" id="w-categories-grid"></div>
    `;
    
    const catGrid = container.querySelector('#w-categories-grid');
    state.categories.forEach(cat => {
      const chip = document.createElement('div');
      chip.className = `service-chip ${state.activeBooking.category?.id === cat.id ? 'selected' : ''}`;
      chip.innerHTML = `
        <div class="sname">${cat.name}</div>
        <div class="sprice">${cat.services ? cat.services.length : 0} services</div>
      `;
      chip.addEventListener('click', () => {
        state.activeBooking.category = cat;
        state.activeBooking.service = null;
        state.activeBooking.provider = null;
        
        container.querySelectorAll('.service-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
      catGrid.appendChild(chip);
    });
  };

  // STEP 2: LOCATION & SERVICE/VEHICLE INPUT
  const renderStep2 = (container) => {
    const isAuto = state.activeBooking.category?.id === 'automobiles';
    
    container.innerHTML = `
      <h3 class="wizard-title">Provide service details & location</h3>
      <p class="wizard-sub">We need your pincode and specific details to match local providers</p>
      
      <div class="form-group">
        <label class="form-label">Select City</label>
        <select class="form-input" id="w-city">
          ${state.cities.map(c => `<option value="${c.name}" ${state.activeBooking.city === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Select Area</label>
        <select class="form-input" id="w-area"></select>
      </div>

      <div class="form-group">
        <label class="form-label">Pincode</label>
        <input type="text" class="form-input" id="w-pincode" placeholder="Enter 6-digit Pincode" maxlength="6" value="${state.activeBooking.pincode}">
      </div>

      <div class="form-group">
        <label class="form-label">Select Service</label>
        <select class="form-input" id="w-service">
          <option value="">-- Select Specific Service --</option>
          ${state.activeBooking.category?.services ? state.activeBooking.category.services.map(s => `
            <option value="${s.id}" ${state.activeBooking.service?.id === s.id ? 'selected' : ''}>${s.name} (Base: ₹${s.basePrice})</option>
          `).join('') : ''}
        </select>
      </div>

      <div id="vehicle-details-container" style="display: ${isAuto ? 'block' : 'none'}; border-top: 1px solid var(--glass-border); padding-top: 16px; margin-top: 16px;">
        <h4 style="margin-bottom:12px; font-size:0.95rem;">Automobile Info <span style="color:var(--danger)">*</span></h4>
        <div style="display:flex; gap:10px;">
          <input type="text" class="form-input" id="w-veh-make" placeholder="Make (e.g. Maruti)" value="${state.activeBooking.vehicleInfo.make}">
          <input type="text" class="form-input" id="w-veh-model" placeholder="Model (e.g. Swift)" value="${state.activeBooking.vehicleInfo.model}">
          <input type="text" class="form-input" id="w-veh-year" placeholder="Year (e.g. 2018)" maxlength="4" value="${state.activeBooking.vehicleInfo.year}">
        </div>
      </div>

      <div class="wizard-actions" style="margin-top:24px;">
        <button class="btn btn-primary btn-block" id="btn-step2-next">Search Providers <i data-lucide="arrow-right"></i></button>
      </div>
    `;

    const citySel = container.querySelector('#w-city');
    const areaSel = container.querySelector('#w-area');
    const pincodeIn = container.querySelector('#w-pincode');
    const serviceSel = container.querySelector('#w-service');
    
    // Auto vehicle fields
    const makeIn = container.querySelector('#w-veh-make');
    const modelIn = container.querySelector('#w-veh-model');
    const yearIn = container.querySelector('#w-veh-year');

    const updateAreas = () => {
      const selCityObj = state.cities.find(c => c.name === citySel.value);
      areaSel.innerHTML = '';
      if (selCityObj && selCityObj.areas) {
        selCityObj.areas.forEach((area, i) => {
          const opt = document.createElement('option');
          opt.value = area;
          opt.textContent = area;
          if (state.activeBooking.area === area) opt.selected = true;
          areaSel.appendChild(opt);
        });
        if (!pincodeIn.value && selCityObj.pincodes) {
          pincodeIn.value = selCityObj.pincodes[areaSel.selectedIndex] || '';
        }
      }
    };

    citySel.addEventListener('change', updateAreas);
    areaSel.addEventListener('change', () => {
      const selCityObj = state.cities.find(c => c.name === citySel.value);
      if (selCityObj && selCityObj.pincodes) {
        pincodeIn.value = selCityObj.pincodes[areaSel.selectedIndex] || '';
      }
    });

    updateAreas();

    container.querySelector('#btn-step2-next').addEventListener('click', () => {
      if (!pincodeIn.value || pincodeIn.value.length < 6) {
        showToast('Please enter a valid 6-digit pincode', 'error');
        return;
      }
      if (!serviceSel.value) {
        showToast('Please select the service required', 'error');
        return;
      }
      if (isAuto && (!makeIn.value || !modelIn.value || !yearIn.value)) {
        showToast('Please enter your vehicle make, model and year', 'error');
        return;
      }

      state.activeBooking.city = citySel.value;
      state.activeBooking.area = areaSel.value;
      state.activeBooking.pincode = pincodeIn.value;
      
      const sId = serviceSel.value;
      state.activeBooking.service = state.activeBooking.category.services.find(s => s.id === sId);
      
      if (isAuto) {
        state.activeBooking.vehicleInfo = {
          make: makeIn.value,
          model: modelIn.value,
          year: yearIn.value
        };
      }

      state.bookingStep = 3;
      wizard.innerHTML = buildProgress();
      wizard.appendChild(wizardBody);
      renderStep();
      lucide.createIcons();
    });
  };

  // STEP 3: PROVIDER LISTING
  const renderStep3 = async (container) => {
    showLoading(container, 'Searching matched available partners...');

    const filters = {
      categoryId: state.activeBooking.category.id,
      city: state.activeBooking.city,
      area: state.activeBooking.area
    };

    const providers = await MechTechAPI.getProviders(filters);
    container.innerHTML = `
      <h3 class="wizard-title">Select a Service Provider</h3>
      <p class="wizard-sub">Showing available professionals matched for ${state.activeBooking.area}, ${state.activeBooking.city}</p>
      <div class="provider-grid" id="w-providers-grid" style="margin-bottom: 20px;"></div>
    `;

    const pGrid = container.querySelector('#w-providers-grid');

    if (providers.length === 0) {
      pGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="emoji">📭</div>
          <h3>No Providers Available</h3>
          <p>No specialists found in your location. Connect your database or check back later.</p>
        </div>
      `;
      return;
    }

    // Split available and busy
    const available = providers.filter(p => p.isAvailable);
    const unavailable = providers.filter(p => !p.isAvailable);

    const renderCard = (p, showNextSlot = false) => {
      const card = document.createElement('div');
      card.className = 'provider-card';
      const badgeClass = p.isAvailable ? 'badge-available' : 'badge-unavailable';
      const badgeText = p.isAvailable ? 'Available Now' : 'Busy (Book Next Slot)';
      
      const finalPrice = Math.round(p.basePrice + (state.activeBooking.service?.basePrice || 0) / 4);

      card.innerHTML = `
        <div class="provider-header">
          <div class="provider-avatar">${p.name.split(' ').map(n=>n[0]).join('')}</div>
          <div>
            <div class="provider-name">${p.name}</div>
            <div class="provider-exp">${p.experience || ''} Exp • Rating: ${p.rating}★</div>
          </div>
        </div>
        <div class="provider-details">
          <div class="provider-price">₹${finalPrice} <span>Total Est.</span></div>
          <div class="provider-eta">${p.isAvailable ? `ETA: ${p.etaMinutes} mins` : 'Wait time: 2+ hrs'}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
          <span class="provider-badge ${badgeClass}">
            <span class="badge-dot"></span>${badgeText}
          </span>
          <button class="btn btn-primary btn-sm" id="sel-p-${p.id}">${p.isAvailable ? 'Select' : 'Book Next Slot'}</button>
        </div>
      `;

      card.querySelector(`#sel-p-${p.id}`).addEventListener('click', () => {
        state.activeBooking.provider = p;
        state.bookingStep = 4;
        wizard.innerHTML = buildProgress();
        wizard.appendChild(wizardBody);
        renderStep();
        lucide.createIcons();
      });

      pGrid.appendChild(card);
    };

    available.forEach(p => renderCard(p, false));
    
    if (unavailable.length > 0) {
      const divider = document.createElement('div');
      divider.style.gridColumn = '1/-1';
      divider.style.padding = '10px 0';
      divider.style.borderTop = '1px dashed var(--glass-border)';
      divider.style.fontSize = '0.85rem';
      divider.style.color = 'var(--text3)';
      divider.textContent = 'Busy Providers (Available for future slot bookings)';
      pGrid.appendChild(divider);
      
      unavailable.forEach(p => renderCard(p, true));
    }
  };

  // STEP 4: CONFIRM PROVIDER + TIME SLOT
  const renderStep4 = (container) => {
    const p = state.activeBooking.provider;
    const finalPrice = Math.round(p.basePrice + (state.activeBooking.service?.basePrice || 0) / 4);

    container.innerHTML = `
      <h3 class="wizard-title">Confirm service & select time slot</h3>
      <p class="wizard-sub">Review details for your service request with ${p.name}</p>
      
      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); padding:16px; margin-bottom: 20px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <span style="color:var(--text2)">Category:</span>
          <strong>${state.activeBooking.category?.name}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <span style="color:var(--text2)">Service Name:</span>
          <strong>${state.activeBooking.service?.name || 'Standard Service'}</strong>
        </div>
        ${state.activeBooking.vehicleInfo.make ? `
          <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="color:var(--text2)">Vehicle:</span>
            <strong>${state.activeBooking.vehicleInfo.make} ${state.activeBooking.vehicleInfo.model} (${state.activeBooking.vehicleInfo.year})</strong>
          </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <span style="color:var(--text2)">Provider:</span>
          <strong>${p.name} (${p.rating}★)</strong>
        </div>
        <div style="display:flex; justify-content:space-between; padding-top:10px; border-top:1px solid var(--glass-border)">
          <span style="color:var(--text2)">Estimated Charge:</span>
          <strong style="color: var(--accent3); font-size:1.1rem;">₹${finalPrice}</strong>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Choose Time Slot</label>
        <div class="slot-grid" id="slots-container"></div>
      </div>

      <div class="wizard-actions" style="margin-top:24px;">
        <button class="btn btn-primary btn-block" id="btn-step4-next">Confirm Details <i data-lucide="arrow-right"></i></button>
      </div>
    `;

    const slotsContainer = container.querySelector('#slots-container');
    TIME_SLOTS.forEach(slot => {
      const chip = document.createElement('div');
      chip.className = `slot-chip ${state.activeBooking.slot === slot ? 'selected' : ''}`;
      chip.textContent = slot;
      chip.addEventListener('click', () => {
        state.activeBooking.slot = slot;
        slotsContainer.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
      slotsContainer.appendChild(chip);
    });

    container.querySelector('#btn-step4-next').addEventListener('click', () => {
      if (!state.activeBooking.slot) {
        showToast('Please select a time slot for the service', 'error');
        return;
      }
      state.bookingStep = 5;
      wizard.innerHTML = buildProgress();
      wizard.appendChild(wizardBody);
      renderStep();
      lucide.createIcons();
    });
  };

  // STEP 5: CHOOSE PAYMENT METHOD
  const renderStep5 = (container) => {
    const finalPrice = Math.round(state.activeBooking.provider.basePrice + (state.activeBooking.service?.basePrice || 0) / 4);
    const allowPartial = finalPrice > 1000;

    container.innerHTML = `
      <h3 class="wizard-title">Select Payment Preference</h3>
      <p class="wizard-sub">Choose your preferred payment method. Secure transactions guaranteed.</p>
      
      <div class="payment-options">
        <div class="payment-opt ${state.activeBooking.paymentMode === 'COD' ? 'selected' : ''}" data-pay="COD">
          <div class="po-icon">💵</div>
          <div>
            <div class="po-name">Cash on Delivery (COD)</div>
            <div class="po-desc">Default option. Pay directly to the provider after service completion.</div>
          </div>
        </div>

        <div class="payment-opt ${state.activeBooking.paymentMode === 'UPI' ? 'selected' : ''}" data-pay="UPI">
          <div class="po-icon">📱</div>
          <div>
            <div class="po-name">UPI / Online payment</div>
            <div class="po-desc">Pay instantly online using GooglePay, PhonePe, Paytm, or Credit Card.</div>
          </div>
        </div>

        ${allowPartial ? `
          <div class="payment-opt ${state.activeBooking.paymentMode === 'Partial' ? 'selected' : ''}" data-pay="Partial">
            <div class="po-icon">💰</div>
            <div>
              <div class="po-name">Partial Advance + COD</div>
              <div class="po-desc">Pay ₹500 advance now to secure premium slot + balance after completion.</div>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    const options = container.querySelectorAll('.payment-opt');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const payVal = opt.getAttribute('data-pay');
        state.activeBooking.paymentMode = payVal;
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  };

  // STEP 6: RECEIPT SUMMARY (POST SUBMISSION)
  const renderStep6 = async (container) => {
    if (!state.activeBooking.bookingId) {
      showLoading(container, 'Creating booking on backend...');
      
      const finalPrice = Math.round(state.activeBooking.provider.basePrice + (state.activeBooking.service?.basePrice || 0) / 4);
      const postData = {
        providerId: state.activeBooking.provider.id,
        categoryId: state.activeBooking.category.id,
        service: state.activeBooking.service?.name,
        amount: finalPrice,
        paymentMode: state.activeBooking.paymentMode,
        slot: state.activeBooking.slot,
        city: state.activeBooking.city,
        area: state.activeBooking.area,
        pincode: state.activeBooking.pincode,
        vehicleInfo: state.activeBooking.vehicleInfo
      };

      try {
        const response = await MechTechAPI.createBooking(postData);
        state.activeBooking.bookingId = response.id;
      } catch (err) {
        showBackendOfflineMsg(container, 'Could not save booking details. Make sure your database POST endpoints are online.');
        return;
      }
    }

    const finalPrice = Math.round(state.activeBooking.provider.basePrice + (state.activeBooking.service?.basePrice || 0) / 4);
    container.innerHTML = `
      <div style="text-align:center; margin-bottom: 24px;">
        <div style="width:64px; height:64px; border-radius:50%; background:var(--success); color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:2rem; margin-bottom:14px;">✓</div>
        <h3 class="wizard-title">Booking Confirmed!</h3>
        <p style="color:var(--text2)">Your request has been successfully assigned on the backend.</p>
      </div>

      <div class="booking-summary">
        <div class="summary-id">${state.activeBooking.bookingId}</div>
        
        <div class="summary-row">
          <span class="lbl">Category / Service</span>
          <span class="val">${state.activeBooking.category.name} - ${state.activeBooking.service.name}</span>
        </div>
        ${state.activeBooking.vehicleInfo.make ? `
          <div class="summary-row">
            <span class="lbl">Vehicle Details</span>
            <span class="val">${state.activeBooking.vehicleInfo.make} ${state.activeBooking.vehicleInfo.model} (${state.activeBooking.vehicleInfo.year})</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span class="lbl">Provider Expert</span>
          <span class="val">${state.activeBooking.provider.name} (${state.activeBooking.provider.rating}★)</span>
        </div>
        <div class="summary-row">
          <span class="lbl">Location</span>
          <span class="val">${state.activeBooking.area}, ${state.activeBooking.city} - ${state.activeBooking.pincode}</span>
        </div>
        <div class="summary-row">
          <span class="lbl">Schedule Slot</span>
          <span class="val">${state.activeBooking.slot} (Today)</span>
        </div>
        <div class="summary-row">
          <span class="lbl">Payment Preference</span>
          <span class="val">${state.activeBooking.paymentMode}</span>
        </div>
        <div class="summary-row summary-total">
          <span class="lbl">Total Amount</span>
          <span class="val" style="color: var(--accent3)">₹${finalPrice}</span>
        </div>
      </div>

      <div style="text-align:center; margin-top: 32px; display:flex; gap:12px; justify-content:center;">
        <button class="btn btn-secondary" id="btn-receipt-home">Go Home</button>
        <button class="btn btn-primary" id="btn-receipt-track">Track Booking</button>
      </div>
    `;

    container.querySelector('#btn-receipt-home').addEventListener('click', () => {
      resetWizardState();
      navigateTo('home');
    });

    container.querySelector('#btn-receipt-track').addEventListener('click', () => {
      const savedId = state.activeBooking.bookingId;
      resetWizardState();
      navigateTo('track');
      
      setTimeout(() => {
        const inp = document.getElementById('track-search-input');
        if (inp) {
          inp.value = savedId;
          document.getElementById('track-search-btn').click();
        }
      }, 100);
    });
  };

  const resetWizardState = () => {
    state.activeBooking = {
      category: null,
      service: null,
      city: '',
      area: '',
      pincode: '',
      vehicleInfo: { make: '', model: '', year: '' },
      provider: null,
      slot: '',
      paymentMode: '',
      bookingId: ''
    };
    state.bookingStep = 1;
  };

  await renderStep();
  return page;
}

// ─── BOOKING TRACKER PAGE ───
function createTrackerPage() {
  const page = document.createElement('div');
  page.className = 'container section fade-in';

  const tracker = document.createElement('div');
  tracker.className = 'tracker';
  tracker.innerHTML = `
    <h2>Track Booking Status</h2>
    <p style="color: var(--text2); margin-bottom: 24px;">Enter your Booking ID to view real-time update timeline</p>
    
    <div class="tracker-search">
      <input type="text" class="form-input" id="track-search-input" placeholder="e.g. MT-20260717-002" style="text-transform: uppercase;">
      <button class="btn btn-primary" id="track-search-btn">Search Status</button>
    </div>

    <div id="tracker-result-container"></div>
  `;

  const input = tracker.querySelector('#track-search-input');
  const btn = tracker.querySelector('#track-search-btn');
  const resultContainer = tracker.querySelector('#tracker-result-container');

  btn.addEventListener('click', async () => {
    const val = input.value.trim().toUpperCase();
    if (!val) {
      showToast('Please enter a booking ID', 'error');
      return;
    }

    showLoading(resultContainer, 'Fetching tracking details from backend...');
    const b = await MechTechAPI.getBooking(val);

    if (!b) {
      resultContainer.innerHTML = `
        <div class="empty-state">
          <div class="emoji">🔍</div>
          <h3>Booking Not Found</h3>
          <p>We couldn't connect to backend or find booking matching "${val}". Make sure server API is up.</p>
        </div>
      `;
      return;
    }

    // Setup status timeline indices
    const statuses = ['pending', 'confirmed', 'in_progress', 'completed'];
    let currentIdx = statuses.indexOf(b.status);
    
    if (b.status === 'cancelled') {
      currentIdx = -1;
    }

    let timelineHtml = '';
    
    if (b.status === 'cancelled') {
      timelineHtml = `
        <div class="tl-item done" style="color: var(--danger);">
          <div class="tl-dot">✕</div>
          <div class="tl-title">Booking Cancelled</div>
          <div class="tl-desc">This booking has been cancelled and refunds (if any) initiated.</div>
        </div>
      `;
    } else {
      const stepLabels = [
        { label: 'Booking Placed', desc: 'Request received and sent to local provider' },
        { label: 'Confirmed by Partner', desc: 'Partner accepted slot and preparing to visit' },
        { label: 'Service In Progress', desc: 'Partner arrived at address and starting job' },
        { label: 'Job Completed', desc: 'Service completed. Final rating & payment received' }
      ];

      timelineHtml = stepLabels.map((lbl, idx) => {
        let cls = '';
        let dotChar = '•';
        if (idx < currentIdx) {
          cls = 'done';
          dotChar = '✓';
        } else if (idx === currentIdx) {
          cls = 'current';
          dotChar = '▶';
        }
        
        return `
          <div class="tl-item ${cls}">
            <div class="tl-dot">${dotChar}</div>
            <div class="tl-title">${lbl.label}</div>
            <div class="tl-desc">${lbl.desc}</div>
          </div>
        `;
      }).join('');
    }

    resultContainer.innerHTML = `
      <div style="background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); padding: 24px; margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
          <div>
            <h4 style="font-size:1.15rem; color:var(--success)">${b.id}</h4>
            <div style="font-size:0.8rem; color:var(--text3)">Service booked on: ${b.date}</div>
          </div>
          <span class="provider-badge ${b.status === 'completed' ? 'badge-available' : b.status === 'cancelled' ? 'badge-unavailable' : 'badge-available'}">
            ${b.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        <div style="display:flex; gap:16px; align-items:center; padding:16px; background: rgba(0,0,0,0.15); border-radius: var(--radius-sm); margin-bottom:24px;">
          <div class="provider-avatar" style="width:40px; height:40px; font-size:0.95rem;">EP</div>
          <div>
            <div style="font-weight:600; font-size:0.9rem;">Expert Partner ID: ${b.providerId}</div>
            <div style="font-size:0.75rem; color:var(--text2)">Status: Matched via API</div>
          </div>
        </div>

        <div class="timeline">${timelineHtml}</div>

        ${(b.status !== 'completed' && b.status !== 'cancelled') ? `
          <div style="margin-top: 24px; display:flex; gap:10px;">
            <button class="btn btn-danger btn-block" id="btn-cancel-booking">Cancel Booking</button>
          </div>
        ` : ''}
      </div>
    `;

    const cancelBtn = resultContainer.querySelector('#btn-cancel-booking');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', async () => {
        try {
          await MechTechAPI.cancelBooking(b.id);
          showToast('Booking cancelled successfully', 'success');
          btn.click();
        } catch (err) {
          showToast('Failed to cancel booking via API', 'error');
        }
      });
    }
  });

  page.appendChild(tracker);
  return page;
}

// ─── CHAT ASSISTANT WIDGET LOGIC ───
function initChatAssistant() {
  const fab = document.getElementById('chat-fab');
  const windowEl = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const chips = document.querySelectorAll('.chat-chip');

  const toggleChat = () => {
    windowEl.classList.toggle('open');
    if (windowEl.classList.contains('open')) {
      renderChatMessages();
      chatInput.focus();
    }
  };

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', () => windowEl.classList.remove('open'));

  const renderChatMessages = () => {
    chatBody.innerHTML = '';
    state.chatMessages.forEach(msg => {
      const el = document.createElement('div');
      el.className = `chat-msg ${msg.sender}`;
      el.textContent = msg.text;
      chatBody.appendChild(el);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const handleSendMessage = async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    state.chatMessages.push({ sender: 'user', text });
    renderChatMessages();
    chatInput.value = '';

    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = 'Assistant is typing <span></span><span></span><span></span>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;

    const reply = await MechTechAPI.sendChatMessage(text);
    typing.remove();
    state.chatMessages.push({ sender: 'bot', text: reply });
    renderChatMessages();
  };

  sendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      chatInput.value = msg;
      handleSendMessage();
    });
  });
}

// Mobile Nav Toggle Menu
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.addEventListener('click', () => {
    links.classList.remove('open');
  });
}

// Initialization Entrypoint
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initChatAssistant();
  initMobileNav();
});
