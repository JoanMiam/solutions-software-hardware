/**
 * Solutions in Software and Hardware
 * JavaScript principal
 * @version 4.0.0
 */

// ==================== CONFIGURACIÓN ====================
const CONFIG = {
    emailjs: {
        publicKey: 'D-Lk7Hwfa0-o1Ep8p',
        serviceId: 'service_06d3ujg',
        templateId: 'template_um8398s'
    },
    social: {
        github: 'https://github.com/JoanMiam',
        linkedin: 'https://www.linkedin.com/in/joan-miam-55614a257',
        instagram: 'https://www.instagram.com/solutions_in_software_hardware',
        youtube: 'https://youtube.com/@jowdev-r9h',
        facebook: 'https://www.facebook.com/share/1DgRpVzZj3/'
    }
};

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileNav();
    initCursorGlow();
    initScrollReveal();
    initBackToTop();
    initContactForm();
    initYear();
    initParallaxScroll();
    initMagneticHover();
});

// ==================== HEADER ====================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ==================== MOBILE NAVIGATION ====================
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Keyboard accessibility
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
}

// ==================== CURSOR GLOW ====================
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) {
        if (glow) glow.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animate() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        glow.style.left = currentX + 'px';
        glow.style.top = currentY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const alert = document.getElementById('formAlert');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset errors
        form.querySelectorAll('.form-field').forEach(g => g.classList.remove('error'));

        // Get fields
        const fields = {
            name: form.querySelector('#name'),
            email: form.querySelector('#email'),
            phone: form.querySelector('#phone'),
            message: form.querySelector('#message')
        };

        // Validate
        let isValid = true;

        if (!fields.name || !fields.name.value.trim()) {
            if (fields.name) fields.name.parentElement.classList.add('error');
            isValid = false;
        }

        if (!fields.email || !fields.email.value.trim() || !isValidEmail(fields.email.value)) {
            if (fields.email) fields.email.parentElement.classList.add('error');
            isValid = false;
        }

        if (!fields.message || !fields.message.value.trim()) {
            if (fields.message) fields.message.parentElement.classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            showAlert(alert, 'error', 'Por favor completa los campos requeridos.');
            return;
        }

        // Submit
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // Sin EmailJS (CDN bloqueado o sin conexión) no hay envío: debe verse como error
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está disponible');
            }

            const name = fields.name.value.trim();
            const phone = fields.phone ? fields.phone.value.trim() : '';

            const subject = `Nuevo proyecto - ${name}`;

            // Build complete message
            const fullMessage = phone
                ? `${fields.message.value}\n\n---\nTel: ${phone}`
                : fields.message.value;

            // EmailJS Integration
            await emailjs.send(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                {
                    from_name: name,
                    from_email: fields.email.value.trim(),
                    subject: subject,
                    message: fullMessage
                }
            );

            showAlert(alert, 'success', '¡Mensaje enviado! Te contactaremos pronto.');
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            showAlert(alert, 'error', 'Error al enviar. Intenta de nuevo o escríbenos directamente.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showAlert(el, type, message) {
    if (!el) return;
    el.className = `form-alert ${type}`;
    el.textContent = message;
    el.style.display = 'block';

    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// ==================== YEAR ====================
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ==================== PARALLAX SCROLL ====================
function initParallaxScroll() {
    const heroBg = document.querySelector('.hero-bg');
    const heroGridBg = document.querySelector('.hero-grid-bg');

    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

        // Solo aplicar parallax si estamos en el hero
        if (scrolled < heroHeight) {
            const speed = 0.5;

            // Parallax del fondo
            heroBg.style.transform = `translateY(${scrolled * speed}px)`;

            if (heroGridBg) {
                heroGridBg.style.transform = `translateY(${scrolled * speed * 0.8}px)`;
            }
        }
    });
}

// ==================== MAGNETIC HOVER ====================
function initMagneticHover() {
    const btn = document.querySelector('.btn-primary-lg');
    if (!btn) return;

    const strength = 20; // Intensidad del efecto magnético

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = (x / rect.width) * strength;
        const moveY = (y / rect.height) * strength;

        btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
    });

    // Efecto 3D en hover
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    });
}

// ==================== EMAILJS INIT ====================
(function () {
    // Load EmailJS if not present
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(CONFIG.emailjs.publicKey);
        };
        document.head.appendChild(script);
    }
})();

// ==================== PORTFOLIO CAROUSEL ====================
const carousel = document.getElementById('portfolioCarousel');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

if (carousel && prevBtn && nextBtn) {
    const scrollAmount = () => carousel.querySelector('.pf-card')?.offsetWidth + 24 || 444;

    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    });

    // Sin desbordamiento no hay nada que desplazar: se ocultan las flechas
    const updateArrows = () => {
        const overflows = carousel.scrollWidth > carousel.clientWidth + 1;
        prevBtn.hidden = !overflows;
        nextBtn.hidden = !overflows;
    };

    updateArrows();
    window.addEventListener('load', updateArrows);
    window.addEventListener('resize', updateArrows, { passive: true });
}
