
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

// רדיו של קטגוריות
const catAll = document.getElementById("cat-all");
const catStarters = document.getElementById("cat-starters");
const catSalads = document.getElementById("cat-salads");
const catPizza = document.getElementById("cat-pizza");
const catDesserts = document.getElementById("cat-desserts");
const catDrinks = document.getElementById("cat-drinks");

// סקשנים
const secStarters = document.getElementById("section-starters");
const secSalads = document.getElementById("section-salads");
const secPizza = document.getElementById("section-pizza");
const secDesserts = document.getElementById("section-desserts");
const secDrinks = document.getElementById("section-drinks");

const sections = [secStarters, secSalads, secPizza, secDesserts, secDrinks];

// טבעוני
const veganToggle = document.getElementById("filter-vegan");

// כל המנות
const items = document.querySelectorAll("article.menu-item");

function showAllSections() {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i]) sections[i].style.display = "";
  }
}

function showOnlySection(sectionToShow) {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i]) {
      if (sections[i] === sectionToShow) {
        sections[i].style.display = "";
      } else {
        sections[i].style.display = "none";
      }
    }
  }
}

function applyVeganFilter() {
  let veganOnly = false;
  if (veganToggle) {
    veganOnly = veganToggle.checked;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const parentSection = item.closest("section");

    let sectionHidden = false;
    if (parentSection && parentSection.style.display === "none") {
      sectionHidden = true;
    }

    if (sectionHidden) {
      item.style.display = "none";
    } else {
      const isVegan = (item.getAttribute("data-vegan") === "true");

      if (veganOnly === false) {
        item.style.display = "";
      } else {
        if (isVegan === true) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      }
    }
  }
}


function applyFilters() {
  if (catAll && catAll.checked) showAllSections();
  else if (catStarters && catStarters.checked) showOnlySection(secStarters);
  else if (catSalads && catSalads.checked) showOnlySection(secSalads);
  else if (catPizza && catPizza.checked) showOnlySection(secPizza);
  else if (catDesserts && catDesserts.checked) showOnlySection(secDesserts);
  else if (catDrinks && catDrinks.checked) showOnlySection(secDrinks);

  applyVeganFilter();
}

const radios = document.querySelectorAll('input[name="cat"]');
for (let i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", applyFilters);
}

if (veganToggle) veganToggle.addEventListener("change", applyFilters);

applyFilters();


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