// ========================================
// 🚀 PORTFOLIO INTERATIVO - CLAUDIO SOUSA
// ========================================

// ========================================
// 🔧 CONFIGURAÇÕES GLOBAIS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    emailjs.init('xShvTWW8hSTEUTfq9'); // Substitua pela sua chave pública do EmailJS
    
    // Inicializar todas as funcionalidades
    initNavigation();
    initContactForm();
    initScrollAnimations();
    initSkillBars();
    initMobileMenu();
});

// ========================================
// 🧭 NAVEGAÇÃO SUAVE
// ========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Scroll suave para seções
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Altura da navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destacar link ativo baseado na seção visível
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// 📱 MENU MOBILE
// ========================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ========================================
// 📞 FORMULÁRIO DE CONTATO
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(contactForm);
            const data = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_email: 'claudiolmsousa@gmail.com' // SEU EMAIL AQUI
            };
            
            // Validação
            if (!validateForm(data)) {
                return;
            }
            
            // Mostrar loading
            showLoading(submitBtn, btnText, btnLoading);
            
            try {
                // Enviar email usando EmailJS
                const response = await emailjs.send(
                    'service_d0oceef', // Substitua pelo seu Service ID
                    'template_kpm9d3p', // Substitua pelo seu Template ID
                    data
                );
                
                if (response.status === 200) {
                    showSuccess('Mensagem enviada com sucesso! Entrarei em contato em breve.');
                    contactForm.reset();
                } else {
                    throw new Error('Erro no envio');
                }
                
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                showError('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente pelo email.');
            } finally {
                // Esconder loading
                hideLoading(submitBtn, btnText, btnLoading);
            }
        });
    }
}

// ========================================
// ✅ VALIDAÇÃO DO FORMULÁRIO
// ========================================
function validateForm(data) {
    const { from_name, from_email, subject, message } = data;
    
    // Verificar campos obrigatórios
    if (!from_name || !from_email || !subject || !message) {
        showError('Por favor, preencha todos os campos.');
        return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(from_email)) {
        showError('Por favor, insira um email válido.');
        return false;
    }
    
    // Validar tamanho mínimo
    if (from_name.length < 2) {
        showError('Nome deve ter pelo menos 2 caracteres.');
        return false;
    }
    
    if (message.length < 10) {
        showError('Mensagem deve ter pelo menos 10 caracteres.');
        return false;
    }
    
    return true;
}

// ========================================
// 🔄 ESTADOS DO BOTÃO
// ========================================
function showLoading(button, textElement, loadingElement) {
    button.disabled = true;
    textElement.style.display = 'none';
    loadingElement.style.display = 'inline-block';
}

function hideLoading(button, textElement, loadingElement) {
    button.disabled = false;
    textElement.style.display = 'inline-block';
    loadingElement.style.display = 'none';
}

// ========================================
// 📢 NOTIFICAÇÕES
// ========================================
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========================================
// 📊 BARRAS DE HABILIDADE
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width') || '0%';
                
                // Animar barra de progresso
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ========================================
// ✨ ANIMAÇÕES DE SCROLL
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ========================================
// 🎯 SCROLL SUAVE PARA BOTÕES
// ========================================
document.addEventListener('click', (e) => {
    // Botões que fazem scroll para seções
    if (e.target.matches('.btn[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// ========================================
// 🌙 TOGGLE DE TEMA (OPCIONAL)
// ========================================
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Carregar tema salvo
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// ========================================
// 📱 DETECÇÃO DE DISPOSITIVO
// ========================================
function isMobile() {
    return window.innerWidth <= 768;
}

// ========================================
// 🔄 ATUALIZAÇÃO DINÂMICA DE LAYOUT
// ========================================
window.addEventListener('resize', () => {
    // Fechar menu mobile se a tela aumentar
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ========================================
// 🎨 EFEITO DE DIGITAÇÃO (OPCIONAL)
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========================================
// 📈 CONTADOR ANIMADO (OPCIONAL)
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// ========================================
// 🎯 INICIALIZAÇÃO DE CONTADORES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stat h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                
                if (!isNaN(target)) {
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
});

console.log('🚀 Portfolio carregado com sucesso!');
console.log('👨‍💻 Desenvolvido por Claudio Sousa');

console.log('📧 claudiolmsousa@gmail.com');
