// =============================================
//  NILE FOODS — APP LOGIC
//  Cart management + WhatsApp order dispatch
// =============================================

const WHATSAPP_NUMBER = '250785177046';

let cart = {}; // { itemName: { price, qty } }

// ===== CART OPERATIONS =====

function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price, qty: 1 };
  }
  renderCart();
  showFloatCart();
  flashAddBtn(name);
}

function changeQty(name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) {
    delete cart[name];
  }
  renderCart();
  updateFloatCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const totalAmountEl = document.getElementById('totalAmount');

  const items = Object.entries(cart);

  if (items.length === 0) {
    cartEmptyEl.style.display = 'flex';
    cartItemsEl.innerHTML = '';
    cartTotalEl.style.display = 'none';
    return;
  }

  cartEmptyEl.style.display = 'none';
  cartTotalEl.style.display = 'flex';

  let total = 0;
  cartItemsEl.innerHTML = items.map(([name, { price, qty }]) => {
    const subtotal = price * qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${name}</span>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${name}', -1)">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${name}', 1)">+</button>
        </div>
        <span class="cart-item-price">${subtotal.toLocaleString()} RWF</span>
      </div>
    `;
  }).join('');

  totalAmountEl.textContent = total.toLocaleString() + ' RWF';
  updateFloatCart();
}

// ===== FLOATING CART BUTTON =====

function showFloatCart() {
  const fb = document.getElementById('floatCart');
  if (Object.keys(cart).length > 0) {
    fb.style.display = 'block';
    updateFloatCart();
  }
}

function updateFloatCart() {
  const fb = document.getElementById('floatCart');
  const items = Object.values(cart);
  if (items.length === 0) {
    fb.style.display = 'none';
    return;
  }
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const totalAmt = items.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('floatCount').textContent = totalQty;
  document.getElementById('floatTotal').textContent = totalAmt.toLocaleString();
  fb.style.display = 'block';
}

function scrollToOrder() {
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ===== FLASH ANIMATION ON ADD =====

function flashAddBtn(name) {
  // Brief visual feedback
  const cards = document.querySelectorAll('.menu-card');
  cards.forEach(card => {
    const h3 = card.querySelector('h3');
    if (h3 && h3.textContent.trim() === name) {
      const btn = card.querySelector('.add-btn');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Added';
        btn.style.background = '#2e7d32';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
        }, 1000);
      }
    }
  });
}

// ===== SEND ORDER TO WHATSAPP =====

function sendOrder() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const notes = document.getElementById('custNotes').value.trim();

  // Validate
  if (Object.keys(cart).length === 0) {
    alert('Please add at least one item to your order before sending.');
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (!name) { alert('Please enter your name.'); document.getElementById('custName').focus(); return; }
  if (!phone) { alert('Please enter your phone number.'); document.getElementById('custPhone').focus(); return; }
  if (!address) { alert('Please enter your delivery address.'); document.getElementById('custAddress').focus(); return; }

  // Build message
  const items = Object.entries(cart);
  const total = items.reduce((s, [, { price, qty }]) => s + price * qty, 0);

  let msg = `🍔 *NEW ORDER — NILE FOODS*\n\n`;
  msg += `👤 *Name:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `📍 *Delivery Address:* ${address}\n\n`;
  msg += `*ORDER DETAILS:*\n`;
  msg += `─────────────────\n`;
  items.forEach(([name, { price, qty }]) => {
    msg += `• ${name} × ${qty} — ${(price * qty).toLocaleString()} RWF\n`;
  });
  msg += `─────────────────\n`;
  msg += `💰 *Total: ${total.toLocaleString()} RWF*\n`;
  if (notes) msg += `\n📝 *Notes:* ${notes}\n`;
  msg += `\n_Sent via nilafoods.vercel.app_`;

  const encoded = encodeURIComponent(msg);
  const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  // Capture client order history if user is logged in
  if (currentUser) {
    const orderItems = items.map(([name, { qty }]) => `${name} × ${qty}`);
    saveOrderToHistory(orderItems, total);
  }

  window.open(waURL, '_blank');
}

// ===== CATEGORY FILTER =====

document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.menu-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== MOBILE MENU =====

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ===== SMOOTH NAV SCROLL + OFFSET FOR STICKY NAV =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 94;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =============================================
//  NILE FOODS — LOGIN, SIGNUP & ACCOUNT LOGIC
//  Client-side LocalStorage User Management
// =============================================

let currentUser = null;

// Initialize Auth State on Page Load
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

function initAuth() {
  const userSession = localStorage.getItem('nile_current_user');
  if (userSession) {
    currentUser = JSON.parse(userSession);
    updateUIForLoggedInUser();
  } else {
    updateUIForLoggedOutUser();
  }
}

// UI UPGRADE FUNCTIONS
function updateUIForLoggedInUser() {
  // Nav Auth Buttons
  document.getElementById('navAuthBtn').style.display = 'none';
  document.getElementById('profileDropdown').style.display = 'block';
  document.getElementById('navUserName').textContent = currentUser.name.split(' ')[0]; // Show first name

  // Mobile Nav Auth Area
  document.getElementById('mobileUserArea').style.display = 'none';
  document.getElementById('mobileProfileArea').style.display = 'block';

  // Checkout Welcome Banner
  document.getElementById('checkoutAuthPromo').style.display = 'none';
  document.getElementById('checkoutAuthWelcome').style.display = 'block';

  // Pre-fill Checkout Details
  document.getElementById('custName').value = currentUser.name;
  document.getElementById('custPhone').value = currentUser.phone;
  document.getElementById('custAddress').value = currentUser.address;
}

function updateUIForLoggedOutUser() {
  // Nav Auth Buttons
  document.getElementById('navAuthBtn').style.display = 'block';
  document.getElementById('profileDropdown').style.display = 'none';

  // Mobile Nav Auth Area
  document.getElementById('mobileUserArea').style.display = 'block';
  document.getElementById('mobileProfileArea').style.display = 'none';

  // Checkout Welcome Banner
  document.getElementById('checkoutAuthPromo').style.display = 'block';
  document.getElementById('checkoutAuthWelcome').style.display = 'none';

  // Clear Checkout Details
  document.getElementById('custName').value = '';
  document.getElementById('custPhone').value = '';
  document.getElementById('custAddress').value = '';
}

// AUTH MODAL TRIGGERS
function openAuthModal(e) {
  if (e) e.preventDefault();
  document.getElementById('authModal').classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('open');
  document.body.style.overflow = ''; // Restore scroll
  // Clear forms
  document.getElementById('loginForm').reset();
  document.getElementById('signupForm').reset();
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
  } else {
    tabLogin.classList.remove('active');
    tabSignup.classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  }
}

// PROFILE MODAL TRIGGERS
function openProfileModal(e, activeTab) {
  if (e) e.preventDefault();
  closeProfileMenu();
  
  if (!currentUser) return;

  document.getElementById('profileModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Set default edit fields
  document.getElementById('profileName').value = currentUser.name;
  document.getElementById('profileEmail').value = currentUser.email;
  document.getElementById('profilePhone').value = currentUser.phone;
  document.getElementById('profileAddress').value = currentUser.address;

  switchProfileTab(activeTab || 'profile');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('open');
  document.body.style.overflow = '';
}

function switchProfileTab(tab) {
  const sideTabProfile = document.getElementById('sideTabProfile');
  const sideTabHistory = document.getElementById('sideTabHistory');
  const profileViewTab = document.getElementById('profileViewTab');
  const profileHistoryTab = document.getElementById('profileHistoryTab');

  if (tab === 'profile') {
    sideTabProfile.classList.add('active');
    sideTabHistory.classList.remove('active');
    profileViewTab.style.display = 'block';
    profileHistoryTab.style.display = 'none';
  } else {
    sideTabProfile.classList.remove('active');
    sideTabHistory.classList.add('active');
    profileViewTab.style.display = 'none';
    profileHistoryTab.style.display = 'block';
    renderOrderHistory();
  }
}

// PROFILE DROPDOWN MENU TOGGLE
function toggleProfileMenu(e) {
  if (e) e.stopPropagation();
  document.getElementById('dropdownMenu').classList.toggle('show');
}

function closeProfileMenu() {
  const menu = document.getElementById('dropdownMenu');
  if (menu) menu.classList.remove('show');
}

// Close Dropdowns on Click Outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    closeProfileMenu();
  }
});

// Modal Backdrop Click Closes Modals
function closeModalOnBackdrop(e, modalId) {
  if (e.target.id === modalId) {
    if (modalId === 'authModal') closeAuthModal();
    if (modalId === 'profileModal') closeProfileModal();
  }
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✗'}</span> &nbsp;&nbsp; ${message}`;
  container.appendChild(toast);

  // Auto clean up toast node after animation ends
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// FORM SUBMISSIONS & VALIDATION
function submitSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const phone = document.getElementById('signupPhone').value.trim();
  const address = document.getElementById('signupAddress').value.trim();
  const password = document.getElementById('signupPassword').value;

  // Simple validation
  if (!name || !email || !phone || !address || !password) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Get local registry
  let users = JSON.parse(localStorage.getItem('nile_users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    showToast('An account with this email already exists.', 'error');
    return;
  }

  const newUser = { name, email, phone, address, password, orders: [] };
  users.push(newUser);
  localStorage.setItem('nile_users', JSON.stringify(users));

  // Log user in automatically
  currentUser = newUser;
  localStorage.setItem('nile_current_user', JSON.stringify(newUser));

  updateUIForLoggedInUser();
  closeAuthModal();
  showToast(`Account created! Welcome to Nile Foods, ${name.split(' ')[0]}.`);
}

function submitLogin(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('Please enter email and password.', 'error');
    return;
  }

  // Find user in registry
  let users = JSON.parse(localStorage.getItem('nile_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showToast('Invalid email or password.', 'error');
    return;
  }

  // Login successful
  currentUser = user;
  localStorage.setItem('nile_current_user', JSON.stringify(user));

  updateUIForLoggedInUser();
  closeAuthModal();
  showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
}

function handleLogout(e) {
  if (e) e.preventDefault();
  closeProfileMenu();
  closeProfileModal();
  
  currentUser = null;
  localStorage.removeItem('nile_current_user');
  
  updateUIForLoggedOutUser();
  showToast('Logged out successfully.');
}

function saveProfileDetails(e) {
  e.preventDefault();

  const name = document.getElementById('profileName').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();
  const address = document.getElementById('profileAddress').value.trim();

  if (!name || !phone || !address) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Update current user state
  currentUser.name = name;
  currentUser.phone = phone;
  currentUser.address = address;
  localStorage.setItem('nile_current_user', JSON.stringify(currentUser));

  // Update user inside registry
  let users = JSON.parse(localStorage.getItem('nile_users') || '[]');
  const index = users.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    users[index].name = name;
    users[index].phone = phone;
    users[index].address = address;
    localStorage.setItem('nile_users', JSON.stringify(users));
  }

  // Update page UI
  updateUIForLoggedInUser();
  closeProfileModal();
  showToast('Profile updated successfully.');
}

// CLIENT ORDER HISTORY RECORDER
function saveOrderToHistory(orderItems, total) {
  if (!currentUser) return;

  const dateString = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const newOrder = {
    items: orderItems,
    total: total,
    date: dateString,
    status: 'Sent on WhatsApp'
  };

  // Add order to current session user
  if (!currentUser.orders) currentUser.orders = [];
  currentUser.orders.unshift(newOrder);
  localStorage.setItem('nile_current_user', JSON.stringify(currentUser));

  // Add order to registry user
  let users = JSON.parse(localStorage.getItem('nile_users') || '[]');
  const index = users.findIndex(u => u.email === currentUser.email);
  if (index !== -1) {
    if (!users[index].orders) users[index].orders = [];
    users[index].orders.unshift(newOrder);
    localStorage.setItem('nile_users', JSON.stringify(users));
  }
}

function renderOrderHistory() {
  const historyListEl = document.getElementById('orderHistoryList');
  if (!historyListEl) return;

  if (!currentUser.orders || currentUser.orders.length === 0) {
    historyListEl.innerHTML = '<p class="text-muted" style="text-align:center; padding: 40px 0;">No order history found. Start adding food to your cart!</p>';
    return;
  }

  historyListEl.innerHTML = currentUser.orders.map(order => {
    return `
      <div class="order-history-card">
        <div class="order-history-header">
          <span class="order-date">📅 ${order.date}</span>
          <span class="order-status">${order.status}</span>
        </div>
        <div class="order-history-body">
          <div class="order-history-items">
            ${order.items.map(item => `<div>• ${item}</div>`).join('')}
          </div>
          <div class="order-history-total">
            <span>Total Paid (via delivery)</span>
            <span>${order.total.toLocaleString()} RWF</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
