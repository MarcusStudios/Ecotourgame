// Inicialize os sons

const errorSound = document.getElementById('error-sound');
const metalSound = document.getElementById('metal-sound');
const plasticSound = document.getElementById('plastic-sound');
const paperSound = document.getElementById('paper-sound');
const glassSound = document.getElementById('glass-sound');
const organicSound = document.getElementById('organic-sound');

backgroundSound.volume = 0.1; // Ajuste o volume do som ambiente
backgroundSound.play(); // Reproduza o som ambiente

let score = 0;
const scoreDisplay = document.getElementById('score');

function updateScore(amount) {
    score += amount;
    scoreDisplay.textContent = score;
}

function playSound(sound) {
    sound.currentTime = 0; // Reinicia o som para tocar desde o início
    sound.play();
}

// Função para lidar com o evento de soltar o lixo
function onTrashDrop(trash, bin) {
    if (trash.dataset.type === bin.dataset.type) {
        // Lixo colocado na lixeira correta
        switch (trash.dataset.type) {
            case 'metal':
                playSound(metalSound);
                break;
            case 'plastic':
                playSound(plasticSound);
                break;
            case 'paper':
                playSound(paperSound);
                break;
            case 'glass':
                playSound(glassSound);
                break;
            case 'organic':
                playSound(organicSound);
                break;
        }
        updateScore(10); // Adiciona 10 pontos
    } else {
        // Lixo colocado na lixeira errada
        playSound(errorSound);
        updateScore(-10); // Subtrai 10 pontos
    }
}

// Adicione um evento de "soltar" para cada lixo
document.querySelectorAll('.trash').forEach(trash => {
    trash.addEventListener('dragend', function(event) {
        const trash = event.target;
        const trashRect = trash.getBoundingClientRect();
        const bins = document.querySelectorAll('.bin');
        
        let droppedInCorrectBin = false;

        bins.forEach(bin => {
            const binRect = bin.getBoundingClientRect();
            if (
                trashRect.left < binRect.right &&
                trashRect.right > binRect.left &&
                trashRect.top < binRect.bottom &&
                trashRect.bottom > binRect.top
            ) {
                onTrashDrop(trash, bin);
                droppedInCorrectBin = true;
            }
        });

        if (!droppedInCorrectBin) {
            // Se o lixo não foi colocado em nenhuma lixeira
            trash.style.left = ''; // Reseta a posição
            trash.style.top = '';
        }
    });
});
