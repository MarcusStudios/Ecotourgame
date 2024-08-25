function startGame(stageNumber) {
    // Aqui você pode definir a lógica para iniciar o jogo com base na fase selecionada
    alert(`Iniciando o jogo na Fase ${stageNumber}`);
    // Redirecionar para o jogo ou carregar o nível correspondente
    // window.location.href = `game.html?stage=${stageNumber}`;
}

function showInstructions() {
    document.getElementById('instructions').style.display = 'block';
}

function hideInstructions() {
    document.getElementById('instructions').style.display = 'none';
}
