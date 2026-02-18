document.addEventListener('DOMContentLoaded', function () {

  const wine = 'rgba(139,44,48,1)';
  const lightWineActive = 'rgba(210, 100, 110, 0.4)';
  const light = '#cbcbcaff';
  const black = '#000';
  const white = '#fff';

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

// כפתורים גדולים (Order / Contact)
  function buttonHover(btn) {
    if (!btn) return;
    btn.style.backgroundColor = light;
    btn.style.color = black;
    btn.style.borderColor = wine;
   
    btn.addEventListener('mouseenter', function() {
      btn.style.backgroundColor = wine;
      btn.style.color = white;
    });
   
    btn.addEventListener('mouseleave', function() {
      btn.style.backgroundColor = light;
      btn.style.color = black;
    });
   
    btn.addEventListener('mousedown', function() {
      btn.style.backgroundColor = wine;
    });
  }

  buttonHover(document.getElementById('orderBtn'));
  buttonHover(document.getElementById('ctaBtn'));


// פוטר 

const footerIcons = document.querySelectorAll('.footer-social a');
for (let k = 0; k < footerIcons.length; k++) {
    footerIcons[k].addEventListener('mouseenter', function() {
        this.style.color = light;
    });
    footerIcons[k].addEventListener('mouseleave', function() {
        this.style.color = white;
    });
    }
  });