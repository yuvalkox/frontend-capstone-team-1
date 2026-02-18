  
    // הגדרות וקונפיגורציה
    const restaurantConfig = {
        "openingHours": {
            "weekday": ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"],
            "saturday": ["20:00", "20:30", "21:00", "21:30", "22:00", "23:00"],
            "closedDays": [5] // שישי סגור
        }
    };

// הגדרת משתנים למצב לילה/יום
const body = document.body;
const darkBtn = document.getElementById("dark-mode-toggle");
const lightBtn = document.getElementById("light-mode-toggle");

const form = document.getElementById('reservationForm');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');


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


// ניהול טופס הזמנה
    const now = new Date();
    const todayStr = now.toLocaleDateString('sv-SE'); // פורמט תאריך תקני
    if (dateInput) dateInput.min = todayStr;

    // בדיקת תקינות מספר טלפון
    function validatePhone() {
        if (!phoneInput) return true;
        const phoneValue = phoneInput.value.trim();
        if (phoneValue.length === 0) {
            phoneError.style.display = "none";
            phoneInput.classList.remove('invalid');
            return true;
        } 
        const isValid = !isNaN(phoneValue) && phoneValue.length === 10 && phoneValue.startsWith('0');
        if (!isValid) {
            phoneError.textContent = "נא להזין מספר טלפון תקין (10 ספרות)";
            phoneError.style.display = "block";
            phoneInput.classList.add('invalid');
            return false;
        }
        phoneError.style.display = "none";
        phoneInput.classList.remove('invalid');
        return true;
    }

    // מילוי השעות בתיבת הבחירה
    function populateHours(hourArray) {
        if (!timeSelect) return;
        timeSelect.innerHTML = '<option value="" disabled selected>בחר שעת הגעה</option>';
        const isToday = (dateInput.value === todayStr);
        const currentHour = new Date().getHours();
        const currentMin = new Date().getMinutes();

        for (let i = 0; i < hourArray.length; i++) {
            const hour = hourArray[i];
            const timeParts = hour.split(':');
            const h = Number(timeParts[0]);
            const m = Number(timeParts[1]);
            
            const opt = document.createElement('option');
            opt.value = hour;
            opt.textContent = hour;
            
            // חוסם שעות שכבר עברו אם התאריך הוא להיום
            if (isToday && (h < currentHour || (h === currentHour && m <= currentMin))) {
                opt.disabled = true;
            }
            timeSelect.appendChild(opt);
        }
    }

    // עדכון שעות פתיחה לפי היום שנבחר
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            if (!this.value) return;
            const day = new Date(this.value).getDay();
            
            // בדיקה אם נבחר יום שישי
            if (restaurantConfig.openingHours.closedDays.includes(day)) {
                timeSelect.innerHTML = '<option value="closed">המסעדה סגורה</option>';
                timeSelect.disabled = true;
                showStatus("המסעדה סגורה בימי שישי - נא לבחור תאריך אחר");
                return;
            }
            
            timeSelect.disabled = false;
            let relevantHours;
            if (day === 6) {
                relevantHours = restaurantConfig.openingHours.saturday;
            } else {
                relevantHours = restaurantConfig.openingHours.weekday;
            }
            populateHours(relevantHours);
        }); 
    }

    if (phoneInput) phoneInput.addEventListener('input', validatePhone);

    // שליחת הטופס והצגת כרטיס אישור
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!form.checkValidity() || !validatePhone()) return;

            const guests = document.getElementById('guests').value;
            if (guests === "10+") {
                showStatus("להזמנות מעל 10 סועדים - אנא התקשרו למסעדה");
                return;
            }

            // העברת נתונים לסיכום ההזמנה
            document.getElementById('confName').textContent = document.getElementById('name').value.trim();
            document.getElementById('confDate').textContent = dateInput.value.split('-').reverse().join('/');
            document.getElementById('confTime').textContent = timeSelect.value;
            document.getElementById('confGuests').textContent = guests;
            document.getElementById('confArea').textContent = document.getElementById('area').value;

            form.style.display = 'none';
            const confBox = document.getElementById('confirmationBox');
            if (confBox) confBox.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // פונקציה להצגת מודל הודעות
    function showStatus(text) {
        document.getElementById('messageText').textContent = text;
        document.getElementById('message').style.display = "block";
        const closeBtn = document.querySelector('.message-btn');
        closeBtn.onclick = function() { 
            document.getElementById('message').style.display = "none"; 
        };
    }
};

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