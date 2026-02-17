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





const BASE_PRICE = 42;
const urlParams = new URLSearchParams(window.location.search);
const cartIndex = urlParams.get('cartIndex');

const quantityInput = document.getElementById('quantity');
const btnPriceElement = document.getElementById('btn-price');
const currentPriceTop = document.getElementById('currentPrice');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
const otherInfoInput = document.getElementById('other-info');

// פונקציה לעדכון המחיר המוצג
function updatePrice() {
  let pricePerUnit = BASE_PRICE;
  
  // חישוב תוספות בתשלום בלולאת for
  const checkedExtras = document.querySelectorAll('.options-group input:checked');
  for (let i = 0; i < checkedExtras.length; i++) {
    const selectedExtra = checkedExtras[i];
    const extraPrice = parseInt(selectedExtra.getAttribute('data-price'));
    if (extraPrice) {
      pricePerUnit += extraPrice;
    }
  }

  const quantity = parseInt(quantityInput.value) || 1;
  const totalPrice = pricePerUnit * quantity;

  if (btnPriceElement) btnPriceElement.innerText = "(₪" + totalPrice + ")";
}

// טעינת נתונים אם המשתמש הגיע ממצב עריכה
  if (cartIndex !== null) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart[cartIndex];

    if (item) {
      addToCartBtn.firstChild.textContent = "עדכון מנה ";
      quantityInput.value = item.quantity || 1;
      otherInfoInput.value = item.notes || "";
      
      // סימון תוספות שנשמרו
      if (item.extras) {
        const extraInputs = document.querySelectorAll('.options-group input');
        for (let i = 0; i < extraInputs.length; i++) {
          const input = extraInputs[i];
          const checkboxName = input.parentElement.innerText.split('(')[0].trim();
          
          // בדיקת קיום תוספת במערך
          for (let j = 0; j < item.extras.length; j++) {
            if (item.extras[j].indexOf(checkboxName) !== -1) {
              input.checked = true;
            }
          }
        }
      }
    }
  }
  updatePrice();


// לחיצה על הוספה/עדכון לסל
addToCartBtn.addEventListener('click', function () {
  const quantity = parseInt(quantityInput.value);
  const notes = otherInfoInput.value;
  
  // איסוף פריטים שהוסרו
  const removedItems = [];
  const basicOptions = document.querySelectorAll('.options input[type="checkbox"]:not([name="sub-bulgarian"])');
  for (let i = 0; i < basicOptions.length; i++) {
    if (!basicOptions[i].checked) {
      removedItems.push(basicOptions[i].parentElement.innerText.trim());
    }
  }

  // איסוף תוספות בתשלום
  const extras = [];
  let extrasTotal = 0;
  const paidExtras = document.querySelectorAll('.options-group input[type="checkbox"]:checked');
  for (let j = 0; j < paidExtras.length; j++) {
    const price = parseInt(paidExtras[j].getAttribute('data-price')) || 0;
    const name = paidExtras[j].parentElement.innerText.split('(')[0].trim();
    extras.push(name + " (₪" + price + ")");
    extrasTotal += price;
  }

  const cartItem = {
    name: 'סלט יווני מרענן',
    price: BASE_PRICE + extrasTotal,
    quantity: quantity,
    image: '/תמונות/סלט יווני.png',
    notes: notes,
    removedItems: removedItems,
    extras: extras
  };

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let msg = "הסלט נוסף לסל בהצלחה!";
  let isUpdate = false;

  if (cartIndex !== null && cart[cartIndex]) {
    cart[cartIndex] = cartItem;
    msg = "המנה עודכנה בהצלחה!";
    isUpdate = true;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showMessage(msg, isUpdate);
  setTimeout(function () { 
    window.location.href = 'checkout.html'; 
  }, 1000);
});

// מאזינים לשינויים בכמות ובצ'קבוקסים
quantityInput.addEventListener('input', updatePrice);

const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
for (let k = 0; k < allCheckboxes.length; k++) {
  allCheckboxes[k].addEventListener('change', updatePrice);
}

// לוגיקת החלפת גבינה
const feta = document.querySelector('input[name="no-cheese"]');
const bulgarian = document.querySelector('input[name="sub-bulgarian"]');
if (feta && bulgarian) {
  bulgarian.addEventListener('change', function () {
    if (bulgarian.checked) feta.checked = false;
  });
  feta.addEventListener('change', function () {
    if (feta.checked) bulgarian.checked = false;
  });
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