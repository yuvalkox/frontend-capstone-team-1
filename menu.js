
const body = document.body;
const darkBtn = document.getElementById("dark-mode-toggle");
//הפעלת מצב לילה
if (darkBtn) {
  const savedTheme = localStorage.getItem("yoli-theme");
  if (savedTheme === "dark") {
    body.classList.add("theme-dark");
  }

  darkBtn.addEventListener("click", function () {
    const isDark = body.classList.toggle("theme-dark");

    if (isDark) {
      localStorage.setItem("yoli-theme", "dark");
    } else {
      localStorage.setItem("yoli-theme", "light");
    }
  });
}


const navToggle = document.getElementById("nav-toggle"); 
const nav = document.getElementById("nav");
const hamburger = document.querySelector('label.hamburger[for="nav-toggle"]');

// סגירת תפריט ניווט לאחר לחיצה על קישור או מחוץ לתפריט
if (navToggle && nav) {
  const links = nav.querySelectorAll("a");
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      navToggle.checked = false;
    });
  }

 
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

// הוספת מחלקת ui-active לאלמנטים אינטראקטיביים
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

makeInteractive(darkBtn);
makeInteractive(document.getElementById("cart-link"));
makeInteractive(hamburger);

if (nav) {
  const navLinks = nav.querySelectorAll("a");
  for (let i = 0; i < navLinks.length; i++) {
    makeInteractive(navLinks[i]);
  }
}
