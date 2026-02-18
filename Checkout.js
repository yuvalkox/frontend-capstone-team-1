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
            <a href="Menu.html" class="btn-primary">חזרה לתפריט</a>
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

function showPaymentStep() {
    if (cartSection) cartSection.style.display = 'none';
    if (paymentSection) {
        paymentSection.style.display = 'block';
        paymentSection.classList.add('visible');
    }
    if (pageTitle) pageTitle.textContent = "פרטי תשלום";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSuccessStep() {
    const nameInput = document.querySelector('input[name="name"]');
    const nameValue = nameInput.value; 

    let typeValue = "איסוף עצמי";
    if (deliveryType === 'delivery') {
        typeValue = "משלוח עד הבית";
    }

    const randomOrderNum = Math.round(Math.random() * 9000) + 1000;

    document.getElementById('confName').textContent = nameValue;
    document.getElementById('confType').textContent = typeValue;
    document.getElementById('confOrderNum').textContent = randomOrderNum;

    let timeText;
    if (deliveryType === 'delivery') {
        timeText = "30-60 דקות";
    } else {
        timeText = "25 דקות";
    }
    document.getElementById('confTime').textContent = timeText;

    if (paymentSection) paymentSection.style.display = 'none';
    if (pageTitle) pageTitle.style.display = 'none';
    if (successSection) {
        successSection.style.display = 'block';
        successSection.classList.add('visible');
    }

    localStorage.removeItem('cart');
    cart = [];
}

function setupEventListeners() {
    if (toPaymentBtn) {
        toPaymentBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showPaymentStep();
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showSuccessStep();
        });
    }

    if (deliveryBtn) {
        deliveryBtn.addEventListener('click', function () {
            deliveryType = 'delivery';
            this.classList.add('selected');
            if (pickupBtn) pickupBtn.classList.remove('selected');
            if (addressField) {
                addressField.style.display = 'block';
                const input = addressField.querySelector('input');
                if (input) input.required = true;
            }
            updateTotals();
        });
    }

    if (pickupBtn) {
        pickupBtn.addEventListener('click', function () {
            deliveryType = 'pickup';
            this.classList.add('selected');
            if (deliveryBtn) deliveryBtn.classList.remove('selected');
            if (addressField) {
                addressField.style.display = 'none';
                const input = addressField.querySelector('input');
                if (input) input.required = false;
            }
            updateTotals();
        });
    }

    const modalConfirm = document.getElementById('modalConfirm');
    if (modalConfirm) {
        modalConfirm.onclick = function () {
            if (itemToDeleteIndex !== null) {
                cart.splice(itemToDeleteIndex, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                closeModal();
            }
        };
    }

    const modalCancel = document.getElementById('modalCancel');
    if (modalCancel) modalCancel.onclick = closeModal;
}

function setupValidation() {
    const fullNameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.getElementById('phone');
    const idInput = document.getElementById('idNumber');
    const cardNameInput = document.getElementById('cardName');
    const expiryInput = document.getElementById('cardExpiry');
    const cvvInput = document.getElementById('cvv');
    const cardNumInput = document.getElementById('cardNumber');

    if (fullNameInput) {
        fullNameInput.addEventListener('input', function () {
            let clean = "";
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] < '0' || this.value[i] > '9') clean += this.value[i];
            }
            this.value = clean;
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            keepOnlyDigits(this);
            const error = document.getElementById('phoneError');
            const isValid = (this.value.length === 10);
            toggleError(this, error, "מספר שגוי", this.value.length > 0 && !isValid);
        });
    }

    if (idInput) {
        idInput.addEventListener('input', function () {
            keepOnlyDigits(this);
            const error = document.getElementById('idError');
            const isValid = (this.value.length === 9);
            toggleError(this, error, "ת.ז לא תקינה", this.value.length > 0 && !isValid);
        });
    }

    if (cardNameInput) {
        cardNameInput.addEventListener('input', function () {
            let clean = "";
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] < '0' || this.value[i] > '9') clean += this.value[i];
            }
            this.value = clean;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function () {
            keepOnlyDigits(this);
        });
    }

    if (cardNumInput) {
        cardNumInput.addEventListener('input', function () {
            let clean = keepOnlyDigits(this);

            let formatted = "";
            for (let i = 0; i < clean.length; i++) {
                if (i > 0 && i % 4 === 0) formatted += " ";
                formatted += clean[i];
            }
            this.value = formatted;

            const error = document.getElementById('cardError');
            const isValid = (clean.length === 16);
            toggleError(this, error, "מספר כרטיס חייב להכיל 16 ספרות", clean.length > 0 && !isValid);
        });
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function () {
            let clean = "";
            for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] >= '0' && this.value[i] <= '9') clean += this.value[i];
            }
            if (clean.length >= 2) {
                this.value = clean.substring(0, 2) + '/' + clean.substring(2, 4);
            } else {
                this.value = clean;
            }
        });

        expiryInput.addEventListener('change', function () {
            const error = document.getElementById('expiryError');
            const val = this.value;
            let isValid = false;

            if (val.length === 5 && val.includes('/')) {
                const parts = val.split('/');
                const month = parseInt(parts[0], 10);
                const year = parseInt(parts[1], 10);
                const currentYearShort = 26;
                const currentMonth = new Date().getMonth() + 1;
                if (month >= 1 && month <= 12) {
                    if (year > currentYearShort) isValid = true;
                    else if (year === currentYearShort && month >= currentMonth) isValid = true;
                }
            }

            toggleError(this, error, "תוקף הכרטיס פג או לא חוקי", val.length > 0 && !isValid);
        });
    }
}

function updateQuantity(index, delta) {
    if (delta === -1 && cart[index].quantity === 1) {
        removeItem(index);
        return;
    }
    cart[index].quantity += delta;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    itemToDeleteIndex = index;
    const msg = document.getElementById('modalMessage');
    if (msg) msg.textContent = `האם להסיר את "${cart[index].name}" מהעגלה?`;
    const input = document.getElementById('modalInput');
    if (input) input.style.display = 'none';
    if (modal) modal.style.display = 'flex';
}

function closeModal() {
    if (modal) modal.style.display = 'none';
    itemToDeleteIndex = null;
}

function editItem(index) {
    const item = cart[index];
    window.location.href = `LIHI.html?id=${encodeURIComponent(item.id || item.name)}&editMode=true&cartIndex=${index}`;
}

function setupJsEffects() {
    var buttons = document.querySelectorAll('.btn-primary, .submit-button');
    for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        btn.onmouseenter = function () { this.style.opacity = '0.9'; };
        btn.onmouseleave = function () { this.style.opacity = '1'; };
    }
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