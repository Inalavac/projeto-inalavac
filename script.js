document.addEventListener("DOMContentLoaded", function () {

    /* ELEMENTOS DO CADASTRO */

    const authScreen = document.getElementById("authScreen");
    const registerForm = document.getElementById("registerForm");
    const authMessage = document.getElementById("authMessage");

    const accountButton = document.getElementById("accountButton");
    const accountPanel = document.getElementById("accountPanel");
    const accountClose = document.getElementById("accountClose");

    const logoutButton = document.getElementById("logoutButton");
    const switchAccountButton = document.getElementById("switchAccountButton");
    const resetAccountButton = document.getElementById("resetAccountButton");

    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");

    /* ELEMENTOS DE ÉTICA */

    const ethicsButton = document.getElementById("ethicsButton");
    const ethicsPanel = document.getElementById("ethicsPanel");
    const ethicsClose = document.getElementById("ethicsClose");

    /* ELEMENTOS DO SIMULADOR */

    const startButton = document.getElementById("startButton");
    const cabinDisplay = document.getElementById("cabinDisplay");
    const particlesContainer = document.getElementById("particles");

    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const progressBar = document.getElementById("progressBar");

    const statusMessage = document.getElementById("statusMessage");

    /* ARMAZENAMENTO */

    const STORAGE_KEY = "inalavacPerfilDemo";

    let usuarioEmMemoria = null;
    let simulando = false;
    let intervaloSimulacao = null;


    /* FUNÇÕES DE USUÁRIO */

    function salvarUsuario(usuario) {

        usuarioEmMemoria = usuario;

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(usuario)
            );
        } catch (erro) {
            console.warn("Armazenamento local indisponível.");
        }
    }


    function obterUsuario() {

        if (usuarioEmMemoria) {
            return usuarioEmMemoria;
        }

        try {
            const dados = localStorage.getItem(STORAGE_KEY);

            usuarioEmMemoria = dados
                ? JSON.parse(dados)
                : null;

            return usuarioEmMemoria;

        } catch (erro) {
            return null;
        }
    }


    function removerUsuario() {

        usuarioEmMemoria = null;

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (erro) {
            console.warn("Não foi possível limpar o armazenamento.");
        }
    }


    function mostrarSite() {

        if (authScreen) {
            authScreen.classList.add("hidden");
            authScreen.style.display = "none";
        }

        atualizarDadosConta();
    }


    function mostrarCadastro() {

        if (authScreen) {
            authScreen.style.display = "flex";
            authScreen.classList.remove("hidden");
        }
    }


    function limparFormulario() {

        if (registerForm) {
            registerForm.reset();
        }

        if (authMessage) {
            authMessage.textContent = "";
            authMessage.className = "auth-message";
        }
    }


    function mostrarMensagem(mensagem, tipo) {

        if (!authMessage) return;

        authMessage.textContent = mensagem;
        authMessage.className = "auth-message " + tipo;
    }


    function atualizarDadosConta() {

        const usuario = obterUsuario();

        if (!usuario) return;

        if (accountName) {
            accountName.textContent = usuario.nome || "Usuário";
        }

        if (accountEmail) {
            accountEmail.textContent = usuario.email || "—";
        }
    }


    /* CONTROLE DO CADASTRO */

    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const nome = document.getElementById("fullName").value.trim();

            const email = document.getElementById("email").value.trim();

            const senha = document.getElementById("password").value;

            const confirmarSenha = document.getElementById("confirmPassword").value;

            const aceitou = document.getElementById("acceptTerms").checked;

            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


            if (nome.length < 3) {

                mostrarMensagem(
                    "Digite um nome com pelo menos 3 caracteres.",
                    "error"
                );

                return;
            }


            if (!emailValido) {

                mostrarMensagem(
                    "Digite um e-mail válido.",
                    "error"
                );

                return;
            }


            if (senha.length < 6) {

                mostrarMensagem(
                    "A senha demonstrativa deve ter pelo menos 6 caracteres.",
                    "error"
                );

                return;
            }


            if (senha !== confirmarSenha) {

                mostrarMensagem(
                    "As senhas não coincidem.",
                    "error"
                );

                return;
            }


            if (!aceitou) {

                mostrarMensagem(
                    "Marque a caixa de aceite para continuar.",
                    "error"
                );

                return;
            }


            // A senha não é armazenada.
            // Este cadastro é apenas demonstrativo.

            salvarUsuario({
                nome: nome,
                email: email
            });


            mostrarMensagem(
                "Cadastro realizado! Entrando...",
                "success"
            );


            setTimeout(function () {

                mostrarSite();
                limparFormulario();

            }, 450);

        });
    }


    /* CONTROLE DOS MODAIS */

    function alternarModal(modal, abrir) {

        if (!modal) return;

        modal.classList.toggle("open", abrir);

        modal.setAttribute(
            "aria-hidden",
            String(!abrir)
        );
    }


    /* ABRIR CONTA */

    if (accountButton) {

        accountButton.addEventListener("click", function () {

            atualizarDadosConta();

            alternarModal(accountPanel, true);

        });
    }


    /* FECHAR CONTA */

    if (accountClose) {

        accountClose.addEventListener("click", function () {

            alternarModal(accountPanel, false);

        });
    }


    /* ABRIR ÉTICA */

    if (ethicsButton) {

        ethicsButton.addEventListener("click", function () {

            alternarModal(ethicsPanel, true);

        });
    }


    /* FECHAR ÉTICA */

    if (ethicsClose) {

        ethicsClose.addEventListener("click", function () {

            alternarModal(ethicsPanel, false);

        });
    }


    /* FECHAR CLICANDO FORA */

    [accountPanel, ethicsPanel].forEach(function (panel) {

        if (!panel) return;

        panel.addEventListener("click", function (event) {

            if (event.target === panel) {

                alternarModal(panel, false);

            }

        });

    });


    /* FECHAR COM ESC */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            alternarModal(accountPanel, false);

            alternarModal(ethicsPanel, false);

        }

    });


    /* SAIR DA CONTA */

    function encerrarSessao() {

        alternarModal(accountPanel, false);

        removerUsuario();

        limparFormulario();

        mostrarCadastro();
    }


    if (logoutButton) {

        logoutButton.addEventListener("click", encerrarSessao);

    }


    /* TROCAR USUÁRIO */

    if (switchAccountButton) {

        switchAccountButton.addEventListener("click", encerrarSessao);

    }


    /* REFAZER CADASTRO */

    if (resetAccountButton) {

        resetAccountButton.addEventListener("click", encerrarSessao);

    }


    /* SIMULADOR VISUAL */

    function criarParticulas(ativo) {

        if (!particlesContainer) return;

        particlesContainer.innerHTML = "";

        if (!ativo) return;


        for (let i = 0; i < 18; i++) {

            const dot = document.createElement("div");

            dot.className = "particle-dot";

            dot.style.left =
                (Math.random() * 180 + 15) + "px";

            dot.style.top =
                (Math.random() * 160 + 60) + "px";

            dot.style.animationDelay =
                (Math.random() * 2) + "s";

            particlesContainer.appendChild(dot);

        }
    }


    /* ATUALIZAR PROGRESSO */

    function atualizarProgresso(valor) {

        if (progressFill) {

            progressFill.style.width = valor + "%";

        }

        if (progressPercent) {

            progressPercent.textContent = valor + "%";

        }

        if (progressBar) {

            progressBar.setAttribute(
                "aria-valuenow",
                String(valor)
            );

        }
    }


    /* INICIAR SIMULAÇÃO */

    if (startButton) {

        startButton.addEventListener("click", function () {

            if (simulando) return;

            simulando = true;

            startButton.disabled = true;

            startButton.innerHTML =
                '<span class="button-icon">...</span> Animação em andamento';


            if (cabinDisplay) {

                cabinDisplay.classList.remove(
                    "protected",
                    "misting"
                );

                cabinDisplay.classList.add("active");

            }


            criarParticulas(false);

            atualizarProgresso(0);


            if (statusMessage) {

                statusMessage.textContent =
                    "Etapa 1 de 3: início da representação visual.";

            }


            let progresso = 0;


            intervaloSimulacao = setInterval(function () {

                progresso += 2;

                atualizarProgresso(progresso);


                /* ETAPA 1 */

                if (progresso === 20) {

                    if (cabinDisplay) {

                        cabinDisplay.classList.add("misting");

                    }

                    criarParticulas(true);

                    if (statusMessage) {

                        statusMessage.textContent =
                            "Etapa 2 de 3: efeito gráfico ilustrativo de partículas.";

                    }
                }


                /* ETAPA 2 */

                else if (progresso === 65) {

                    if (statusMessage) {

                        statusMessage.textContent =
                            "A animação continua. Nenhum processo biológico real está ocorrendo.";

                    }
                }


                /* ETAPA 3 */

                else if (progresso === 90) {

                    if (cabinDisplay) {

                        cabinDisplay.classList.remove("misting");

                        cabinDisplay.classList.add("protected");

                    }

                    criarParticulas(false);

                    if (statusMessage) {

                        statusMessage.textContent =
                            "Etapa final: encerrando a representação visual.";

                    }
                }


                /* CONCLUSÃO */

                if (progresso >= 100) {

                    clearInterval(intervaloSimulacao);

                    intervaloSimulacao = null;

                    if (statusMessage) {

                        statusMessage.textContent =
                            "Animação concluída. Esta representação não comprova imunização ou proteção.";

                    }


                    startButton.disabled = false;

                    startButton.innerHTML =
                        '<span class="button-icon">↻</span> Repetir animação';

                    simulando = false;

                }

            }, 120);

        });
    }


    /* VERIFICAR USUÁRIO AO ABRIR O SITE */

    const usuario = obterUsuario();

    if (usuario) {

        mostrarSite();

    } else {

        mostrarCadastro();

    }

});// Configuração do leitor
const html5QrCode = new Html5Qrcode("reader");
let qrActive = false;

const qrButton = document.getElementById('qrButton');
const resultDiv = document.getElementById('result');

qrButton.addEventListener('click', () => {
    if (!qrActive) {
        // Inicia a câmera (facingMode: environment usa a câmera traseira no celular)
        html5QrCode.start(
            { facingMode: "environment" }, 
            {
                fps: 10,    // Quadros por segundo
                qrbox: { width: 250, height: 250 } // Área de foco
            },
            (decodedText) => {
                // O que acontece quando o QR Code é lido com sucesso
                resultDiv.textContent = "Sucesso: " + decodedText;
                alert("Conteúdo lido: " + decodedText);
                
                // Opcional: parar após a leitura
                pararLeitor();
            },
            (errorMessage) => {
                // Erros de leitura comuns (pode deixar vazio para não poluir o console)
            }
        ).then(() => {
            qrActive = true;
            qrButton.textContent = "🛑 Parar Leitor";
            qrButton.style.backgroundColor = "#ef4444";
        }).catch(err => {
            console.error("Erro ao acessar câmera:", err);
            alert("Erro ao acessar a câmera. Verifique as permissões.");
        });
    } else {
        pararLeitor();
    }
});

function pararLeitor() {
    html5QrCode.stop().then(() => {
        qrActive = false;
        qrButton.textContent = "📷 Iniciar Leitor";
        qrButton.style.backgroundColor = "";
        resultDiv.textContent = "";
    }).catch(err => console.error("Erro ao parar:", err));
}