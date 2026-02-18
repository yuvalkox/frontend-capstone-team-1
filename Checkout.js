// הגדרת משתנים למצב לילה/יום
const body = document.body;
const darkBtn = document.getElementById("dark-mode-toggle");
const lightBtn = document.getElementById("light-mode-toggle");

// 
const savedTheme = localStorage.getItem("yoli-theme");
if (savedTheme === "dark") {
  body.classList.add("theme-dark");
} else {
  body.classList.remove("theme-dark");
}

// לחיצה על מצב לילה
if (darkBtn !== null) {
  darkBtn.addEventListener("click", function () {
    body.classList.add("theme-dark");
    localStorage.setItem("yoli-theme", "dark");
  });
}

// לחיצה על מצב יום
if (lightBtn !== null) {
  lightBtn.addEventListener("click", function () {
    body.classList.remove("theme-dark");
    localStorage.setItem("yoli-theme", "light");
  });
}
//יצירת משתנים לתפריט להמבורגר
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");
const hamburger = document.querySelector('.hamburger');


// ריחוף והדגשה למצב פוקוס      
function makeInteractive(el) {
  if (!el) return;

  el.addEventListener("mouseenter", function () {
    el.classList.add("ui-active");
  });

  el.addEventListener("mouseleave", function () {
    el.classList.remove("ui-active");
  });

  el.addEventListener("focus", function () {
    el.classList.add("ui-active");
  });

  el.addEventListener("blur", function () {
    el.classList.remove("ui-active");
  });
}

// מפעילים על כפתורים
makeInteractive(document.getElementById("dark-mode-toggle"));
makeInteractive(document.getElementById("light-mode-toggle"));
makeInteractive(document.getElementById("cart-link"));
makeInteractive(hamburger);

// מפעילים על כל הקישורים בתפריט
if (nav) {
  const navLinks = nav.querySelectorAll("a");
  for (let i = 0; i < navLinks.length; i++) {
    makeInteractive(navLinks[i]);
  }
}

// סגירה בלחיצה על קישור
if (navToggle && nav) {
  const links = nav.querySelectorAll("a");
  for (let j = 0; j < links.length; j++) {
    links[j].addEventListener("click", function () {
      navToggle.checked = false;
    });
  }

  // סגירה בלחיצה מחוץ לתפריט
  document.addEventListener("click", function (e) {
    if (!navToggle.checked) return;

    let node = e.target;
    let clickedInside = false;

    while (node) {
      if (node === nav || node === hamburger || node === navToggle) {
        clickedInside = true;
        break;
      }
      node = node.parentElement;
    }

    if (!clickedInside) {
      navToggle.checked = false;
 
    }
  });
}

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let deliveryType = 'delivery';
const DELIVERY_FEE = 15;
let itemToDeleteIndex = null;

const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const deliveryFeeEl = document.getElementById('deliveryFee');
const totalEl = document.getElementById('total');
const submitBtn = document.getElementById('submitBtn');
const addressField = document.getElementById('addressField');
const paymentSection = document.getElementById('paymentSection');
const toPaymentBtn = document.getElementById('toPayment');
const totalsSection = document.getElementById('totalsSection');
const modal = document.getElementById('modal');
const successSection = document.getElementById('successSection');
const cartSection = document.getElementById('cartSection');
const checkoutForm = document.getElementById('checkoutForm');
const pageTitle = document.querySelector('.page-title');
const deliveryBtn = document.getElementById('deliveryBtn');
const pickupBtn = document.getElementById('pickupBtn');

function keepOnlyDigits(input) {
    let clean = "";
    for (let i = 0; i < input.value.length; i++) {
        if (input.value[i] >= '0' && input.value[i] <= '9') {
            clean += input.value[i];
        }
    }
    input.value = clean;
    return clean;
}

function toggleError(input, errorEl, message, show) {
    if (!errorEl) return;

    if (show) {
        errorEl.style.display = "block";
        errorEl.textContent = message;
        input.classList.add('invalid');
    } else {
        errorEl.style.display = "none";
        input.classList.remove('invalid');
    }
}

function calculateSubtotal(cart) {
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
        sum = sum + (cart[i].price * cart[i].quantity);
    }
    return sum;
}

function init() {
    renderCart();
    setupEventListeners();
    setupJsEffects();
    setupValidation();
}
init();

function renderCart() {
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
        <div class="empty-cart">
            <div class="empty-cart-icon">
                <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="עגלה ריקה">
            </div>
            <h2>העגלה ריקה</h2>
            <p>הוסיפו מנות מהתפריט שלנו</p>
            <a href="index.html" class="btn-primary">חזרה לתפריט</a>
        </div>`;
        if (totalsSection) totalsSection.style.display = 'none';
        if (toPaymentBtn) toPaymentBtn.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];

        let notesHTML = '';
        if (item.notes) {
            notesHTML = `<div class="cart-item-notes"><strong>הערות:</strong> ${item.notes}</div>`;
        }
        let extrasHTML = '';
        if (item.extras && item.extras.length > 0) {
            extrasHTML = `<div class="cart-item-notes"><strong>תוספות:</strong> ${item.extras.join(', ')}</div>`;
        }

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${notesHTML}
                ${extrasHTML}
                <div class="cart-item-actions">
                    <button class="edit-btn" onclick="editItem(${i})">עריכה</button>
                    <button class="remove-btn" onclick="removeItem(${i})">הסרה</button>
                </div>
            </div>
            <div class="cart-qty">
                <button onclick="updateQuantity(${i}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${i}, 1)">+</button>
            </div>
            <div class="cart-item-price">₪${item.price * item.quantity}</div>`;
        
        cartItems.appendChild(div);
    }

    if (totalsSection) totalsSection.style.display = 'block';
    if (toPaymentBtn) toPaymentBtn.style.display = 'flex';
    updateTotals();
}

function updateTotals() {
    const subtotal = calculateSubtotal(cart);
    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
        deliveryFee = DELIVERY_FEE;
    }

    const total = subtotal + deliveryFee;

    if (subtotalEl) subtotalEl.textContent = `₪${subtotal}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `₪${deliveryFee}`;
    if (totalEl) totalEl.textContent = `₪${total}`;
    if (submitBtn) submitBtn.innerHTML = `שלם ₪${total}`;
}





// פוטר 
const light = '#cbcbcaff'; 
const white = '#ffffff';

const footerIcons = document.querySelectorAll('.footer-social a');
for (let k = 0; k < footerIcons.length; k++) {
    footerIcons[k].addEventListener('mouseenter', function() {
        this.style.color = light;
    });
    footerIcons[k].addEventListener('mouseleave', function() {
        this.style.color = white;
    });
}