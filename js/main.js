/**
 * Solutions in Software and Hardware
 * JavaScript principal
 * @version 3.0.0
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
    initPreloader();
    initHeader();
    initMobileNav();
    initCursorGlow();
    initScrollReveal();
    initBackToTop();
    initContactForm();
    initYear();
});

// ==================== PRELOADER ====================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
    
    // Fallback
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);
}

// ==================== HEADER ====================
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
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
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
        
        // Validate
        let isValid = true;
        const fields = {
            name: form.querySelector('#name'),
            email: form.querySelector('#email'),
            service: form.querySelector('#service'),
            message: form.querySelector('#message')
        };
        
        if (!fields.name.value.trim()) {
            fields.name.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!fields.email.value.trim() || !isValidEmail(fields.email.value)) {
            fields.email.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!fields.service.value) {
            fields.service.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!fields.message.value.trim()) {
            fields.message.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // EmailJS Integration
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(
                    CONFIG.emailjs.serviceId,
                    CONFIG.emailjs.templateId,
                    {
                        from_name: fields.name.value,
                        from_email: fields.email.value,
                        company: form.querySelector('#company')?.value || 'No especificada',
                        service: fields.service.value,
                        message: fields.message.value
                    }
                );
            }
            
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

// ==================== EMAILJS INIT ====================
(function() {
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
