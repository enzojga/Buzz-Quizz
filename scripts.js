const tela1 = document.querySelector('.corpo');
const tela2 = document.querySelector('.tela02');
const tela3 = document.querySelector('.tela03');

const templateQuiz = `<div class="quizz-individual">
                        <p onclick="redirecionaTela2()">
                             Acerte os personagens corretos dos Simpsons e prove seu amor!
                        </p>
                      </div>`;



function getQuizz(){
    let chamaQuiz = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    chamaQuiz.then(listaQuiz);
    chamaQuiz.catch(trataQuiz);
}
function listaQuiz(objeto){
    console.log(objeto.data);
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

getQuizz();