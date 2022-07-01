const tela1 = document.querySelector('.tela01');
const tela2 = document.querySelector('.tela02');
const tela3 = document.querySelector('.tela03');
let objOpcao;
const topoTela2 = document.querySelector('.topoTela2');
let idObjeto;
const quizImportado = document.querySelector('.quizz-importados');
const quizIndividual = objeto =>{
      let templateQuiz =`<div id="${objeto.id}" class="quizz-individual" onclick="redirecionaTela2(this)">
                            <img src="${objeto.image}">
                            <p>${objeto.title}</p>
                        </div>`
    return templateQuiz;
}
let verificaTrue;
let perguntas = document.querySelector('.perguntas');

function getQuizz(){
    let chamaQuiz = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes');
    chamaQuiz.then(listaQuiz);
    chamaQuiz.catch(trataQuiz);
}
function listaQuiz(objeto){
    quizImportado.innerHTML += objeto.data.map(quizIndividual);
}
function trataQuiz(objeto){
    console.log('erro ao chamar');
}
function redirecionaTela1(){
    tela1.classList.remove('escondido')
    tela2.classList.add('escondido');
    tela3.classList.add('escondido');
}
function redirecionaTela2(argumento){
    idObjeto = argumento.id;
    tela1.classList.add('escondido')
    tela2.classList.remove('escondido');
    tela3.classList.add('escondido');
    getThisQuiz();
}
function redirecionaTela3(){
    tela1.classList.add('escondido')
    tela2.classList.add('escondido');
    tela3.classList.remove('escondido');
}
function selecionaOpcao(opcao){

}
function getThisQuiz(){
    const getIDQuiz = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${idObjeto}`);
    getIDQuiz.then(trataIDquiz);
}
function trataIDquiz(objeto){
    constroiTela2(objeto.data);
}
function constroiTela2(objeto){
    perguntas.innerHTML ='';
    topoTela2.innerHTML = `<img src="${objeto.image}" alt="">
                     <h1>${objeto.title}</h1>`;
    perguntas.innerHTML += objeto.questions.map(constroiQuestao);
    console.log(objeto.levels);
}
function verificaResposta(opcao){
    let opcaoPai = opcao.parentNode;
    console.log(opcao.innerHTML);
    let filhosPai = opcaoPai.querySelectorAll('.opcao');
    if(opcao.classList.contains('divNaoSelecionada') || opcao.classList.contains('escolhido')){
        return;
    }
    if(opcaoPai.querySelector('.escolhido') === null){
        opcao.classList.add('escolhido');
    }
    for(let i =0; i <filhosPai.length; i++){
        if(!filhosPai[i].classList.contains('correta')){
            let h3Filhos = filhosPai[i].querySelector('h3');
            h3Filhos.classList.add('h3Errado');
        }
        if(!filhosPai[i].classList.contains('escolhido')){
            filhosPai[i].classList.add('divNaoSelecionada');
        }
        if(filhosPai[i].classList.contains('correta')){
            let h3Correto = filhosPai[i].querySelector('h3');
            h3Correto.classList.add('h3Correto')
        }
    }
}

let constroiOpcoes = objeto =>{
    let opcao;
    if(objeto.isCorrectAnswer){
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

let constroiQuestao = questao =>{
    objOpcao = questao.answers;
    let pergunta = `<div class="pergunta">
                        <div class="tituloPergunta">
                            <h2>${questao.title}</h2>
                        </div>
                        <div class="opcoes">
                            ${objOpcao.map(constroiOpcoes)}
                        </div>
                    </div>`
    return pergunta;  
}
getQuizz();