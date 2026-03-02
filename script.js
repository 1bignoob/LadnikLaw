const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contactForm');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        if (navbar && window.innerWidth <= 860) {
            navbar.classList.remove('is-open');
            menuToggle?.setAttribute('aria-expanded', 'false');
        }
    });
});

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        contactForm.reset();
        showNotification('Consultation request captured. Connect this form to your inbox or CRM next.');
    });
}

function showNotification(message) {
    const existing = document.querySelector('.notification');

    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = message;
    document.body.appendChild(notification);

    window.setTimeout(() => {
        notification.remove();
    }, 3600);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
});

document.querySelectorAll('.reveal-item').forEach((item) => {
    observer.observe(item);
});

function syncActiveNav() {
    let activeId = '';

    sections.forEach((section) => {
        const top = window.scrollY + 180;

        if (top >= section.offsetTop) {
            activeId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const matches = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('is-active', matches);
    });
}

window.addEventListener('scroll', syncActiveNav, { passive: true });
window.addEventListener('load', syncActiveNav);

// Close mobile dropdown when clicking outside, on Escape, or when resizing to desktop
document.addEventListener('click', (e) => {
    const toggle = document.querySelector('.menu-toggle');
    const navbarEl = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    if (!toggle || !navbarEl || !navMenu) return;

    const isOpen = navbarEl.classList.contains('is-open');
    if (!isOpen) return;

    // if the click is inside the nav or on the toggle, do nothing
    const withinNav = e.composedPath().some((el) => el === navMenu || el === toggle || (el && el.classList && el.classList.contains && el.classList.contains('nav-dropdown')));
    if (withinNav) return;

    // otherwise close
    navbarEl.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navbarEl = document.querySelector('.navbar');
        const toggle = document.querySelector('.menu-toggle');
        if (navbarEl && navbarEl.classList.contains('is-open')) {
            navbarEl.classList.remove('is-open');
            toggle?.setAttribute('aria-expanded', 'false');
        }
    }
});

window.addEventListener('resize', () => {
    const navbarEl = document.querySelector('.navbar');
    const toggle = document.querySelector('.menu-toggle');
    if (window.innerWidth > 860 && navbarEl && navbarEl.classList.contains('is-open')) {
        navbarEl.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
    }
});
