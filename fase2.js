const trashTypes = [
    { type: 'metal', img: 'metal1.png', sound: new Audio('_sounds/effects/metal.wav') },
    { type: 'plastic', img: 'plastico1.png', sound: new Audio('_sounds/effects/plastic.wav') },
    { type: 'paper', img: 'papel1.png', sound: new Audio('_sounds/effects/paper.mp3') },
    { type: 'glass', img: 'vidro1.png', sound: new Audio('_sounds/effects/glassFLAC.flac') },
    { type: 'organic', img: 'organico1.png', sound: new Audio('_sounds/effects/organic.wav') }
];

const trashContainer = document.getElementById('trash-container');
const scoreElement = document.getElementById('score');
const errorSound = new Audio('_sounds/misplaced.mp3');
const backgroundSound = new Audio('_sounds/musics/After_School_Jamboree.mp3');
let score = 0;

// Função para criar lixos aleatórios
function createRandomTrash() {
    // Número de lixos reduzido
    const numberOfTrashes = 3;

    trashTypes.forEach(trashType => {
        for (let i = 0; i < numberOfTrashes; i++) {
            const trashElement = document.createElement('img');
            trashElement.src = trashType.img;
            trashElement.className = 'trash';
            trashElement.dataset.type = trashType.type;
            trashElement.dataset.soundId = trashType.type;

            // Posicionamento centralizado
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Posições aleatórias ao redor do centro
            const offsetX = (Math.random() - 0.5) * 200; // Ajuste a distância ao redor do centro
            const offsetY = (Math.random() - 0.5) * 200; // Ajuste a distância ao redor do centro

            trashElement.style.left = `${centerX + offsetX}px`;
            trashElement.style.top = `${centerY + offsetY}px`;
            trashContainer.appendChild(trashElement);

            // Eventos de toque e mouse para arrastar
            trashElement.addEventListener('touchstart', touchStart);
            trashElement.addEventListener('touchmove', touchMove);
            trashElement.addEventListener('touchend', touchEnd);

            trashElement.addEventListener('mousedown', mouseDown);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }
    });
}

// Variáveis para armazenar informações de toque e mouse
let draggedTrash = null;
let offsetX, offsetY;

function touchStart(e) {
    e.preventDefault(); // Previne o comportamento padrão do toque
    const touch = e.touches[0];
    draggedTrash = e.target;
    offsetX = touch.clientX - draggedTrash.getBoundingClientRect().left;
    offsetY = touch.clientY - draggedTrash.getBoundingClientRect().top;
}

function touchMove(e) {
    e.preventDefault(); // Previne o comportamento padrão do toque
    if (!draggedTrash) return;
    const touch = e.touches[0];
    draggedTrash.style.left = `${touch.clientX - offsetX}px`;
    draggedTrash.style.top = `${touch.clientY - offsetY}px`;
}

function touchEnd(e) {
    if (!draggedTrash) return;
    checkDrop();
    draggedTrash = null;
}

function mouseDown(e) {
    e.preventDefault(); // Previne o comportamento padrão do clique
    draggedTrash = e.target;
    offsetX = e.clientX - draggedTrash.getBoundingClientRect().left;
    offsetY = e.clientY - draggedTrash.getBoundingClientRect().top;
}

function mouseMove(e) {
    if (!draggedTrash) return;
    draggedTrash.style.left = `${e.clientX - offsetX}px`;
    draggedTrash.style.top = `${e.clientY - offsetY}px`;
}

function mouseUp(e) {
    if (!draggedTrash) return;
    checkDrop();
    draggedTrash = null;
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
                sound.currentTime = 0; // Reinicia o som para garantir que toque do início
                sound.play();
                // Adiciona a animação de sucesso
                draggedTrash.classList.add('success-animation');
                showPointsChange(10, true); // Mostra a animação de pontos ganhos
            } else {
                score -= 10;
                errorSound.currentTime = 0; // Reinicia o som para garantir que toque do início
                errorSound.play();
                // Adiciona a animação de erro
                draggedTrash.classList.add('error-animation');
                showPointsChange(-10, false); // Mostra a animação de pontos perdidos
            }
            droppedInBin = true;
            setTimeout(() => draggedTrash.remove(), 500); // Remove o lixo após a animação
        }
    });

    // Atualiza a pontuação
    scoreElement.textContent = score;
}

function showPointsChange(amount, isGain) {
    const pointsChange = document.createElement('div');
    pointsChange.className = isGain ? 'points-gain' : 'points-loss';
    pointsChange.textContent = `${amount > 0 ? '+' : ''}${amount}`;
    pointsChange.style.left = `${window.innerWidth / 2}px`; // Posiciona no centro horizontalmente
    pointsChange.style.top = `${window.innerHeight / 2}px`; // Posiciona no centro verticalmente
    document.body.appendChild(pointsChange);
    setTimeout(() => pointsChange.remove(), 1000); // Remove o elemento após 1 segundo
}

// Inicializa o jogo
createRandomTrash();
