/**
 * Solutions in Software and Hardware
 * JavaScript principal
 * @version 4.0.0
 */

// ==================== CONFIGURACIÓN ====================
const CONFIG = {
    // Datos de contacto: se cambian aquí y initContactLinks() los pone en toda la página.
    // El HTML trae los mismos datos escritos como respaldo, y el JSON-LD del <head> también.
    contacto: {
        whatsapp: '5219902286209',          // número para wa.me, con prefijo 521
        telefono: '+529902286209',          // para enlaces tel:
        telefonoVisible: '990 228 6209',    // como se lee en la página
        correo: 'joanchan082@gmail.com',
        // Mensaje prellenado de WhatsApp cuando el enlace no trae uno propio
        mensaje: 'Hola, vi su página y quiero información para mi negocio.'
    },
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
    initMobileNav();
    initScrollReveal();
    initContactLinks();
    initContactForm();
    initYear();
    initHeroBrain();
});

// ==================== MOBILE NAVIGATION ====================
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (!hamburger || !navLinks) return;

    const setOpen = (open) => {
        hamburger.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
        setOpen(!navLinks.classList.contains('active'));
    });

    // Cerrar al elegir un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    // Cerrar al tocar fuera o con Escape
    document.addEventListener('click', (e) => {
        if (!navLinks.classList.contains('active')) return;
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) setOpen(false);
    });
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
        // El texto vive en .submit-label, para no borrar otros hijos del botón
        const submitLabel = submitBtn.querySelector('.submit-label') || submitBtn;
        const originalText = submitLabel.textContent;
        submitLabel.textContent = 'Enviando...';
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
            submitLabel.textContent = originalText;
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

// ==================== ENLACES DE CONTACTO ====================
// Pone el número y el correo de CONFIG.contacto en los enlaces marcados en el HTML:
// - a[data-wa]: WhatsApp con mensaje prellenado (el valor del atributo, o el mensaje general)
// - a[data-tel] y [data-tel-texto]: enlace de llamada y número visible
// - a[data-correo] y [data-correo-texto]: enlace de correo y dirección visible
function initContactLinks() {
    const c = CONFIG.contacto;

    document.querySelectorAll('a[data-wa]').forEach(a => {
        const texto = a.dataset.wa || c.mensaje;
        a.href = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(texto)}`;
    });

    document.querySelectorAll('a[data-tel]').forEach(a => {
        a.href = `tel:${c.telefono}`;
    });
    document.querySelectorAll('[data-tel-texto]').forEach(el => {
        el.textContent = c.telefonoVisible;
    });

    document.querySelectorAll('a[data-correo]').forEach(a => {
        a.href = `mailto:${c.correo}`;
    });
    document.querySelectorAll('[data-correo-texto]').forEach(el => {
        el.textContent = c.correo;
    });
}

// ==================== YEAR ====================
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ==================== HERO BRAIN ====================
// Cerebro 3D en canvas 2D, sin librerías: una nube de puntos con forma de cerebro y, dentro,
// neuronas de colores con sus dendritas, unidas por fibras curvas por donde viajan señales.
// Se arma solo al cargar, lo recorre una ola de actividad cada tanto y reacciona al mouse.
function initHeroBrain() {
    const canvas = document.getElementById('heroBrain');
    if (!canvas || !canvas.getContext) return;

    const stage = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const dark = stage.dataset.stage === 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 768px)').matches;
    const TAU = Math.PI * 2;

    // Colores: la nube sigue a los tokens del CSS y cada familia de neuronas tiene el suyo
    // (ámbar, azul, verde, rosa, violeta). Sobre fondo claro van tonos más profundos para
    // que las líneas finas no se laven; salen de los tokens --familia-*, que también usan
    // las tarjetas de servicios.
    const css = getComputedStyle(document.documentElement);
    const rgb = (token, fallback) => {
        const hex = (css.getPropertyValue(token).trim() || fallback).replace('#', '');
        return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ');
    };
    const CLOUD = dark ? rgb('--teal', '#22C7B8') : rgb('--teal-ink', '#0B7A70');
    const FAMILIES = dark
        ? ['251, 191, 36', '96, 165, 250', '52, 211, 153', '244, 114, 182', '167, 139, 250']
        : [
            rgb('--familia-ambar', '#D97706'),
            rgb('--familia-azul', '#2563EB'),
            rgb('--familia-verde', '#059669'),
            rgb('--familia-rosa', '#DB2777'),
            rgb('--familia-violeta', '#7C3AED')
        ];
    const SPARK = dark ? '255, 255, 255' : null; // destello de la nube; en claro usa el color del punto

    // Azar con semilla fija: el mismo cerebro en cada carga
    let seed = 11;
    const rand = () => {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const smooth = (from, to, v) => {
        const t = clamp((v - from) / (to - from));
        return t * t * (3 - 2 * t);
    };
    // Llega pasándose un poco y regresa: da el "pop" al aparecer
    const overshoot = (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
    const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
    const unit = (v) => {
        const length = Math.hypot(v[0], v[1], v[2]) || 1;
        return [v[0] / length, v[1] / length, v[2] / length];
    };
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const randomDir = () => unit([rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1]);
    // Reparte n direcciones de forma pareja sobre una esfera
    const onSphere = (n, fn) => {
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
            const y = 1 - (2 * (i + 0.5)) / n;
            const r = Math.sqrt(1 - y * y);
            fn(r * Math.cos(i * golden), y, r * Math.sin(i * golden));
        }
    };

    // ---- Forma. Ejes: x = ancho, y = alto, z = largo (frente en +z) ----
    // Hemisferios: elipsoide con surco central, base aplanada, lóbulo temporal y pliegues
    const cerebrum = (dx, dy, dz) => {
        let x = dx * 0.78;
        let y = dy * 0.62;
        let z = dz;

        const groove = 1 - 0.24 * Math.exp(-((dx / 0.17) ** 2)) * smooth(-0.45, -0.05, dy);
        x *= groove;
        y *= groove;
        z *= groove;

        x += Math.sign(dx || 1) * 0.045;
        x *= 1 - 0.16 * smooth(0.15, 1, dz) + 0.03 * smooth(0.2, 1, -dz);
        y *= y > 0 ? 1 - 0.14 * smooth(0.35, 1, dz) : 0.74;

        const temporal = Math.exp(-(((dz - 0.2) / 0.45) ** 2)) * smooth(-0.05, -0.6, dy) * smooth(0.3, 0.75, Math.abs(dx));
        y -= 0.1 * temporal;
        x *= 1 + 0.1 * temporal;

        const fold = 1 + 0.035 * Math.sin(dx * 9 + dz * 5) * Math.sin(dy * 11 + dz * 7);
        return [x * fold, y * fold, z * fold];
    };
    // Familia según la zona: frontal, parietal, occipital, temporal (la 4 es el cerebelo)
    const familyOf = (dx, dy, dz) => (dz > 0.4 ? 0 : dz < -0.55 ? 2 : dy > 0.25 ? 1 : 3);

    // Todos los puntos 3D (nube, neuronas, dendritas, fibras) van a un solo arreglo
    // para proyectarlos de una pasada en cada cuadro.
    const verts = [];
    const vertex = (p) => {
        verts.push(p[0], p[1], p[2]);
        return verts.length / 3 - 1;
    };

    // ---- Nube de puntos: la silueta del cerebro ----
    // cloud[0] lleva el color base; cloud[1..5], los puntos teñidos con el color de su zona
    const cloud = [[], [], [], [], [], []];
    const cloudPoint = (p, family) => {
        cloud[rand() < 0.3 ? family + 1 : 0].push(vertex(add(p, randomDir(), 0.03 * rand())));
    };
    onSphere(compact ? 1300 : 2600, (dx, dy, dz) => cloudPoint(cerebrum(dx, dy, dz), familyOf(dx, dy, dz)));
    onSphere(compact ? 220 : 420, (dx, dy, dz) => {
        if (dy <= 0.45) cloudPoint([dx * 0.46, -0.47 + dy * 0.24, -0.66 + dz * 0.32], 4);
    });
    for (let i = 0; i < (compact ? 60 : 110); i++) {
        const t = rand();
        const angle = rand() * TAU;
        const radius = 0.11 - 0.03 * t;
        cloudPoint([Math.cos(angle) * radius, -0.5 - 0.5 * t, -0.34 - 0.1 * t + Math.sin(angle) * radius], 4);
    }

    // ---- Tiempos (segundos). Una ola barre el cerebro de frente a nuca: la primera lo
    // va revelando al cargar y las siguientes solo lo iluminan. ----
    const SWEEP_FROM = 1.15;
    const SWEEP_SPAN = 2.3;
    const INTRO_SWEEP = 1.7;
    const WAVE_EVERY = 9;
    const WAVE_TIME = 2.1;
    const FIRST_WAVE = 7;
    const INTRO_END = 3.2;
    const swept = (z) => 0.1 + ((SWEEP_FROM - z) / SWEEP_SPAN) * INTRO_SWEEP; // cuándo pasa la ola inicial por z
    const waveFront = (time) => {
        if (time < 0.1 + INTRO_SWEEP) return SWEEP_FROM - ((time - 0.1) / INTRO_SWEEP) * SWEEP_SPAN;
        const since = time - FIRST_WAVE;
        if (since < 0) return -9;
        const phase = since % WAVE_EVERY;
        return phase < WAVE_TIME ? SWEEP_FROM - (phase / WAVE_TIME) * SWEEP_SPAN : -9;
    };

    // ---- Neuronas: cuerpo + dendritas que se bifurcan ----
    const neurons = [];
    const grow = (neuron, fromIndex, from, dir, length, level) => {
        const bend = unit(cross(dir, randomDir()));
        const mid = add(add(from, dir, length * 0.5), bend, length * 0.16);
        const end = add(add(from, dir, length), bend, length * 0.05);
        const midIndex = vertex(mid);
        const endIndex = vertex(end);
        neuron.branches[level].push(fromIndex, midIndex, endIndex);
        if (level < 1) {
            for (let k = 0; k < 2; k++) {
                grow(neuron, endIndex, end, unit(add(dir, randomDir(), 0.8)), length * 0.6, level + 1);
            }
        }
        return endIndex;
    };
    const addNeuron = (position, family, size) => {
        const normal = unit(position);
        const side = unit(cross(normal, Math.abs(normal[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0]));
        const up = cross(normal, side);
        const neuron = {
            soma: vertex(position), family, size,
            bornAt: swept(position[2]), // brota cuando la ola inicial pasa por ella
            flash: 0, ring: 1, hover: 0, cooldown: 0,
            branches: [[], []], // tríos [desde, control, hasta] por nivel de bifurcación
            arcs: [],
        };

        // Dendrita apical: la más larga, hacia afuera, rematada en horquilla
        neuron.tip = grow(neuron, neuron.soma, position, unit(add(normal, randomDir(), 0.3)), size * 0.22, 0);

        // Dendritas basales: repartidas alrededor del cuerpo
        const basal = compact ? 3 : 4;
        for (let k = 0; k < basal; k++) {
            const angle = (k / basal) * TAU + rand() * 0.8;
            const lift = rand() * 0.7 - 0.45;
            const dir = unit([0, 1, 2].map(c => side[c] * Math.cos(angle) + up[c] * Math.sin(angle) + normal[c] * lift));
            grow(neuron, neuron.soma, position, dir, size * (0.08 + rand() * 0.07), 0);
        }
        neurons.push(neuron);
    };
    onSphere(compact ? 18 : 28, (dx, dy, dz) => {
        if (dy < -0.7) return;
        const family = familyOf(dx, dy, dz);
        const big = family === 0 && rand() < 0.6;
        addNeuron(cerebrum(dx, dy, dz).map(c => c * 0.84), family, big ? 1.5 + rand() * 0.4 : 0.85 + rand() * 0.45);
    });
    [[0.2, -0.5, -0.72], [-0.22, -0.44, -0.6], [0.02, -0.62, -0.5]]
        .slice(0, compact ? 2 : 3)
        .forEach(position => addNeuron(position, 4, 0.8 + rand() * 0.3));

    // ---- Fibras: curvas que arquean por fuera entre dos neuronas ----
    const ARC_STEPS = 14;
    const arcs = [];
    const linked = new Set();
    const somaOf = (neuron) => [verts[neuron.soma * 3], verts[neuron.soma * 3 + 1], verts[neuron.soma * 3 + 2]];
    const connect = (i, j) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (i === j || linked.has(key)) return;
        linked.add(key);

        const from = somaOf(neurons[i]);
        const to = somaOf(neurons[j]);
        const middle = [0, 1, 2].map(c => (from[c] + to[c]) / 2);
        const span = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
        const control = add(middle, unit(middle), 0.08 + span * 0.2);

        const start = verts.length / 3;
        for (let s = 0; s <= ARC_STEPS; s++) {
            const t = s / ARC_STEPS;
            const u = 1 - t;
            vertex([0, 1, 2].map(c => u * u * from[c] + 2 * u * t * control[c] + t * t * to[c]));
        }
        // La fibra se tiende cuando ya brotaron sus dos neuronas
        const arc = { from: i, to: j, start, bornAt: Math.max(neurons[i].bornAt, neurons[j].bornAt) + 0.25 };
        neurons[i].arcs.push(arc);
        neurons[j].arcs.push(arc);
        arcs.push(arc);
    };
    neurons.forEach((neuron, i) => {
        const here = somaOf(neuron);
        const byDistance = neurons
            .map((other, j) => {
                const there = somaOf(other);
                return [Math.hypot(there[0] - here[0], there[1] - here[1], there[2] - here[2]), j];
            })
            .filter(([, j]) => j !== i)
            .sort((a, b) => a[0] - b[0]);

        const sameFamily = byDistance.find(([, j]) => neurons[j].family === neuron.family);
        if (sameFamily) connect(i, sameFamily[1]);
        connect(i, byDistance[0][1]);
        connect(i, byDistance[1][1]);
        // Fibras largas que cruzan el cerebro
        if (rand() < 0.6) connect(i, byDistance[Math.floor(byDistance.length * (0.4 + rand() * 0.5))][1]);
    });

    // ---- Señales. Las fijas recorren la red sin parar; las temporales nacen de una
    // reacción en cadena, de la ola o del mouse, y mueren al llegar. ----
    const BASE_PULSES = compact ? 10 : 18;
    const MAX_PULSES = BASE_PULSES + (compact ? 10 : 22);
    const pulses = [];
    for (let i = 0; i < BASE_PULSES; i++) {
        pulses.push({ arc: arcs[Math.floor(rand() * arcs.length)], forward: rand() < 0.5, t: rand(), speed: 0.35 + rand() * 0.35, temp: false });
    }
    const emit = (at, except) => {
        if (pulses.length >= MAX_PULSES) return;
        const options = neurons[at].arcs.filter(arc => arc !== except);
        if (!options.length) return;
        const arc = options[Math.floor(rand() * options.length)];
        pulses.push({ arc, forward: arc.from === at, t: 0, speed: 0.7 + rand() * 0.5, temp: true });
    };
    const fire = (index, strength = 1) => {
        const neuron = neurons[index];
        neuron.flash = Math.max(neuron.flash, strength);
        if (strength >= 1) neuron.ring = 0;
    };
    // Disparo completo: destello, anillo y una señal por cada fibra
    const burst = (index) => {
        fire(index);
        neurons[index].arcs.forEach(arc => {
            if (pulses.length < MAX_PULSES) pulses.push({ arc, forward: arc.from === index, t: 0, speed: 0.8 + rand() * 0.5, temp: true });
        });
    };
    const arrive = (pulse) => {
        const at = pulse.forward ? pulse.arc.to : pulse.arc.from;
        fire(at);
        if (pulse.temp) {
            pulse.done = true;
            return;
        }
        // A veces la llegada desata otra señal: reacción en cadena
        if (rand() < 0.3) emit(at, pulse.arc);
        const options = neurons[at].arcs.filter(arc => arc !== pulse.arc);
        const next = options.length ? options[Math.floor(rand() * options.length)] : pulse.arc;
        pulse.forward = next.from === at;
        pulse.arc = next;
        pulse.t -= 1;
    };

    const stars = dark ? Array.from({ length: 70 }, () => [rand(), rand(), 0.25 + rand() * 0.55]) : [];

    // ---- Proyección ----
    const total = verts.length / 3;
    const points = Float32Array.from(verts);
    const sx = new Float32Array(total);
    const sy = new Float32Array(total);
    const depth = new Float32Array(total); // 0 = cerca, 1 = lejos
    const zoom = new Float32Array(total);
    const order = neurons.map((_, i) => i);
    const pointer = { x: 0, y: 0, px: -9999, py: -9999 }; // desvío respecto al centro y posición en el canvas
    let tiltX = 0;
    let tiltY = 0;
    let width = 0;
    let height = 0;
    let scale = 0;
    let dpr = 1;

    const resize = () => {
        const rect = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        // Con aire a los lados: el cerebro va dentro de una tarjeta y las dendritas no
        // deben tocar el borde
        scale = Math.min(width / 2.85, height / 2.3);
    };

    const project = (time) => {
        // Vista de tres cuartos mirando hacia el texto, con vaivén lento; el mouse la inclina
        const yaw = -Math.PI / 2 + 0.38 + Math.sin(time * 0.28) * 0.42 + tiltX;
        const pitch = 0.2 + Math.sin(time * 0.19) * 0.06 + tiltY;
        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const breathing = scale * (1 + 0.012 * Math.sin(time * 1.3));

        for (let i = 0; i < total; i++) {
            const x = points[i * 3];
            const y = points[i * 3 + 1] + 0.17;
            const z = points[i * 3 + 2];
            const x1 = x * cosYaw + z * sinYaw;
            const z1 = -x * sinYaw + z * cosYaw;
            const y1 = y * cosPitch - z1 * sinPitch;
            const z2 = y * sinPitch + z1 * cosPitch;
            zoom[i] = 3.4 / (3.4 + z2);
            sx[i] = width / 2 + x1 * zoom[i] * breathing;
            sy[i] = height / 2 - y1 * zoom[i] * breathing;
            depth[i] = clamp((z2 + 1) / 2);
        }
    };

    // Punto de una fibra en la posición a (0..ARC_STEPS), interpolando entre muestras
    const arcX = (arc, a) => {
        const step = Math.min(ARC_STEPS - 1, Math.floor(a));
        return sx[arc.start + step] + (sx[arc.start + step + 1] - sx[arc.start + step]) * (a - step);
    };
    const arcY = (arc, a) => {
        const step = Math.min(ARC_STEPS - 1, Math.floor(a));
        return sy[arc.start + step] + (sy[arc.start + step + 1] - sy[arc.start + step]) * (a - step);
    };

    // ---- Dibujo ----
    const draw = (time) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        project(time);

        const front = waveFront(time);
        const revealing = time < 0.1 + INTRO_SWEEP; // la ola inicial todavía está descubriendo la nube
        const settled = time >= INTRO_END;

        for (const [x, y, alpha] of stars) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(x * width, y * height, 1.2, 1.2);
        }

        // Nube: por color y por capa de profundidad (lo lejano, más chico y tenue).
        // Encima, los puntos que toca la ola y los que destellan.
        cloud.forEach((indices, group) => {
            const color = group ? FAMILIES[group - 1] : CLOUD;
            for (let layer = 0; layer < 3; layer++) {
                const size = 2 - layer * 0.4;
                ctx.beginPath();
                for (const i of indices) {
                    if (Math.min(2, Math.floor(depth[i] * 3)) !== layer) continue;
                    if (revealing && points[i * 3 + 2] < front) continue;
                    ctx.rect(sx[i] - size / 2, sy[i] - size / 2, size, size);
                }
                ctx.fillStyle = `rgba(${color}, ${(dark ? 0.85 : 0.7) - layer * 0.2})`;
                ctx.fill();
            }

            ctx.beginPath();
            for (const i of indices) {
                const z = points[i * 3 + 2];
                const inWave = Math.abs(z - front) < 0.07;
                if (!inWave && (Math.sin(time * 2.2 + i * 12.9898) < 0.996 || (revealing && z < front))) continue;
                const size = inWave ? 3.2 : 2.4;
                ctx.rect(sx[i] - size / 2, sy[i] - size / 2, size, size);
            }
            ctx.fillStyle = `rgba(${SPARK || color}, 0.95)`;
            ctx.fill();
        });

        // Sobre el escenario oscuro la luz se suma, como un brillo real
        if (dark) ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Fibras, con degradado entre los colores de sus dos neuronas; al inicio se van tendiendo
        ctx.lineWidth = 1;
        for (const arc of arcs) {
            const drawn = settled ? 1 : clamp((time - arc.bornAt) / 0.5);
            if (drawn <= 0) continue;
            const a = neurons[arc.from];
            const b = neurons[arc.to];
            const alpha = 0.5 * (1 - ((depth[a.soma] + depth[b.soma]) / 2) * 0.6);
            const gradient = ctx.createLinearGradient(sx[a.soma], sy[a.soma], sx[b.soma], sy[b.soma]);
            gradient.addColorStop(0, `rgba(${FAMILIES[a.family]}, ${alpha})`);
            gradient.addColorStop(1, `rgba(${FAMILIES[b.family]}, ${alpha})`);
            ctx.strokeStyle = gradient;

            const reach = drawn * ARC_STEPS;
            ctx.beginPath();
            ctx.moveTo(sx[arc.start], sy[arc.start]);
            for (let s = 1; s <= Math.floor(reach); s++) ctx.lineTo(sx[arc.start + s], sy[arc.start + s]);
            if (drawn < 1) ctx.lineTo(arcX(arc, reach), arcY(arc, reach));
            ctx.stroke();
        }

        // Neuronas, de la más lejana a la más cercana
        order.sort((p, q) => depth[neurons[q].soma] - depth[neurons[p].soma]);
        for (const index of order) {
            const neuron = neurons[index];
            const age = time - neuron.bornAt;
            if (age <= 0) continue;
            const growth = age >= 0.7 ? 1 : overshoot(age / 0.7); // brota desde el cuerpo

            const x = sx[neuron.soma];
            const y = sy[neuron.soma];
            const fade = 1 - depth[neuron.soma] * 0.55;
            const color = FAMILIES[neuron.family];
            const lit = Math.max(neuron.flash, neuron.hover);
            const stroke = 0.8 + 0.5 * neuron.size * zoom[neuron.soma] + lit * 0.7;
            const radius = scale * 0.024 * neuron.size * zoom[neuron.soma] * growth * (1 + neuron.hover * 0.3 + neuron.flash * 0.12);

            // Dendritas: curvas suaves; el segundo nivel, más fino y tenue
            neuron.branches.forEach((list, level) => {
                ctx.beginPath();
                for (let k = 0; k < list.length; k += 3) {
                    ctx.moveTo(x + (sx[list[k]] - x) * growth, y + (sy[list[k]] - y) * growth);
                    ctx.quadraticCurveTo(
                        x + (sx[list[k + 1]] - x) * growth, y + (sy[list[k + 1]] - y) * growth,
                        x + (sx[list[k + 2]] - x) * growth, y + (sy[list[k + 2]] - y) * growth
                    );
                }
                ctx.lineWidth = stroke * (level ? 0.65 : 1);
                ctx.strokeStyle = `rgba(${color}, ${Math.min(1, (level ? 0.7 : 0.92) + lit * 0.3) * fade})`;
                ctx.stroke();
            });

            // Anillo de onda al disparar
            if (neuron.ring < 1) {
                ctx.beginPath();
                ctx.arc(x, y, radius * (1.6 + neuron.ring * 5.5), 0, TAU);
                ctx.lineWidth = 0.4 + 1.6 * (1 - neuron.ring);
                ctx.strokeStyle = `rgba(${color}, ${(1 - neuron.ring) * 0.75 * fade})`;
                ctx.stroke();
            }

            // Halo, más intenso cuando acaba de recibir una señal
            const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 4.2);
            halo.addColorStop(0, `rgba(${color}, ${((dark ? 0.5 : 0.22) + lit * 0.45) * fade})`);
            halo.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(x, y, radius * 4.2, 0, TAU);
            ctx.fill();

            // Cuerpo: triángulo redondeado que apunta hacia su dendrita apical
            ctx.globalCompositeOperation = 'source-over';
            const angle = Math.atan2(sy[neuron.tip] - y, sx[neuron.tip] - x);
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {
                const corner = angle + (k * TAU) / 3;
                const reach = k === 0 ? radius * 1.25 : radius;
                ctx[k ? 'lineTo' : 'moveTo'](x + Math.cos(corner) * reach, y + Math.sin(corner) * reach);
            }
            ctx.closePath();
            ctx.lineWidth = radius * 0.7;
            ctx.fillStyle = `rgba(${color}, ${Math.min(1, 0.95 * fade + lit * 0.3)})`;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, 0.4 + lit * 0.5) * fade})`;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.5, 0, TAU);
            ctx.fill();
            if (dark) ctx.globalCompositeOperation = 'lighter';
        }

        // Señales: cometa con estela, que acelera al salir y frena al llegar
        for (const pulse of pulses) {
            if (!settled && time < pulse.arc.bornAt + 0.5) continue;
            const eased = pulse.t * pulse.t * (3 - 2 * pulse.t);
            const head = (pulse.forward ? eased : 1 - eased) * ARC_STEPS;
            const back = pulse.forward ? -1 : 1;
            const x = arcX(pulse.arc, head);
            const y = arcY(pulse.arc, head);
            const fade = 1 - depth[pulse.arc.start + Math.min(ARC_STEPS, Math.round(head))] * 0.6;
            const color = FAMILIES[neurons[pulse.forward ? pulse.arc.from : pulse.arc.to].family];

            for (let k = 0; k < 4; k++) {
                const from = clamp(head + back * k * 0.75, 0, ARC_STEPS);
                const to = clamp(head + back * (k + 1) * 0.75, 0, ARC_STEPS);
                ctx.beginPath();
                ctx.moveTo(arcX(pulse.arc, from), arcY(pulse.arc, from));
                ctx.lineTo(arcX(pulse.arc, to), arcY(pulse.arc, to));
                ctx.lineWidth = 2.6 - k * 0.5;
                ctx.strokeStyle = `rgba(${color}, ${(0.8 - k * 0.2) * fade})`;
                ctx.stroke();
            }

            const halo = ctx.createRadialGradient(x, y, 0, x, y, 11);
            halo.addColorStop(0, `rgba(${color}, ${0.8 * fade})`);
            halo.addColorStop(1, `rgba(${color}, 0)`);
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(x, y, 11, 0, TAU);
            ctx.fill();

            ctx.fillStyle = dark ? `rgba(255, 255, 255, ${fade})` : `rgba(${color}, ${fade})`;
            ctx.beginPath();
            ctx.arc(x, y, 2.4, 0, TAU);
            ctx.fill();
        }
    };

    resize();

    // Con movimiento reducido: una sola imagen fija, ya armada
    if (reduceMotion) {
        draw(INTRO_END + 1);
        window.addEventListener('resize', () => { resize(); draw(INTRO_END + 1); }, { passive: true });
        return;
    }

    // ---- Animación: solo corre mientras el canvas está a la vista ----
    let clock = 0;
    let last = 0;
    let frameId = 0;
    let visible = false;
    let previousFront = SWEEP_FROM;

    const frame = (now) => {
        frameId = 0;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clock += dt;

        // El cerebro se inclina hacia el mouse, con inercia
        const ease = 1 - Math.pow(0.02, dt);
        tiltX += (pointer.x * 0.6 - tiltX) * ease;
        tiltY += (pointer.y * 0.35 - tiltY) * ease;

        for (const pulse of pulses) {
            pulse.t += pulse.speed * dt;
            if (pulse.t >= 1) arrive(pulse);
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
            if (pulses[i].done) pulses.splice(i, 1);
        }

        const front = waveFront(clock);
        const decay = Math.pow(0.02, dt);
        neurons.forEach((neuron, index) => {
            neuron.flash *= decay;
            if (neuron.ring < 1) neuron.ring = Math.min(1, neuron.ring + dt / 0.8);
            neuron.cooldown -= dt;

            // La ola enciende cada neurona al pasar; algunas además disparan
            const z = points[neuron.soma * 3 + 2];
            if (clock > INTRO_END && previousFront > z && front <= z && front > -5) {
                fire(index);
                if (rand() < 0.35) emit(index);
            }

            // Bajo el mouse la neurona crece, brilla y va soltando señales
            const near = Math.hypot(sx[neuron.soma] - pointer.px, sy[neuron.soma] - pointer.py) < 46;
            neuron.hover += ((near ? 1 : 0) - neuron.hover) * ease * 2.2;
            neuron.hover = clamp(neuron.hover);
            if (near && neuron.cooldown <= 0 && clock > INTRO_END) {
                burst(index);
                neuron.cooldown = 0.9;
            }
        });
        previousFront = front > -5 ? front : SWEEP_FROM;

        draw(clock);
        if (visible) frameId = requestAnimationFrame(frame);
    };

    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !frameId) {
            last = performance.now();
            frameId = requestAnimationFrame(frame);
        }
    }).observe(canvas);

    window.addEventListener('resize', resize, { passive: true });

    // Mouse: inclina el cerebro y despierta la neurona que tiene debajo
    window.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        const rect = canvas.getBoundingClientRect();
        pointer.px = event.clientX - rect.left;
        pointer.py = event.clientY - rect.top;
        // Desvío medido contra la ventana: el mouse suele andar sobre el texto, lejos del canvas
        pointer.x = clamp((pointer.px - rect.width / 2) / window.innerWidth, -1, 1);
        pointer.y = clamp((pointer.py - rect.height / 2) / window.innerHeight, -1, 1);
    }, { passive: true });

    // Clic o toque: dispara la neurona más cercana
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let nearest = 0;
        let best = Infinity;
        neurons.forEach((neuron, index) => {
            const distance = Math.hypot(sx[neuron.soma] - x, sy[neuron.soma] - y);
            if (distance < best) {
                best = distance;
                nearest = index;
            }
        });
        burst(nearest);
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
