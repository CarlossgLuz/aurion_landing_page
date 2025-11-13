// ===== Scroll Suave =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Header =====
(function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));

    btn.classList.toggle('active');
    const bars = btn.querySelectorAll('.bar');
    if (isOpen) {
      bars[0].style.transform = 'translateY(8px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '';
      bars[2].style.transform = '';
    }
  });

  nav.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('active');
        const bars = btn.querySelectorAll('.bar');
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  });
})();

// ===== Botão de Voltar ao Topo =====
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Animações de Scroll (INTERSECTION OBSERVER) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if (entry.target.classList.contains('benefit-card') || 
                entry.target.classList.contains('testimonial-card')) {
                const cards = entry.target.parentElement.children;
                const index = Array.from(cards).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.benefit-card, .testimonial-card, .form-container').forEach(el => {
    fadeInObserver.observe(el);
});

// ===== Form Handling =====
const form = document.getElementById('preOrderForm');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    // Validação básica
    if (!formData.name || !formData.email) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (!isValidEmail(formData.email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Cadastrando...';
    submitButton.disabled = true;

    try {
        // Simular delay de rede (remover em produção)
        await new Promise(resolve => setTimeout(resolve, 1500));
        saveToLocalStorage(formData);

        // Mostrar mensagem de sucesso
        form.style.display = 'none';
        successMessage.style.display = 'block';

        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        showNotification('Erro ao cadastrar. Tente novamente.', 'error');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// ===== Funções de Utilidade =====

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveToLocalStorage(data) {
    try {
        const leads = JSON.parse(localStorage.getItem('aurion_leads') || '[]');
        leads.push({
            ...data,
            timestamp: new Date().toISOString(),
            source: 'landing_page'
        });
        localStorage.setItem('aurion_leads', JSON.stringify(leads));
        console.log('✅ Lead salvo com sucesso:', data.email);
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '16px 24px',
        background: type === 'error' ? '#E63946' : '#D4AF37',
        color: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '600',
        maxWidth: '400px'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ===== Iluminação Dinâmica =====
const productGlow = document.querySelector('.product-glow');

if (productGlow) {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        const product = document.querySelector('.hero-product');
        if (product) {
            const rect = product.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (mouseX - centerX) * 0.05;
            const deltaY = (mouseY - centerY) * 0.05;
            
            productGlow.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

// ===== Animações de Input =====
const formInputs = document.querySelectorAll('.form-group input');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateX(4px)';
        input.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateX(0)';
    });
});

// ===== Otimização de Pré Reload =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const prefetchLinks = [
        '../static/uploads/img/produto-ignite.png',
    ];
    
    prefetchLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
});

// ===== Monitoramento de Perfomace =====
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.loadTime > 2500) {
                console.warn('⚠️ Recurso lento detectado:', entry.name);
            }
        }
    });
    
    try {
        perfObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {}
}

// ===== Acessibilidade =====
const skipLink = document.createElement('a');
skipLink.href = '#benefits';
skipLink.textContent = 'Pular para conteúdo';
skipLink.className = 'skip-link';
Object.assign(skipLink.style, {
    position: 'absolute',
    top: '-40px',
    left: '0',
    background: '#D4AF37',
    color: '#0a0a0a',
    padding: '8px 16px',
    textDecoration: 'none',
    zIndex: '10001',
    fontWeight: '600',
    borderRadius: '0 0 8px 0'
});

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// ===== EASTER EGG - Código Konami =====
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateSecretMode();
    }
});

function activateSecretMode() {
    document.body.style.animation = 'rainbow 3s ease infinite';
    showNotification('🔥 Modo IGNITE ULTRA ativado! 🔥', 'info');
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 10000);
}

// ===== CONSOLE ART - Créditos =====
console.log(`
    %c
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║       AURION NUTRITION - IGNITE       ║
    ║                                       ║
    ║    Libere o IGNITE dentro de você     ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    `,
    'color: #D4AF37; font-weight: bold; font-size: 14px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);'
);

console.log('%c🔥 Landing Page desenvolvida por Carlos Gabriel', 'color: #E63946; font-size: 12px; font-weight: bold;');
console.log('%c💻 Linkedin: https://www.linkedin.com/in/carlos-gabriel-gomes-luz-0318862a0/', 'color: #3959e6ff; font-size: 10px; font-weight: bold;');