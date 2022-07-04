const tela1 = document.querySelector('.tela01');
const tela2 = document.querySelector('.tela02');
const tela3 = document.querySelector('.tela03');
const topo = document.querySelector('.tela02 .topo');
localStorage.setItem("teste", 'estou testando');
let objOpcao;
let niveis;
let niveisList = [];
let objQuestionario ={};
let contadorAcerto = 0;
let quizzCriado;
let questions = [];
let totalPerguntas = 0;
let perguntasRespondidas = 0;
let porcentagemAcerto = 0;
let niveisQuiz;
let objPost;
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
                        </div>`;
    let idVerifica = localStorage.getItem(`${objeto.id}`);
    if(idVerifica === null){
        quizImportado.innerHTML += templateQuiz;
    }else if(idVerifica !== undefined){
        let quizzFeito = document.querySelector('.quizz-feito')
        let quizCriado = document.querySelector('.quizz-criado');
        let criarQuiz = document.querySelector('.criar-quizz');
        quizCriado.classList.remove('escondido');
        criarQuiz.classList.add('escondido');
        quizzFeito.innerHTML += templateQuiz;
    }
}
let verificaTrue;
let perguntas = document.querySelector('.perguntas');

function getQuizz() {
    let chamaQuiz = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes');
    chamaQuiz.then(listaQuiz);
    chamaQuiz.catch(trataQuiz);
}
function listaQuiz(objeto) {
    quizImportado.innerHTML ='';
    objeto.data.map(quizIndividual);
}
function trataQuiz(objeto) {
    console.log('erro ao chamar');
}
function redirecionaTela1() {
    getQuizz();
    tela1.classList.remove('escondido');
    tela2.classList.add('escondido');
    tela3.classList.add('escondido');
}
function redirecionaTela2(argumento) {
    idObjeto = argumento.id;
    tela1.classList.add('escondido');
    tela2.classList.remove('escondido');
    tela3.classList.add('escondido');
    getThisQuiz();
}
function redirecionaTela2ID(){
    tela1.classList.add('escondido');
    tela2.classList.remove('escondido');
    tela3.classList.add('escondido');
    getThisQuiz();
}
function redirecionaTela3() {
    tela1.classList.add('escondido');
    tela2.classList.add('escondido');
    tela3.classList.remove('escondido');
}
function getThisQuiz() {
    const getIDQuiz = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${idObjeto}`);
    getIDQuiz.then(trataIDquiz);
    contadorAcerto = 0;
    totalPerguntas = 0;
    perguntasRespondidas = 0;
    topoTela2.scrollIntoView();
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
    perguntas.innerHTML += objeto.questions.map(constroiQuestao).join('');
    topo.scrollIntoView();
}
function verificaResposta(opcao) {
    let opcaoPai = opcao.parentNode;
    let perguntasList = document.querySelectorAll('.pergunta');
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
    verificaNivel();
    setTimeout(scrolaTela, 2000, perguntasList);
    exibeNivel();
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
    let pergunta = `<div class="wCem">
                        <div class="pergunta">
                            <div style="background-color:${questao.color};"class="tituloPergunta">
                                <h2>${questao.title}</h2>
                            </div>
                            <div class="opcoes">
                                ${objOpcao.map(constroiOpcoes).sort(comparador).join('')}
                            </div>
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
function exibeQuestionario(div){
    let paiDiv = div.parentElement;
    let minimizado = paiDiv.querySelector(':nth-child(1)');
    let maximizado = paiDiv.querySelector('.bg2');
    if(document.querySelector('.expandida') !== null){
        let expandida = document.querySelector('.expandida');
        let minimizado1 = expandida.querySelector(':nth-child(1)');
        let maximizado1 = expandida.querySelector('.bg2');
        expandida.classList.remove('expandida');
        minimizado1.classList.toggle('flex');
        minimizado1.classList.toggle('escondido');
        maximizado1.classList.toggle('escondido');    
    }
    paiDiv.classList.add('expandida');
    minimizado.classList.toggle('flex');
    minimizado.classList.toggle('escondido');
    maximizado.classList.toggle('escondido');
}
function exibeQuestionarioNivel(div){
    let paiDiv = div.parentElement;
    let minimizado = paiDiv.querySelector(':nth-child(1)');
    let maximizado = paiDiv.querySelector('.bg3');
    if(document.querySelector('.expandida') !== null){
        let expandida = document.querySelector('.expandida');
        let minimizado1 = expandida.querySelector(':nth-child(1)');
        let maximizado1 = expandida.querySelector('.bg3');
        expandida.classList.remove('expandida');
        minimizado1.classList.toggle('flex');
        minimizado1.classList.toggle('escondido');
        maximizado1.classList.toggle('escondido');    
    }
    paiDiv.classList.add('expandida');
    minimizado.classList.toggle('flex');
    minimizado.classList.toggle('escondido');
    maximizado.classList.toggle('escondido');
}
function geraPerguntas(index){
    let criacao = document.querySelector('.criacao2');
    criacao.innerHTML= `<h2>Crie suas perguntas</h2>`;
    for(let i=1; i <= index; i++){
        criacao.innerHTML += `<div class="questionarios">
                                <div onclick="exibeQuestionario(this)" class="questionariominimizado flex">
                                    <h4>Pergunta ${i}</h4>
                                    <img src="img/Vector.png">
                                </div>
                                <div class="bg2 escondido">
                                    <div class="questionario2 flex">
                                        <h3>Pergunta ${i}</h3>
                                        <input type="text" class="" placeholder="Texto da pergunta" />          
                                        <input type="text" class="" placeholder="Cor de fundo da pergunta" />          
                                        <h3>Resposta correta</h3>
                                        <input type="text" class="" placeholder="Resposta correta" />  
                                        <input type="text" class="" placeholder="URL da imagem" />
                                        <h3>Respostas incorretas</h3>
                                        <input type="text" class="" placeholder="Resposta incorreta 1" />  
                                        <input type="text" class="" placeholder="URL da imagem 1" />
                                        <br>
                                        <input type="text" class="" placeholder="Resposta incorreta 2" />  
                                        <input type="text" class="" placeholder="URL da imagem 2" />
                                        <br>
                                        <input type="text" class="" placeholder="Resposta incorreta " />  
                                        <input type="text" class="" placeholder="URL da imagem 3" />
                                    </div>
                                </div>
                               </div>`
    }
    criacao.innerHTML += `<button onclick="verificaPerguntas()" class="botaoConfirma">
                            <p>Prosseguir pra criar níveis</p>
                          </button>`;
}
function geraNiveis(index){
    const criacao3 = document.querySelector('.criacao3');
    criacao3.innerHTML = '<h2>Agora, decida os níveis</h2>';
    for(let i=1; i <= index; i++){
        criacao3.innerHTML += `<div class="questionarios">
                                <div onclick="exibeQuestionarioNivel(this)" class="questionariominimizado flex">
                                    <h4>Pergunta ${i}</h4>
                                    <img src="img/Vector.png">
                                </div>
                                <div class="bg3 escondido">
                                    <div class="questionario3">
                                    <h3>Nível ${i}</h3>
                                    <input type="text" class="" placeholder="Título do nível" />
                                    <input type="text" class="" placeholder="% de acerto mínima" />
                                    <input type="text" class="" placeholder="URL da imagem do nível" />
                                    <div class="descricao">
                                        <input type="text" class="" placeholder="Descrição do nível" />  
                                    </div>
                                    </div>
                                </div>
                                </div>`
    }
    criacao3.innerHTML += `<button onclick="verificaNiveis()" class="botaoConfirma">
                            <p>Finalizar Quizz</p>
                           </button>`
}
function verificaNiveis(){
    const criacao3 = document.querySelector('.criacao3')
    const listaNiveis = document.querySelectorAll('.questionario3');
    for (let i = 0; i < listaNiveis.length; i++){
        montaNiveis(listaNiveis[i]);
    }
    verificaMinValue(niveisList);
    let filtro = niveisList.filter(verificaNiveisList);
    if(filtro.length < niveisList.length || !verificaMinValue()){
        alert('Preencha os dados corretamente');
        niveisList = [];
    }else{
        criacao3.classList.remove('flex');
        criacao3.classList.add('escondido');
        telaPronta();
    }
}
function montaNiveis(lista){
    let nivelCriado ={
        title: lista.querySelector(':nth-child(2)').value,
        minValue: Number(lista.querySelector(':nth-child(3)').value),
        image: lista.querySelector(':nth-child(4)').value,
        text: lista.querySelector(':nth-child(5) input').value
    }
    niveisList.push(nivelCriado);
}

function checakUrl(string) {
    try {
     let url = new URL(string)
     return true;
   } catch(err) {
        return false;
   }
 }
function verificaQuestionario(){
    const questionario = document.querySelector('.questionario1');
    const criacao1 = document.querySelector('.criacao1');
    objQuestionario ={
        title: questionario.querySelector(':nth-child(1)').value,
        image: questionario.querySelector(':nth-child(2)').value,
        quantidadePerguntas: questionario.querySelector(':nth-child(3)').value,
        quantidadeNiveis: questionario.querySelector(':nth-child(4)').value,
    }
    if(!verificaObj(objQuestionario,criacao1)){
        alert('Preencha os dados corretamente')
    }
}
function verificaObj(objeto,criacao1){
    if(objeto.title.length < 20 || objeto.title.length > 65){
        return false;
    } 
    if(!checakUrl(objeto.image)){
        return false;
    }
    if(objeto.quantidadePerguntas < 3 || isNaN(objeto.quantidadePerguntas)){
        return false;
    }
    if(objeto.quantidadeNiveis < 2 || isNaN(objeto.quantidadeNiveis)){
        return false;
    }
    geraPerguntas(objeto.quantidadePerguntas);
    criacao1.classList.remove('flex');
    criacao1.classList.add('escondido');
    return true;   
}
function verificaPerguntas(){
    const listaQuestoes = document.querySelectorAll('.questionario2');
    const criacao2 = document.querySelector('.criacao2')
    for (let i = 0; i < listaQuestoes.length; i++){
        montaQuizz(listaQuestoes[i]);
    }
    let filtro = questions.filter(verificaQuestions);
    if(filtro.length < questions.length){
        alert('Preencha os dados corretamente');
        questions = [];
    }else {
        geraNiveis(objQuestionario.quantidadeNiveis);
        criacao2.classList.remove('flex');
        criacao2.classList.add('escondido');
        let expandido = document.querySelector('.expandida');
        expandido.classList.remove('expandida');
    }
}
function verificaMinValue(){
    if(niveisList[0].minValue !== 0 && niveisList[1].minValue !== 0){
        return false;
    }
    return true;
}
function montaQuizz(objeto){

    let quizzCriado ={
        title: objeto.querySelector(':nth-child(2)').value,
        color: objeto.querySelector(':nth-child(3)').value,
        answers: [{
            text: objeto.querySelector(':nth-child(5)').value,
            image:objeto.querySelector(':nth-child(6)').value,
            isCorrectAnswer: true
        },{
            text: objeto.querySelector(':nth-child(8)').value,
            image: objeto.querySelector(':nth-child(9)').value,
            isCorrectAnswer: false
        }

    ]
    }
    if(objeto.querySelector(':nth-child(11)').value != ''){
        let respostaErrada2 =  {
            text: objeto.querySelector(':nth-child(11)').value,
            image: objeto.querySelector(':nth-child(12)').value,
            isCorrectAnswer: false    
        }
        quizzCriado.answers.push(respostaErrada2);
    }
    if(objeto.querySelector(':nth-child(14)').value != ''){
        let respostaErrada3 ={
            text: objeto.querySelector(':nth-child(14)').value,
            image: objeto.querySelector(':nth-child(15)').value,
            isCorrectAnswer: false    
        }
        quizzCriado.answers.push(respostaErrada3);
    }

    console.log(quizzCriado);
    console.log(questions)
    questions.push(quizzCriado);
}
function verificaVazio (questao) {
    let answers = questao.answers;
    console.log(answers[0]);
    if(answers[0].text == '' || answers[1].text == ''){
        return false;
    }
    if(!checakUrl(answers[0].image) || !checakUrl(answers[1].image) ){
        return false;
    }
    if(!verificaHexa(questao.color)){
        return false;
    };
    return true;
}
let verificaQuestions = questao =>{
    if(questao.title.length < 20){
        return false;
    }
    if(!verificaVazio(questao)){
        return false;
    }
    return true;
}
function verificaList (nivel) {
    console.log(nivel);
    if(!checakUrl(nivel.image)){
        return false;
    }
    return true;
}
let verificaNiveisList = nivel =>{
    if(nivel.title.length < 10){
        return false;
    }
    if(!verificaList(nivel)){
        return false;
    }
    if(nivel.text.length < 30){
        return false;
    }
    if(!(nivel.minValue >= 0 && nivel.minValue <= 100) || isNaN(nivel.minValue)){
        return false;
    }
    return true;
}
function telaPronta(){
    console.log(niveisList);
    let criacao4 = document.querySelector('.criacao4');
    objPost = {
        title: objQuestionario.title,
        image: objQuestionario.image,
        questions: questions,
        levels: niveisList
    }
    let postQuiz = axios.post('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes',objPost);
    postQuiz.then(trataPostQuiz);
    console.log(objPost);
    criacao4.innerHTML += `<h2>Seu quizz está pronto!</h2>
                            <div class="quadro">       
                            <img src="${objQuestionario.image}"/>
                            <div class="gradiente">
                                <p>${objQuestionario.title}</p>
                            </div>          
                            </div>   
                            <button onclick="redirecionaTela2ID()" class="botaoConfirma1">
                            <p>Acessar Quizz</p>
                            </button>
                            <button onclick="redirecionaTela1()" class="botaoConfirma2">
                            <p>Voltar pra Home</p>
                         </button>`;
}
function trataPostQuiz(post){
    console.log(post);
    idObjeto = post.data.id;
    let id= JSON.stringify(idObjeto);
    localStorage.setItem(`${id}`,id);
}
function verificaHexa(inputString){
    let re = /[0-9A-Fa-f]{6}/g;
    teste = re.lastIndex;
    if(re.test(inputString) && inputString[0] === '#') {
        teste =0;
        return true;
    } else {
        teste =0;
        return false;
    }
}
getQuizz();