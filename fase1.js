console.log('Jogo de Reciclagem');
const trashTypes = [
    { type: 'metal', img: 'metal1.png', sound: new Audio('metal.mp3') },
    { type: 'plastic', img: 'plastico1.png', sound: new Audio('plastic.mp3') },
    { type: 'paper', img: 'papel1.png', sound: new Audio('paper.mp3') },
    { type: 'glass', img: 'vidro1.png', sound: new Audio('glassFLAC.mp3') },
    { type: 'organic', img: 'organico1.png', sound: new Audio('organic.mp3') }
];

const trashContainer = document.getElementById('trash-container');
const scoreElement = document.getElementById('score');
const errorSound = new Audio('misplaced.mp3');
const backgroundSound = document.getElementById('background-sound');
const toggleMusicButton = document.getElementById('toggle-music');
const resultadoModal = document.getElementById('resultadoModal');
const finalScore = document.getElementById('finalScore');
const restartGameButton = document.getElementById('restartGame');
const nextPhaseButton = document.getElementById('nextPhase');
let score = 0;
let trashCount = 0; // Contador de lixo
let isMuted = false;

// Inicializa o som de fundo
backgroundSound.loop = true;

backgroundSound.volume = 0.5;

// Toca o som de fundo ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    // Não inicia a música automaticamente. Ela será iniciada após uma interação do usuário.
});

// Controla o som de fundo com o botão
toggleMusicButton.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        backgroundSound.pause();
        toggleMusicButton.textContent = '🔇';
        toggleMusicButton.classList.add('muted');
    } else {
        backgroundSound.play().catch(error => {
            console.log('Erro ao reproduzir o som de fundo:', error);
        });
        toggleMusicButton.textContent = '🔊';
        toggleMusicButton.classList.remove('muted');
    }
});

function createRandomTrash() {
    const numberOfTrashes = 3;
    trashTypes.forEach(trashType => {
        for (let i = 0; i < numberOfTrashes; i++) {
            const trashElement = document.createElement('img');
            trashElement.src = trashType.img;
            trashElement.className = 'trash';
            trashElement.dataset.type = trashType.type;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = (Math.random() - 0.5) * 200;
            const offsetY = (Math.random() - 0.5) * 200;

            trashElement.style.left = `${centerX + offsetX}px`;
            trashElement.style.top = `${centerY + offsetY}px`;
            trashContainer.appendChild(trashElement);

            trashElement.addEventListener('touchstart', touchStart);
            trashElement.addEventListener('touchmove', touchMove);
            trashElement.addEventListener('touchend', touchEnd);
            trashElement.addEventListener('mousedown', mouseDown);

            trashCount++; // Incrementa o contador de lixo para cada item criado
        }
    });
}

let draggedTrash = null;
let offsetX, offsetY;

function touchStart(e) {
    if (e.cancelable) {
        e.preventDefault(); // Somente previne o comportamento se o evento for cancelável
    }
    const touch = e.touches[0];
    draggedTrash = e.target;
    offsetX = touch.clientX - draggedTrash.getBoundingClientRect().left;
    offsetY = touch.clientY - draggedTrash.getBoundingClientRect().top;

    // Adiciona um estilo temporário para verificação
    draggedTrash.style.border = '2px solid rgba(255, 0, 0, 0.5)';
}


function touchMove(e) {
    e.preventDefault();
    if (!draggedTrash) return;
    const touch = e.touches[0];

    // Calcula a nova posição
    let newLeft = touch.clientX - offsetX;
    let newTop = touch.clientY - offsetY;

    // Mantém o lixo dentro dos limites da tela
    const trashRect = draggedTrash.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Adiciona logs para depuração
    console.log('newLeft:', newLeft, 'newTop:', newTop);
    console.log('trashRect:', trashRect);
    console.log('windowWidth:', windowWidth, 'windowHeight:', windowHeight);

    // Ajusta os limites
    if (newLeft < 0) newLeft = 0; // Limite esquerdo
    if (newTop < 0) newTop = 0; // Limite superior
    if (newLeft + trashRect.width > windowWidth) newLeft = windowWidth - trashRect.width; // Limite direito
    if (newTop + trashRect.height > windowHeight) newTop = windowHeight - trashRect.height; // Limite inferior

    // Atualiza a posição do lixo
    draggedTrash.style.left = `${newLeft}px`;
    draggedTrash.style.top = `${newTop}px`;

    // Adiciona logs para verificar os ajustes
    console.log('Adjusted newLeft:', newLeft, 'Adjusted newTop:', newTop);
}





function touchEnd() {
    if (!draggedTrash) return;
    draggedTrash.style.border = 'none'; // Remove o estilo temporário
    checkDrop();
    draggedTrash = null;
}

function mouseDown(e) {
    e.preventDefault();
    draggedTrash = e.target;
    offsetX = e.clientX - draggedTrash.getBoundingClientRect().left;
    offsetY = e.clientY - draggedTrash.getBoundingClientRect().top;
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    // Adiciona um estilo temporário para verificação
    draggedTrash.style.border = '2px solid rgba(255, 0, 0, 0.5)';
}

function mouseMove(e) {
    if (!draggedTrash) return;

    // Calcula a nova posição
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Mantém o lixo dentro dos limites da tela
    const trashRect = draggedTrash.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (newLeft < 0) newLeft = 0; // Limite esquerdo
    if (newTop < 0) newTop = 0; // Limite superior
    if (newLeft + trashRect.width > windowWidth) newLeft = windowWidth - trashRect.width; // Limite direito
    if (newTop + trashRect.height > windowHeight) newTop = windowHeight - trashRect.height; // Limite inferior

    draggedTrash.style.left = `${newLeft}px`;
    draggedTrash.style.top = `${newTop}px`;
}

function mouseUp() {
    if (!draggedTrash) return;
    draggedTrash.style.border = 'none'; // Remove o estilo temporário
    checkDrop();
    draggedTrash = null;
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
}

function checkDrop() {
    const bins = document.querySelectorAll('.bin');
    let droppedInBin = false;

    bins.forEach(bin => {
        const binRect = bin.getBoundingClientRect();
        const trashRect = draggedTrash.getBoundingClientRect();

        if (
            trashRect.left < binRect.right &&
            trashRect.right > binRect.left &&
            trashRect.top < binRect.bottom &&
            trashRect.bottom > binRect.top
        ) {
            if (bin.dataset.type === draggedTrash.dataset.type) {
                score += 10;
                const sound = trashTypes.find(type => type.type === draggedTrash.dataset.type).sound;
                sound.currentTime = 0;
                sound.play();
                draggedTrash.classList.add('success-animation');
                showPointsChange(10, true);
            } else {
                score -= 10;
                errorSound.currentTime = 0;
                errorSound.play();
                draggedTrash.classList.add('error-animation');
                showPointsChange(-10, false);
            }
            droppedInBin = true;
            trashCount--; // Diminui o contador de lixo ao descartar
            setTimeout(() => {
                if (draggedTrash && draggedTrash.parentNode) {
                    draggedTrash.remove();
                }
            }, 500);
        }
    });

    scoreElement.textContent = score;

    // Verifica se todo o lixo foi descartado
    if (trashCount === 0) {
        openModal(); // Exibe o modal quando o jogo termina
    }
}

function showPointsChange(amount, isGain) {
    const pointsChange = document.createElement('div');
    pointsChange.className = isGain ? 'points-gain' : 'points-loss';
    pointsChange.textContent = `${amount > 0 ? '+' : ''}${amount}`;
    pointsChange.style.left = `${window.innerWidth / 2}px`;
    pointsChange.style.top = `${window.innerHeight / 2}px`;
    document.body.appendChild(pointsChange);
    setTimeout(() => pointsChange.remove(), 1000);
}

function openModal() {
    finalScore.textContent = score; // Atualiza a pontuação final no modal
    resultadoModal.style.display = 'flex'; // Exibe o modal
}

restartGameButton.addEventListener('click', () => {
    resultadoModal.style.display = 'none'; // Esconde o modal
    resetGame(); // Reinicia o jogo
});

nextPhaseButton.addEventListener('click', () => {
    window.location.href = 'fase2.html'; // Vai para a próxima fase
});

document.getElementById('goToPhaseScreen').addEventListener('click', function() {
    window.location.href = 'index.html'; // Vai para a tela de fases
});

function resetGame() {
    score = 0;
    scoreElement.textContent = score;
    trashCount = 0; // Reseta o contador de lixo
    trashContainer.innerHTML = '';
    createRandomTrash();
}

// Inicializa o jogo
createRandomTrash();