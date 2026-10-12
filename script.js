document.addEventListener('DOMContentLoaded', () => {
    // --- Efeito de Rolagem do Cabeçalho ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // --- Revelar Elementos ao Rolar ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            if (elTop < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Verificação inicial

    // --- Lógica da Barra de Privacidade ---
    const privacyBar = document.getElementById('privacyBar');
    const acceptPrivacy = document.getElementById('acceptPrivacy');

    // Mostrar após 1.5s se não tiver sido aceito ainda
    if (!localStorage.getItem('privacyAccepted')) {
        setTimeout(() => {
            privacyBar.classList.add('active');
        }, 1500);
    }

    acceptPrivacy.addEventListener('click', () => {
        privacyBar.classList.remove('active');
        localStorage.setItem('privacyAccepted', 'true');
    });

    // --- Lógica do Widget de Assistente ---
    const assistantTrigger = document.getElementById('assistantTrigger');
    const assistantWindow = document.getElementById('assistantWindow');
    const closeAssistant = document.getElementById('closeAssistant');
    const assistantBody = document.getElementById('assistantBody');

    assistantTrigger.addEventListener('click', () => {
        assistantWindow.style.display = 'flex';
        // Rolar automaticamente para o fim
        assistantBody.scrollTop = assistantBody.scrollHeight;
    });

    closeAssistant.addEventListener('click', () => {
        assistantWindow.style.display = 'none';
    });

    // Atraso da mensagem inicial
    setTimeout(() => {
        if (assistantWindow.style.display !== 'flex') {
            // Opcional: Pulsar o gatilho para chamar atenção
            assistantTrigger.style.transform = 'scale(1.2)';
            setTimeout(() => assistantTrigger.style.transform = 'scale(1)', 300);
        }
    }, 5000);

    // --- Envio de Formulário de Contato (Mock) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Mensagem Enviada!';
                btn.style.background = '#25D366';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    const productForm = document.getElementById('productRegistrationForm');

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento padrão da página
        
        // Alteração visual do botão para indicar carregamento
        const btnSubmit = productForm.querySelector('button[type="submit"]');
        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A guardar...';
        btnSubmit.disabled = true;

        // Captura dos valores preenchidos no formulário
        const produtoData = {
            nome: document.getElementById('prodName').value,
            categoria: document.getElementById('prodCategory').value,
            descricao: document.getElementById('prodDescription').value,
            status: document.getElementById('prodStatus').value
        };

        try {
            // Chamada real para o microsserviço Python/FastAPI
            const response = await fetch('http://127.0.0.1:8000/api/produtos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(produtoData)
            });

            if (response.ok) {
                const resultado = await response.json();
                alert(`Produto "${produtoData.nome}" registado com sucesso no SQLite! ID: ${resultado.id}`);
                productForm.reset();
            } else {
                alert('Erro ao guardar o produto. Verifique os dados enviados.');
            }
        } catch (error) {
            console.error("Erro ao ligar ao servidor Python:", error);
            alert('Não foi possível conectar ao servidor. Certifique-se de que a API (Uvicorn) está a correr.');
        } finally {
            // Restaura o estado original do botão (com sucesso ou com erro)
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    })
}
        })