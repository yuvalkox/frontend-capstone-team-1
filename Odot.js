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



const cards = document.querySelectorAll(".founder-card");
const bioDisplay = document.getElementById("bio-display");

for (let i = 0; i < cards.length; i++) {
  cards[i].onclick = function () {
    const bioText = this.getAttribute("data-bio");
    const nameEl = this.querySelector(".name");
    let name = "";
    
    if (nameEl !== null) {
      name = nameEl.textContent;
    }
    
    if (bioDisplay !== null) {
      bioDisplay.innerHTML = "<strong>" + name + ":</strong> " + bioText;
    }
  };
}

// --- טופס יצירת קשר  ---
const form = document.getElementById("contact-form");
const modal = document.getElementById("yoli-modal");
const modalOk = document.getElementById("yoli-modal-ok");

const nameInput = document.getElementById("full-name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// פונקציות
function openYoliModal(title, text) {
  if (modal !== null) {
    document.getElementById("yoli-modal-title").textContent = title;
    document.getElementById("yoli-modal-text").textContent = text;
    modal.classList.add("is-open");
  }
}

if (modalOk !== null) {
  modalOk.onclick = function () {
    modal.classList.remove("is-open");
  };
}

// הגבלת טלפון ל-10 ספרות
if (phoneInput !== null) {
  phoneInput.oninput = function () {
    let digits = this.value.replace(/\D/g, "");
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    this.value = digits;
  };
}

// שליחת הטופס
if (form !== null) {
  form.onsubmit = function (e) {
    e.preventDefault();

    let isNameOk = false;
    if (nameInput.value.trim().length >= 2) {
      isNameOk = true;
    }

    let isPhoneOk = false;
    if (phoneInput.value.length === 10 && phoneInput.value.charAt(0) === "0") {
      isPhoneOk = true;
    }

    let isMsgOk = false;
    if (messageInput.value.trim().length >= 5) {
      isMsgOk = true;
    }

    if (isNameOk && isPhoneOk && isMsgOk) {
      openYoliModal("נשלח בהצלחה", "תודה! נחזור אלייך בהקדם.");
      form.reset();
    } else {
      openYoliModal("יש שדות שצריך לתקן", "נא לוודא שהשם תקין, הטלפון מכיל 10 ספרות וההודעה אינה קצרה מדי.");
    }
  };
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