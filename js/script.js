/**
 * ============================================================================
 * SCRIPT - LANDING PAGE "PYTHON: DO ZERO AO PROFISSIONAL"
 * ============================================================================
 * Este arquivo controla o COMPORTAMENTO da página: tudo que reage a uma
 * ação do usuário (clique, rolagem, tempo passando...).
 *
 * O código está organizado em funções pequenas, cada uma responsável por
 * UMA única funcionalidade. No final do arquivo, a função `inicializarPagina`
 * chama todas elas, deixando claro tudo o que acontece quando a página carrega.
 * ============================================================================
 */

/**
 * Espera o HTML inteiro estar pronto (carregado e interpretado pelo navegador)
 * antes de executar qualquer código. Isso evita erros de tentar manipular
 * um elemento que ainda não existe na página.
 */
document.addEventListener('DOMContentLoaded', inicializarPagina);


/**
 * Função principal: organiza a ordem de inicialização de cada funcionalidade
 * da página. Pense nela como o "índice" do arquivo JavaScript.
 */
function inicializarPagina() {
    definirAnoAtualNoRodape();
    controlarAparenciaDoCabecalhoAoRolar();
    controlarMenuMobile();
    animarElementosAoRolarAPagina();
    iniciarContadorRegressivo();
    controlarAcordeaoDeDuvidas();
    animarDigitacaoDeCodigo();
    iniciarNotificacoesDeCompra();
}


/**
 * ============================================================================
 * 1. ANO ATUAL NO RODAPÉ
 * ----------------------------------------------------------------------------
 * Preenche automaticamente o ano no rodapé, evitando que o texto de
 * copyright fique desatualizado com o passar do tempo.
 * ============================================================================
 */
function definirAnoAtualNoRodape() {
    const elementoAno = document.getElementById('ano-atual');

    // Verificação de segurança: só continua se o elemento realmente existir
    if (!elementoAno) return;

    const anoAtual = new Date().getFullYear();
    elementoAno.textContent = anoAtual;
}


/**
 * ============================================================================
 * 2. CABEÇALHO FIXO COM APARÊNCIA DINÂMICA
 * ----------------------------------------------------------------------------
 * Adiciona uma classe CSS ao cabeçalho quando o usuário rola a página para
 * baixo, dando um fundo sólido e uma sombra (melhora a leitura do menu
 * sobre o conteúdo da página).
 * ============================================================================
 */
function controlarAparenciaDoCabecalhoAoRolar() {
    const cabecalho = document.getElementById('cabecalho');
    if (!cabecalho) return;

    // Distância de rolagem, em pixels, a partir da qual o cabeçalho muda de estilo
    const LIMITE_DE_ROLAGEM_EM_PIXELS = 40;

    function verificarPosicaoDeRolagem() {
        const rolouAlemDoLimite = window.scrollY > LIMITE_DE_ROLAGEM_EM_PIXELS;
        cabecalho.classList.toggle('cabecalho--rolado', rolouAlemDoLimite);
    }

    // Executa uma vez ao carregar (caso a página já abra rolada) e depois
    // sempre que o usuário rolar a tela
    verificarPosicaoDeRolagem();
    window.addEventListener('scroll', verificarPosicaoDeRolagem);
}


/**
 * ============================================================================
 * 3. MENU MOBILE (HAMBÚRGUER)
 * ----------------------------------------------------------------------------
 * Controla a abertura e o fechamento do menu de navegação em telas pequenas.
 * ============================================================================
 */
function controlarMenuMobile() {
    const botaoMenu = document.getElementById('botao-menu-mobile');
    const menuNavegacao = document.getElementById('menu-navegacao');
    if (!botaoMenu || !menuNavegacao) return;

    botaoMenu.addEventListener('click', function () {
        // alternarMenu = "abrir se estiver fechado, fechar se estiver aberto"
        const menuEstaAberto = menuNavegacao.classList.toggle('esta-aberto');
        botaoMenu.classList.toggle('esta-aberto', menuEstaAberto);

        // Atributo de acessibilidade: informa leitores de tela se o menu
        // está expandido ou recolhido
        botaoMenu.setAttribute('aria-expanded', String(menuEstaAberto));
    });

    // Fecha o menu automaticamente quando o usuário clica em algum link,
    // evitando que o menu fique aberto "por cima" do conteúdo depois do clique
    const linksDoMenu = menuNavegacao.querySelectorAll('a');
    linksDoMenu.forEach(function (link) {
        link.addEventListener('click', function () {
            menuNavegacao.classList.remove('esta-aberto');
            botaoMenu.classList.remove('esta-aberto');
            botaoMenu.setAttribute('aria-expanded', 'false');
        });
    });
}


/**
 * ============================================================================
 * 4. ANIMAÇÃO DE ENTRADA AO ROLAR A PÁGINA (SCROLL REVEAL)
 * ----------------------------------------------------------------------------
 * Usa a API nativa "IntersectionObserver" para detectar quando um elemento
 * entra na área visível da tela, e então adiciona uma classe CSS que dispara
 * a animação de "aparecer" (definida em estilos.css).
 *
 * Essa abordagem é mais eficiente que verificar a posição de rolagem
 * manualmente, pois o próprio navegador otimiza essa verificação.
 * ============================================================================
 */
function animarElementosAoRolarAPagina() {
    const elementosParaAnimar = document.querySelectorAll('.animar-ao-rolar');
    if (elementosParaAnimar.length === 0) return;

    const opcoesDoObservador = {
        root: null,       // usa a janela do navegador como referência
        threshold: 0.15,  // dispara quando 15% do elemento estiver visível
    };

    function aoInterceptarElemento(entradas, observador) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('esta-visivel');
                // Para de observar o elemento depois que ele já apareceu,
                // pois a animação não precisa se repetir
                observador.unobserve(entrada.target);
            }
        });
    }

    const observador = new IntersectionObserver(aoInterceptarElemento, opcoesDoObservador);
    elementosParaAnimar.forEach(function (elemento) {
        observador.observe(elemento);
    });
}


/**
 * ============================================================================
 * 5. CONTADOR REGRESSIVO DA OFERTA (GATILHO DE URGÊNCIA)
 * ----------------------------------------------------------------------------
 * Exibe um contador de horas, minutos e segundos até o fim de uma "janela"
 * de oferta. A cada visita, uma nova janela de tempo é calculada a partir
 * do momento atual — uma prática comum em páginas de vendas para reforçar
 * o senso de urgência sem depender de uma data fixa no servidor.
 * ============================================================================
 */
function iniciarContadorRegressivo() {
    const elementoHoras = document.getElementById('contador-horas');
    const elementoMinutos = document.getElementById('contador-minutos');
    const elementoSegundos = document.getElementById('contador-segundos');

    if (!elementoHoras || !elementoMinutos || !elementoSegundos) return;

    // Duração total da oferta: 4 horas a partir do carregamento da página
    const DURACAO_DA_OFERTA_EM_HORAS = 4;
    const DURACAO_DA_OFERTA_EM_MILISSEGUNDOS = DURACAO_DA_OFERTA_EM_HORAS * 60 * 60 * 1000;

    const momentoFinalDaOferta = Date.now() + DURACAO_DA_OFERTA_EM_MILISSEGUNDOS;

    /**
     * Converte um número para sempre ter 2 dígitos (ex: 5 vira "05").
     * Isso deixa o contador com uma aparência mais uniforme, como um relógio.
     */
    function formatarComDoisDigitos(numero) {
        return String(numero).padStart(2, '0');
    }

    function atualizarContador() {
        const tempoRestanteEmMilissegundos = momentoFinalDaOferta - Date.now();

        // Quando o tempo acabar, trava o contador em "00:00:00" em vez de
        // mostrar números negativos
        if (tempoRestanteEmMilissegundos <= 0) {
            elementoHoras.textContent = '00';
            elementoMinutos.textContent = '00';
            elementoSegundos.textContent = '00';
            clearInterval(intervaloDoContador);
            return;
        }

        // Transforma milissegundos restantes em horas, minutos e segundos
        const segundosTotais = Math.floor(tempoRestanteEmMilissegundos / 1000);
        const horas = Math.floor(segundosTotais / 3600);
        const minutos = Math.floor((segundosTotais % 3600) / 60);
        const segundos = segundosTotais % 60;

        elementoHoras.textContent = formatarComDoisDigitos(horas);
        elementoMinutos.textContent = formatarComDoisDigitos(minutos);
        elementoSegundos.textContent = formatarComDoisDigitos(segundos);
    }

    // Atualiza imediatamente (evita mostrar "00:00:00" por 1 segundo ao carregar)
    // e depois a cada 1000ms (1 segundo)
    atualizarContador();
    const intervaloDoContador = setInterval(atualizarContador, 1000);
}


/**
 * ============================================================================
 * 6. ACORDEÃO DE PERGUNTAS FREQUENTES (FAQ)
 * ----------------------------------------------------------------------------
 * Permite abrir e fechar cada pergunta ao clicar nela. Usa o atributo
 * "aria-expanded" tanto para controlar o estilo (via CSS) quanto para
 * informar leitores de tela sobre o estado de cada pergunta (acessibilidade).
 * ============================================================================
 */
function controlarAcordeaoDeDuvidas() {
    const perguntas = document.querySelectorAll('.item-acordeao__pergunta');
    if (perguntas.length === 0) return;

    perguntas.forEach(function (botaoDaPergunta) {
        botaoDaPergunta.addEventListener('click', function () {
            const jaEstaAberta = botaoDaPergunta.getAttribute('aria-expanded') === 'true';

            // Fecha todas as outras perguntas antes de abrir a atual,
            // mantendo o acordeão organizado (apenas uma resposta visível por vez)
            perguntas.forEach(function (outraPergunta) {
                outraPergunta.setAttribute('aria-expanded', 'false');
            });

            // Alterna o estado da pergunta clicada: se estava fechada, abre;
            // se já estava aberta, fecha (permite "desmarcar" a mesma pergunta)
            botaoDaPergunta.setAttribute('aria-expanded', String(!jaEstaAberta));
        });
    });
}


/**
 * ============================================================================
 * 7. ANIMAÇÃO DE "CÓDIGO SENDO DIGITADO" (ELEMENTO DE ASSINATURA VISUAL)
 * ----------------------------------------------------------------------------
 * Simula, dentro da janela de editor de código no topo da página, um trecho
 * de Python sendo digitado letra por letra, como se alguém estivesse
 * programando ao vivo. Ao terminar, o trecho reinicia em looping.
 * ============================================================================
 */
function animarDigitacaoDeCodigo() {
    const elementoCodigo = document.getElementById('codigo-digitado');
    if (!elementoCodigo) return;

    // Trecho de código Python exibido na janela flutuante do hero.
    // Escolhido por ser simples e reconhecível até para quem nunca programou.
    const trechoDeCodigoPython =
        'def boas_vindas(nome):\n' +
        '    print(f"Olá, {nome}!")\n' +
        '    print("Bem-vindo ao Python!")\n\n' +
        'boas_vindas("futuro programador")';

    const VELOCIDADE_DA_DIGITACAO_EM_MILISSEGUNDOS = 45;
    const PAUSA_ANTES_DE_REINICIAR_EM_MILISSEGUNDOS = 2500;

    let posicaoAtualDoCaractere = 0;

    function digitarProximoCaractere() {
        const aindaHaCaracteresParaDigitar = posicaoAtualDoCaractere < trechoDeCodigoPython.length;

        if (aindaHaCaracteresParaDigitar) {
            // Adiciona mais uma letra ao texto já exibido
            elementoCodigo.textContent = trechoDeCodigoPython.substring(0, posicaoAtualDoCaractere + 1);
            posicaoAtualDoCaractere += 1;
            setTimeout(digitarProximoCaractere, VELOCIDADE_DA_DIGITACAO_EM_MILISSEGUNDOS);
        } else {
            // Terminou de digitar: espera um tempo, apaga e recomeça o ciclo
            setTimeout(function () {
                posicaoAtualDoCaractere = 0;
                elementoCodigo.textContent = '';
                digitarProximoCaractere();
            }, PAUSA_ANTES_DE_REINICIAR_EM_MILISSEGUNDOS);
        }
    }

    digitarProximoCaractere();
}


/**
 * ============================================================================
 * 8. NOTIFICAÇÕES DE COMPRA RECENTE (GATILHO DE PROVA SOCIAL)
 * ----------------------------------------------------------------------------
 * Exibe periodicamente, no canto da tela, um aviso simulando que outra
 * pessoa acabou de comprar o ebook. Isso reforça a sensação de que o
 * produto está sendo procurado por outras pessoas em tempo real.
 *
 * IMPORTANTE: os nomes e cidades abaixo são fictícios e usados apenas como
 * exemplo de prova social. Ao publicar a página de verdade, o ideal é
 * conectar essa notificação a dados reais de vendas.
 * ============================================================================
 */
function iniciarNotificacoesDeCompra() {
    const caixaDeNotificacao = document.getElementById('notificacao-compra');
    const elementoNome = document.getElementById('notificacao-nome');
    const elementoTexto = document.getElementById('notificacao-texto');

    if (!caixaDeNotificacao || !elementoNome || !elementoTexto) return;

    // Lista de exemplos de "compras recentes" que serão exibidas em sequência
    const comprasRecentesDeExemplo = [
        { nome: 'Mariana, de São Paulo', texto: 'acabou de garantir o ebook agora mesmo' },
        { nome: 'Pedro, de Belo Horizonte', texto: 'garantiu o acesso ao Python: Do Zero ao Profissional' },
        { nome: 'Fernanda, de Curitiba', texto: 'começou a estudar Python agora há pouco' },
        { nome: 'Lucas, do Recife', texto: 'acabou de aproveitar a condição especial' },
    ];

    const TEMPO_VISIVEL_EM_MILISSEGUNDOS = 5000;
    const INTERVALO_ENTRE_NOTIFICACOES_EM_MILISSEGUNDOS = 9000;
    const ATRASO_ANTES_DA_PRIMEIRA_NOTIFICACAO_EM_MILISSEGUNDOS = 4000;

    let indiceDaProximaNotificacao = 0;

    function exibirProximaNotificacao() {
        const compraAtual = comprasRecentesDeExemplo[indiceDaProximaNotificacao];

        elementoNome.textContent = compraAtual.nome;
        elementoTexto.textContent = compraAtual.texto;

        // Exibe a notificação (a classe controla a animação de entrada, em CSS)
        caixaDeNotificacao.classList.add('notificacao-compra--visivel');

        // Depois de alguns segundos visível, esconde novamente
        setTimeout(function () {
            caixaDeNotificacao.classList.remove('notificacao-compra--visivel');
        }, TEMPO_VISIVEL_EM_MILISSEGUNDOS);

        // Avança para a próxima compra da lista, voltando ao início ao terminar
        // (operador "%" garante que o índice sempre "dê a volta" na lista)
        indiceDaProximaNotificacao = (indiceDaProximaNotificacao + 1) % comprasRecentesDeExemplo.length;
    }

    // Primeira notificação aparece após um pequeno atraso (dá tempo da pessoa
    // olhar o restante da página antes de ver o pop-up), e as seguintes se
    // repetem em intervalos regulares
    setTimeout(function () {
        exibirProximaNotificacao();
        setInterval(exibirProximaNotificacao, INTERVALO_ENTRE_NOTIFICACOES_EM_MILISSEGUNDOS);
    }, ATRASO_ANTES_DA_PRIMEIRA_NOTIFICACAO_EM_MILISSEGUNDOS);
}
