const tela1 = document.querySelector('.tela01');
const tela2 = document.querySelector('.tela02');
const tela3 = document.querySelector('.tela03');
const topoTela2 = document.querySelector('.topoTela2');
const quizImportado = document.querySelector('.quizz-importados');
const quizIndividual = objeto =>{
      let templateQuiz =`<div class="quizz-individual">
                    <p onclick="redirecionaTela2()">
                    ${objeto.title}
                    </p>
                 </div>`
    return templateQuiz;
}
let perguntas = document.querySelector('.perguntas');

function getQuizz(){
    let chamaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    chamaQuiz.then(listaQuiz);
    chamaQuiz.catch(trataQuiz);
}
function listaQuiz(objeto){
    console.log(objeto.data);
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
function redirecionaTela2(){
    tela1.classList.add('escondido')
    tela2.classList.remove('escondido');
    tela3.classList.add('escondido');
}
function redirecionaTela3(){
    tela1.classList.add('escondido')
    tela2.classList.add('escondido');
    tela3.classList.remove('escondido');
}
function selecionaOpcao(opcao){

}
function getThisQuiz(){
    const getIDQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/2457');
    getIDQuiz.then(trataIDquiz);
}
function trataIDquiz(objeto){
    constroiTela2(objeto.data);
}
function constroiTela2(objeto){
    topoTela2.innerHTML = `<img src="${objeto.image}" alt="">
                     <h1>${objeto.title}</h1>`;
    perguntas.innerHTML += objeto.questions.map(constroiQuestao);
}
let constroiOpcoes = objeto =>{
    let respostas = objeto;
    let opcoes = `<div class="opcao">
                    <img src="${respostas.image}" alt="">
                    <h3>${respostas.text}</h2>
                 </div>`
    return opcoes;
}
let constroiQuestao = questao =>{
    let pergunta = `<div class="pergunta">
    <div class="tituloPergunta">
        <h2>${questao.title}</h2>
    </div>
    <div class="opcoes">
        ${questao.answers.map(constroiOpcoes)}
    </div>
</div>`

    return pergunta;  
}
getThisQuiz();
getQuizz();