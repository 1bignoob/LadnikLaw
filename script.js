const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("section[id]");

// hero elements (used for size / other features)
const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-bg");

/* New form */
const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let submissionSucceeded = false;

  const formData = new FormData(form);

  // Get the name input value
  const name = formData.get("name");

  // Create a custom subject
  const subject = `${name} sent a message through LadnikLaw.com`;

  // Append the custom subject to the form data
  formData.append("subject", subject);

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        submissionSucceeded = true;
        result.style.display = "block";
        result.innerHTML = `${json.message}. Someone from the offices of Ladnik will contact you shortly.`;
      } else {
        console.log(response);
        submissionSucceeded = false;
        result.style.display = "block";
        result.innerHTML = json.message;
      }
    })
    .catch((error) => {
      console.log(error);
      submissionSucceeded = false;
      result.style.display = "block";
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      if (submissionSucceeded) {
        form.reset();
        return;
      }

      setTimeout(() => {
        result.style.display = "none";
      }, 3000);
    });
});

/* End new form */

if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    if (navbar && window.innerWidth <= 860) {
      navbar.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

function showNotification(message) {
  const existing = document.querySelector(".notification");

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement("div");
  notification.className = "notification notification-success";
  notification.textContent = message;
  document.body.appendChild(notification);

  window.setTimeout(() => {
    notification.remove();
  }, 3600);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  },
);

const revealGroups = [
  ".section",
  ".reveal-item",
  ".highlight-card",
  ".practice-card",
  ".process-step",
  ".trust-quote",
  ".trust-list",
  ".contact-panel",
  ".contact-form",
];

const revealedElements = new Set();

revealGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((item) => {
    if (revealedElements.has(item)) return;

    revealedElements.add(item);
    item.classList.add("reveal-item");

    const group = item.closest(
      ".about-highlights, .practice-grid, .process-grid, .trust-grid, .contact-layout",
    );
    const siblings = group ? Array.from(group.children) : [];
    const indexInGroup = siblings.indexOf(item);
    const staggerIndex = indexInGroup >= 0 ? indexInGroup : 0;

    item.style.transitionDelay = `${staggerIndex * 90}ms`;
    observer.observe(item);
  });
});

function syncActiveNav() {
  let activeId = "";

  sections.forEach((section) => {
    const top = window.scrollY + 180;

    if (top >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", matches);
  });
}

window.addEventListener(
  "scroll",
  (e) => {
    syncActiveNav(e);
  },
  { passive: true },
);
window.addEventListener("load", () => {
  syncActiveNav();
});

// Close mobile dropdown when clicking outside, on Escape, or when resizing to desktop
document.addEventListener("click", (e) => {
  const toggle = document.querySelector(".menu-toggle");
  const navbarEl = document.querySelector(".navbar");
  const navMenu = document.querySelector(".nav-menu");
  if (!toggle || !navbarEl || !navMenu) return;

  const isOpen = navbarEl.classList.contains("is-open");
  if (!isOpen) return;

  // if the click is inside the nav or on the toggle, do nothing
  const withinNav = e
    .composedPath()
    .some(
      (el) =>
        el === navMenu ||
        el === toggle ||
        (el &&
          el.classList &&
          el.classList.contains &&
          el.classList.contains("nav-dropdown")),
    );
  if (withinNav) return;

  // otherwise close
  navbarEl.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navbarEl = document.querySelector(".navbar");
    const toggle = document.querySelector(".menu-toggle");
    if (navbarEl && navbarEl.classList.contains("is-open")) {
      navbarEl.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  }
});

window.addEventListener("resize", () => {
  const navbarEl = document.querySelector(".navbar");
  const toggle = document.querySelector(".menu-toggle");
  if (
    window.innerWidth > 860 &&
    navbarEl &&
    navbarEl.classList.contains("is-open")
  ) {
    navbarEl.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});
