const tela1 = document.querySelector('.tela01');
const tela2 = document.querySelector('.tela02');
const tela3 = document.querySelector('.tela03');
const topo = document.querySelector('.topo');
let objOpcao;
let niveis;
let contadorAcerto = 0;
let totalPerguntas = 0;
let perguntasRespondidas = 0;
let porcentagemAcerto = 0;
let niveisQuiz;
const topoTela2 = document.querySelector('.topoTela2');
let idObjeto;
const quizImportado = document.querySelector('.quizz-importados');
function comparador() { 
	return Math.random() - 0.5; 
}
const quizIndividual = objeto => {
    let templateQuiz = `<div id="${objeto.id}" class="quizz-individual" onclick="redirecionaTela2(this)">
                            <img src="${objeto.image}">
                            <div class="gradiente1">
                            <p>${objeto.title}</p>
                            </div>
                        </div>`
    return templateQuiz;
}
let verificaTrue;
let perguntas = document.querySelector('.perguntas');

function getQuizz() {
    let chamaQuiz = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes');
    chamaQuiz.then(listaQuiz);
    chamaQuiz.catch(trataQuiz);
}
function listaQuiz(objeto) {
    quizImportado.innerHTML += objeto.data.map(quizIndividual);
}
function trataQuiz(objeto) {
    console.log('erro ao chamar');
}
function redirecionaTela1() {
    tela1.classList.remove('escondido')
    tela2.classList.add('escondido');
    tela3.classList.add('escondido');
}
function redirecionaTela2(argumento) {
    idObjeto = argumento.id;
    tela1.classList.add('escondido')
    tela2.classList.remove('escondido');
    tela3.classList.add('escondido');
    getThisQuiz();
}
function redirecionaTela3() {
    tela1.classList.add('escondido')
    tela2.classList.add('escondido');
    tela3.classList.remove('escondido');
}
function selecionaOpcao(opcao) {

}
function getThisQuiz() {
    const getIDQuiz = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${idObjeto}`);
    getIDQuiz.then(trataIDquiz);
    contadorAcerto = 0;
    totalPerguntas = 0;
    perguntasRespondidas = 0;

}
function trataIDquiz(objeto) {
    constroiTela2(objeto.data);
    niveisQuiz = objeto.data.levels;
}
function constroiTela2(objeto) {
    perguntas.innerHTML = '';
    topoTela2.innerHTML = `<img src="${objeto.image}" alt="">
                     <div class="fundoEscuro"></div>
                     <h1>${objeto.title}</h1>`;
    perguntas.innerHTML += objeto.questions.map(constroiQuestao);
    topo.scrollIntoView();
    console.log(totalPerguntas);
}
function verificaResposta(opcao) {
    let opcaoPai = opcao.parentNode;
    let perguntasList = document.querySelectorAll('.pergunta');
    console.log(perguntasList);
    let filhosPai = opcaoPai.querySelectorAll('.opcao');
    if (opcao.classList.contains('divNaoSelecionada') || opcao.classList.contains('escolhido')) {
        return;
    } else if (opcao.classList.contains('correta')) {
        contadorAcerto++;
        perguntasRespondidas++;
    } else {
        perguntasRespondidas++;
    }
    if (opcaoPai.querySelector('.escolhido') === null) {
        opcao.classList.add('escolhido');
    }
    for (let i = 0; i < filhosPai.length; i++) {
        if (!filhosPai[i].classList.contains('correta')) {
            let h3Filhos = filhosPai[i].querySelector('h3');
            h3Filhos.classList.add('h3Errado');
        }
        if (!filhosPai[i].classList.contains('escolhido')) {
            filhosPai[i].classList.add('divNaoSelecionada');
        }
        if (filhosPai[i].classList.contains('correta')) {
            let h3Correto = filhosPai[i].querySelector('h3');
            h3Correto.classList.add('h3Correto')
        }
    }
    console.log(contadorAcerto);
    console.log(perguntasRespondidas);
    verificaNivel();
    exibeNivel();
    setTimeout(scrolaTela, 2000, perguntasList);
}
function scrolaTela(lista) {
    if (lista[perguntasRespondidas] !== undefined) {
        lista[perguntasRespondidas].scrollIntoView();
    } else {
        let telaAcertoScroll = document.querySelector('.telaDeAcerto');
        telaAcertoScroll.scrollIntoView();
    }
}

let constroiOpcoes = objeto => {
    let opcao;
    if (objeto.isCorrectAnswer) {
        opcao = `<div class="opcao correta"  onclick="verificaResposta(this)">
                    <img src="${objeto.image}" alt="">
                    <h3>${objeto.text}</h2>
                 </div>`;
        return opcao;
    }
    opcao = `<div class="opcao"  onclick="verificaResposta(this)">
                <img src="${objeto.image}" alt="">
                <h3>${objeto.text}</h2>
            </div>`;
    return opcao;
}

let constroiQuestao = questao => {
    objOpcao = questao.answers;
    let pergunta = `<div class="pergunta">
                        <div class="tituloPergunta">
                            <h2>${questao.title}</h2>
                        </div>
                        <div class="opcoes">
                            ${objOpcao.map(constroiOpcoes).sort(comparador)}
                        </div>
                    </div>`;
    totalPerguntas++;
    return pergunta;
}
function verificaNivel() {
    if (perguntasRespondidas === totalPerguntas) {
        return true;
    }
}
function exibeNivel() {
    porcentagemAcerto = Math.floor((contadorAcerto * 100) / totalPerguntas);
    console.log(niveisQuiz[0].minValue);
    let menos1 = niveisQuiz.length - 1;
    if (verificaNivel()) {
        for (let i = niveisQuiz.length; i > 0; i--) {
            if (porcentagemAcerto >= niveisQuiz[menos1].minValue) {
                perguntas.innerHTML += `        <div class="pergunta telaDeAcerto">
                                                    <div class="tituloAcerto">
                                                    <h2>${niveisQuiz[menos1].title}</h2>
                                                    </div>
                                                    <div>
                                                    <img src="${niveisQuiz[menos1].image}" alt="" />
                                                    <p>
                                                     ${niveisQuiz[menos1].text}
                                                    </p>
                                                    </div>
                                                </div>
                                                `
                perguntas.innerHTML += `<div class="botoes">
                                                <div onclick='getThisQuiz()'>
                                                <h3>Reiniciar Quizz</h3>
                                                </div>
                                                <div onclick='redirecionaTela1()'>
                                                <h3>Voltar pra home</h3>
                                                </div>
                                            </div>`;
                return;
            };
            menos1--;
        }
    }
}
getQuizz();