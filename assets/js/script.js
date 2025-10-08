const companyData = {
    name: "ContaFácil Contabilidade",
    cnpj: "12.345.678/0001-99",
    email: "contato@contafacil.com.br",
    phone: "(11) 99999-8888",
    whatsapp: "5511999998888"
};


// Função para abrir o WhatsApp com mensagem personalizada
function openWhatsApp(customMessage = null) {
    const defaultMessage = "Olá! Gostaria de agendar uma consultoria gratuita.";
    const message = customMessage || defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${companyData.whatsapp}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

// Inicialização do formulário e envio simulado
function initializeForm() {
    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Captura dos dados do formulário
    const formData = new FormData(e.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        empresa: formData.get('empresa'),
        whatsapp: formData.get('whatsapp')
    };

    // Validação
    if (!validateForm(data)) return;

    // Estado de carregamento
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');

    // Simulação do envio
    setTimeout(() => {
        const whatsappMessage = createWhatsAppMessage(data);

        e.target.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');

        showNotification('Dados enviados! Redirecionando para o WhatsApp...', 'success');

        setTimeout(() => openWhatsApp(whatsappMessage), 1000);
    }, 1500);
}

// Validação do formulário
function validateForm(data) {
    const requiredFields = ['nome', 'email', 'empresa', 'whatsapp'];

    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Por favor, preencha o campo ${getFieldLabel(field)}`, 'error');
            return false;
        }
    }

    // E-mail válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Por favor, insira um e-mail válido', 'error');
        return false;
    }

    // WhatsApp válido
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!phoneRegex.test(data.whatsapp)) {
        showNotification('Por favor, insira um número de WhatsApp válido', 'error');
        return false;
    }

    return true;
}

function getFieldLabel(field) {
    const labels = {
        nome: 'Nome completo',
        email: 'E-mail',
        empresa: 'Nome da empresa',
        whatsapp: 'WhatsApp'
    };
    return labels[field] || field;
}

function createWhatsAppMessage(data) {
    return `Olá! Gostaria de agendar uma consultoria gratuita.

*Dados para contato:*
📝 Nome: ${data.nome}
📧 Email: ${data.email}
🏢 Empresa: ${data.empresa}
📱 WhatsApp: ${data.whatsapp}

Aguardo retorno. Obrigado!`;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);
    setTimeout(() => (notification.style.transform = 'translateX(0)'), 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Funcionalidades visuais e de interação
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initializeAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.benefit-card, .service-card, .testimonial-card')
        .forEach(el => observer.observe(el));
}

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

function initializeFormEnhancements() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            input.parentElement.classList.toggle('filled', input.value.trim() !== '');
        });

        if (input.name === 'whatsapp') {
            input.addEventListener('input', e => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 2) value = `(${value}`;
                    else if (value.length <= 7) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    else value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                }
                e.target.value = value;
            });
        }
    });
}

function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255,255,255,0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.boxShadow = 'none';
        }
    });
}

// Funções adicionais
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    });
}

function initializePerformanceMonitoring() {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}

// Inicialização geral
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeLazyLoading();
    initializeFormEnhancements();
    initializeHeaderScroll();
    initializePerformanceMonitoring();

    // Clique para copiar contatos
    const contactElements = document.querySelectorAll('.contact-method-value, .footer-contact span');
    contactElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.title = 'Clique para copiar';
        element.addEventListener('click', () => copyToClipboard(element.textContent));
    });

    console.log('ContaFácil Landing Page inicializada com sucesso!');
});