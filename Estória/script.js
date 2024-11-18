const story = {
    1: {
        text: "Você é um aventureiro audacioso em busca de tesouros em uma masmorra misteriosa. Ao entrar, você se depara com dois caminhos. O que você faz?",
        options: [
            { text: "Seguir pelo caminho à esquerda", next: 2 },
            { text: "Seguir pelo caminho à direita", next: 3 }
        ]
    },
    2: {
        text: "Você entra em um corredor escuro e logo encontra uma grande porta trancada. Você percebe que há um enigma escrito na porta. O que você faz?",
        options: [
            { text: "Tentar resolver o enigma para abrir a porta", next: 4 },
            { text: "Forçar a porta com toda a sua força", next: 5 }
        ]
    },
    3: {
        text: "Você chega a uma sala com um monstro guardião feroz. A sala está cheia de armadilhas. O que faz?",
        options: [
            { text: "Tentar enfrentar o monstro", next: 6 },
            { text: "Tentar usar as armadilhas contra o monstro", next: 7 }
        ]
    },
    4: {
        text: "Você resolve o enigma com sucesso e a porta se abre, revelando uma sala cheia de riquezas. Mas há uma outra porta à sua frente com mais desafios. O que você faz?",
        options: [
            { text: "Seguir para a próxima sala", next: 8 },
            { text: "Voltar para o início e sair da masmorra", next: 9 }
        ]
    },
    5: {
        text: "Você tenta forçar a porta, mas uma armadilha é ativada e você é gravemente ferido. Você morre.",
        isEnding: true
    },
    6: {
        text: "Você derrota o monstro em uma batalha épica, mas é gravemente ferido. A sala está cheia de tesouros, mas você percebe que precisa sair antes de sucumbir. Você sai em segurança, mas sem muito tesouro.",
        isEnding: true
    },
    7: {
        text: "Você usa as armadilhas contra o monstro e o derrota, mas ao abrir o baú, uma maldição é liberada. Você escapa da masmorra com vida, mas o preço foi alto.",
        isEnding: true
    },
    8: {
        text: "Você entra na sala cheia de riquezas e encontra um artefato antigo. Você tem que decidir: levar o artefato ou sair com o tesouro. O que faz?",
        options: [
            { text: "Levar o artefato e enfrentar o que vier", next: 10 },
            { text: "Deixar o artefato e sair com o tesouro", next: 11 }
        ]
    },
    9: {
        text: "Você decide voltar para o início e sair da masmorra, mas sem tesouro. Pelo menos está em segurança. Você venceu!",
        isEnding: true
    },
    10: {
        text: "O artefato o transporta para outra dimensão, cheia de novos desafios. Sua aventura continua!",
        isEnding: true
    },
    11: {
        text: "Você sai com o tesouro, mas sente que perdeu algo importante. De qualquer forma, você sobreviveu e é um vencedor!",
        isEnding: true
    }
};

function loadStory() {
    const params = new URLSearchParams(window.location.search);
    let currentStep = parseInt(params.get('step') || '1');
    let visitedSteps = JSON.parse(localStorage.getItem('visitedSteps')) || [];
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let playerChoices = JSON.parse(localStorage.getItem('playerChoices')) || {}; // Armazenar as escolhas do jogador

    if (!visitedSteps.includes(currentStep)) {
        visitedSteps.push(currentStep);
        history.push(story[currentStep].text);
        localStorage.setItem('visitedSteps', JSON.stringify(visitedSteps));
        localStorage.setItem('history', JSON.stringify(history));
    }

    const container = document.getElementById('story-container');
    container.innerHTML = `<p>${story[currentStep].text}</p>`;

    if (story[currentStep].isEnding) {
        container.innerHTML += `
            <p><strong>Fim da aventura!</strong></p>
            <p><a href="?step=1">Recomeçar</a></p>
            <button id="clear-history" style="margin-top: 10px;">Limpar Caminho Percorrido</button>
        `;
        document.getElementById('clear-history').addEventListener('click', () => {
            localStorage.clear();
            alert('Caminho percorrido foi limpo!');
            renderHistory([]); 
        });
        renderHistory(history);
        return;
    }

    // Modificar opções com base nas escolhas anteriores
    let options = story[currentStep].options;

    // Alterando as opções com base nas escolhas anteriores
    if (playerChoices['artefato'] && currentStep === 8) {
        // Se o jogador já pegou o artefato antes, ele terá uma opção extra
        options.push({ text: "Voltar e tentar pegar o artefato", next: 10 });
    }

    options.forEach((option) => {
        const link = document.createElement('a');
        link.href = `?step=${option.next}`;
        link.innerText = option.text;
        link.addEventListener('click', () => {
            // Armazenar a escolha do jogador
            if (option.next === 10) {
                playerChoices['artefato'] = true;
                localStorage.setItem('playerChoices', JSON.stringify(playerChoices));
            }
            localStorage.setItem('lastStep', option.next);
        });

        const optionElement = document.createElement('p');
        optionElement.appendChild(link);
        container.appendChild(optionElement);
    });

    renderHistory(history);
}

function renderHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        historyList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', loadStory);
