const socket = io();
const mensagensDiv = document.getElementById('mensagens');
let somAtivado = false;
let audio; // variável global para o áudio pré-carregado

// Botão de ativação do som
document.getElementById('ativarSom').addEventListener('click', () => {
    somAtivado = true;

    // Inicializa AudioContext (necessário em alguns navegadores móveis)
    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Pré-carrega o áudio
    audio = new Audio('/meme-fail-alert-locran-1-00-01.mp3');
    audio.volume = 0.8;

    // Mostra que o som foi ativado
    document.getElementById('ativarSom').style.display = 'none';
    console.log('Som ativado e áudio pré-carregado!');
});

// Função para tocar o áudio
function tocarSom() {
    if (!somAtivado || !audio) return;

    // Clona o áudio para tocar várias vezes sem conflito
    const novoAudio = audio.cloneNode();
    novoAudio.currentTime = 0;
    novoAudio.play().catch(err => console.warn('Falha ao tocar som:', err));
}

// Recebe pedidos do servidor
socket.on('mensagem_retorno', (msg) => {
    // Toca o som
    tocarSom();

    // Cria o pedido na interface
    const pedido = document.createElement('div');
    pedido.style.display = "flex";
    pedido.style.flexDirection = "column";
    pedido.style.gap = "8px";
    pedido.style.padding = "8px 0";
    pedido.style.borderBottom = "1px solid black";
    pedido.style.width = "100%";
    pedido.style.background = "lightgray";

    const title = document.createElement('h3');
    title.innerText = "Pedido: XXX";
    title.style.textAlign = "center";

    const ul = document.createElement('ul');
    ul.style.display = "flex";
    ul.style.flexDirection = "column";
    ul.style.gap = "8px";
    ul.style.padding = "8px 20px";
    ul.style.listStyleType = "none";

    msg.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Produto: ${item.nome}, Quantidade: ${item.quantidade}`;
        ul.appendChild(li);
    });

    pedido.appendChild(title);
    pedido.appendChild(ul);
    mensagensDiv.appendChild(pedido);
});
