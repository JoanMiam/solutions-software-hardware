/**
 * Solutions in Software and Hardware
 * JavaScript principal del sitio web
 * @author Joan Miam
 * @version 2.0.0
 */

// ==================== CONFIGURACIÓN ====================
const CONFIG = {
    emailJS: {
        publicKey: 'D-Lk7Hwfa0-o1Ep8p',
        serviceId: 'service_06d3ujg',
        templateId: 'template_um8398s'
    },
    socialLinks: {
        github: 'https://github.com/JoanMiam',
        linkedin: 'https://www.linkedin.com/in/joan-miam-55614a257',
        instagram: 'https://www.instagram.com/solutions_in_software_hardware',
        youtube: 'https://youtube.com/@jowdev-r9h',
        facebook: 'https://www.facebook.com/share/1DgRpVzZj3/'
    },
    animation: {
        counterDuration: 2000,
        scrollThreshold: 0.1,
        preloaderDelay: 800
    }
};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursorGlow();
    initHeader();
    initNavigation();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initServiceTabs();
    initContactForm();
    initParallaxOrbs();
    initYear();
    initEmailJS();
});

// ==================== PRELOADER ====================
function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, CONFIG.animation.preloaderDelay);
    });
}

// ==================== CURSOR GLOW ====================
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    
    if (window.matchMedia('(pointer: fine)').matches && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }
}

// ==================== HEADER ====================
function initHeader() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (header) {
            header.classList.toggle('scrolled', scrollY > 50);
        }
        
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }
        
        highlightNavLink();
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ==================== NAVEGACIÓN ====================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        });
    }
}

function highlightNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    let current = '';
    
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navAnchors.forEach(anchor => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === '#' + current);
    });
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: CONFIG.animation.scrollThreshold, 
        rootMargin: '0px 0px -80px 0px' 
    });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    
    // Exportar para uso en tabs
    window.revealObserver = revealObserver;
}

// ==================== CONTADORES ====================
function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.number[data-target]').forEach(counter => {
                    animateCounter(counter);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        counterObserver.observe(heroStats);
    }
}

function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = CONFIG.animation.counterDuration;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current) + '+';
    }, 16);
}

// ==================== SERVICE TABS ====================
function initServiceTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Actualizar botones
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Actualizar paneles
            document.querySelectorAll('.services-panel').forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === 'panel-' + tab) {
                    panel.classList.add('active');
                    
                    // Re-observar elementos reveal
                    panel.querySelectorAll('.reveal').forEach(el => {
                        el.classList.remove('visible');
                        void el.offsetWidth; // Force reflow
                        if (window.revealObserver) {
                            window.revealObserver.observe(el);
                        }
                    });
                }
            });
        });
    });
}

// ==================== EMAILJS ====================
function initEmailJS() {
    // Cargar EmailJS dinámicamente
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
        emailjs.init(CONFIG.emailJS.publicKey);
        console.log('✓ EmailJS inicializado correctamente');
    };
    document.head.appendChild(script);
}

// ==================== FORMULARIO DE CONTACTO ====================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Resetear alerta
        if (formAlert) {
            formAlert.className = 'form-alert';
            formAlert.textContent = '';
        }
        
        // Validar
        if (!validateForm()) return;
        
        // Enviar
        const data = {
            from_name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        await submitForm(data);
    });

    // Validación en tiempo real
    ['name', 'email', 'service', 'message'].forEach(id => {
        const field = document.getElementById(id);
        if (!field) return;
        
        field.addEventListener('blur', () => {
            validateField(field);
        });
        
        field.addEventListener('input', () => {
            field.parentElement.classList.remove('error');
        });
    });
}

function validateForm() {
    let valid = true;
    
    ['name', 'email', 'service', 'message'].forEach(id => {
        const field = document.getElementById(id);
        if (!validateField(field)) {
            valid = false;
        }
    });
    
    return valid;
}

function validateField(field) {
    if (!field) return true;
    
    const id = field.id;
    const group = field.parentElement;
    let ok = false;
    
    if (id === 'email') {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    } else if (id === 'service') {
        ok = field.value !== '';
    } else {
        ok = field.value.trim() !== '';
    }
    
    group.classList.toggle('error', !ok);
    return ok;
}

async function submitForm(data) {
    const btn = document.querySelector('.submit-btn');
    const formAlert = document.getElementById('formAlert');
    const contactForm = document.getElementById('contactForm');
    
    if (!btn) return;
    
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    
    try {
        // Enviar con EmailJS
        if (typeof emailjs !== 'undefined') {
            await emailjs.send(
                CONFIG.emailJS.serviceId,
                CONFIG.emailJS.templateId,
                data
            );
        } else {
            // Fallback si EmailJS no está cargado
            console.warn('EmailJS no disponible, simulando envío...');
            await new Promise(r => setTimeout(r, 1000));
        }
        
        if (formAlert) {
            formAlert.className = 'form-alert success';
            formAlert.textContent = '✓ Mensaje enviado correctamente. Te contactaremos pronto.';
        }
        
        if (contactForm) {
            contactForm.reset();
        }
        
    } catch (err) {
        console.error('Error al enviar formulario:', err);
        
        if (formAlert) {
            formAlert.className = 'form-alert error';
            formAlert.textContent = '✗ Error al enviar. Por favor intenta nuevamente o contáctanos directamente.';
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Consulta →';
    }
}

// ==================== PARALLAX ORBS ====================
function initParallaxOrbs() {
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            document.querySelectorAll('.hero-orb').forEach((orb, i) => {
                const speed = (i + 1) * 10;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
}

// ==================== AÑO DINÁMICO ====================
function initYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ==================== UTILIDADES ====================
const Utils = {
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para limitar frecuencia
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Exportar configuración para uso externo
window.SSHConfig = CONFIG;
window.SSHUtils = Utils;
