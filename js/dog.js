/* Marlon */

//Verifica Conteúdo no Storage
var myDogs = JSON.parse(localStorage.getItem('listDogs')) || [];


function renderDogs(){
    
   for (dog of myDogs){
       
       var repository = document.querySelector('#gallery');
       var dogConfigured = document.querySelector('#centerImageMount');
       var dogPicture = document.querySelector('#imageMount');
       var dogName = document.querySelector('#dogName');
              
       dogPicture.style.backgroundImage = dog.pathPicture;
       dogName.textContent = dog.name;
       dogName.style.fontFamily = dog.fontName;
       dogName.style.color = dog.colorFont;
       
       
       var timeElement = document.querySelector('#timeSaved');
       timeElement.textContent = dog.timeSaved;
       var clone = dogConfigured.cloneNode(true);
       repository = document.querySelector('#gallery');
       repository.appendChild(clone);
       timeElement.textContent = "";
       dogName.textContent = "";
    }
    
    //Reconfigura os elementos Base após o loop
    dogPicture.style.backgroundImage = "url(./images/pata-pet.png )";
    dogName.style.fontFamily = "Montserrat , sans-serif";
    dogName.style.color = "#e3007b";
    dogName.style.fontSize = "1.7em";
    var nameBreedInput = document.querySelector('#name');
    nameBreedInput.nodeValue = "";
}



// Se houver Storage, renderiza. Caso contrário, segue o código
if (!myDogs.length == 0)renderDogs();



// Requisição para consumir API do site buscando todas as raças

var breedParameterSearch = 'https://dog.ceo/api/breeds/list/all';
var allBreedsPromisse = function() {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', breedParameterSearch);
        xhr.send(null);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    resolve(JSON.parse(xhr.responseText));
                }else{
                    reject('Erro na Requisição');
                }
            }
        }
    });
}



// Trata a Requisição e insere os elementos no DOM (Raças inseridas no select)

var selectElement = document.querySelector('#selectBreeds');
allBreedsPromisse()
    .then(function(response) {
    
    var breeds = Object.keys(response.message);
    
    for (breed of breeds){
        
        var breedElement = document.createElement('option');
        var breedText = document.createTextNode(breed);
        breedElement.appendChild(breedText);
        selectElement.appendChild(breedElement);
    }
})
    .catch(function(error) {
        console.warn(error)
});



// A partir de uma raça selecionada, requisita imagem para inserir no DOM

selectElement.addEventListener('change', function(){
    var optionSelected = this.selectedOptions[0];
    var breedSelected = null;
    breedSelected = optionSelected.textContent;
    
    breedParameterSearch = 'https://dog.ceo/api/breed/' + breedSelected + '/images/random';
    
    allBreedsPromisse()
        .then(function(response) {
    
        var breedGetImage = response.message;
        var breedElementImage = document.querySelector('#imageMount');
        breedElementImage.style.backgroundImage = "url(" + breedGetImage + ")";
  
})
        .catch(function(error) {
        console.warn(error)
});  
    
})



/* funções para o Input */


// Controle do placeholder pelo Foco

var nameBreedInput = document.querySelector('#name');
nameBreedInput.addEventListener('focus', function(){
    
    var placeholderContent = this.getAttribute('placeholder');
    this.setAttribute('placeholder', "");
    var blur = function(){
        this.setAttribute('placeholder', placeholderContent);
    }
    this.addEventListener('blur', blur);
})



//Espelhamento dos caracteres digitados

nameBreedInput.addEventListener('keyup', function keyup(){
    var nameBreedGiven = document.querySelector('#dogName');
    nameBreedGiven.textContent = this.value;
})




/* Funções para Cores */


//Seleciona o Background do elemento clicado e aplica no color <p> com o nome do pet 

var colorMenu = document.querySelector('#colorMenu');
colorMenu.addEventListener('click', function(clickColor){
    clickColor.stopPropagation;
    
    var nameBreedGiven = document.querySelector('#dogName');
    var identifyElement = ("#") + clickColor.target.getAttribute('id');
    var elementClick = document.querySelector(identifyElement);
    var elementClickAttributes = getComputedStyle(elementClick);
    nameBreedGiven.style.color = elementClickAttributes.backgroundColor;
 })



/* Funções para Fontes */


//Seleciona a fonte do elemento clicado e aplica no <p> com o nome do pet

var fontMenu = document.querySelector('#fontMenu');
fontMenu.addEventListener('click', function(clickFont){
    clickFont.stopPropagation;
    
    var nameBreedGiven = document.querySelector('#dogName');
    var identifyElement = ("#") + clickFont.target.getAttribute('id');
    var elementClick = document.querySelector(identifyElement);
    var elementClickAttributes = getComputedStyle(elementClick);
    nameBreedGiven.style.fontFamily = elementClickAttributes.fontFamily;
    nameBreedGiven.style.fontSize = elementClickAttributes.fontSize;
})



/* Botão Trocar Imagem */


//chama a requisição

var buttonChangeImage = document.querySelector('#replaceImage');
buttonChangeImage.addEventListener('click', function(){
    
    allBreedsPromisse()
        .then(function(response) {
    
        var breedGetImage = response.message;
        var breedElementImage = document.querySelector('#imageMount');
        breedElementImage.style.backgroundImage = "url(" + breedGetImage + ")";
  
})
        .catch(function(error) {
        console.warn(error)
});    
    
})



/* Botão Salvar */


//Clona, salva no DOM e Armazena no Storage

var buttonSaveImage = document.querySelector('#save');
buttonSaveImage.addEventListener('click', function(){
    
    //captura elementos necessários e clona para o gallery
    var timeSave = new Date();
    var rightTime = document.createTextNode(timeSave.getDate() + "/" + (1 + timeSave.getMonth()) + "/" + timeSave.getFullYear() + " às " +timeSave.getHours() + ":" + timeSave.getMinutes());
    var timeElement = document.createElement('span');
    timeElement.appendChild(rightTime);
    
    var dogConfigured = document.querySelector('#centerImageMount');
    dogConfigured.appendChild(timeElement);
    var clone = dogConfigured.cloneNode(true);
    var repository = document.querySelector('#gallery');
    repository.appendChild(clone);
    timeElement.remove(rightTime);
    
    //LocalStorage - um objeto com as informações do Pet são inseridos no Array e gravados no Storage
    var dogSelected = {
    pathPicture: "",
    name: "",
    fontName: "",
    colorFont: "",
    timeSaved: ""
    };
    
    //Reconfigura os elementos Base e salva os dados
    dogSelected.pathPicture = document.querySelector('#imageMount').style.backgroundImage;
    dogSelected.name = document.querySelector('#dogName').textContent;
    dogSelected.fontName = document.querySelector('#dogName').style.fontFamily;
    dogSelected.colorFont = document.querySelector('#dogName').style.color;
    dogSelected.timeSaved = rightTime.wholeText;
    
    myDogs.push(dogSelected);
    saveToStorage();
    
    //Alerta para o Usuário
    var alertSave = document.querySelector('#msgSave');
    alertSave.style.color = "#9781b7";
    setTimeout(function(){
               alertSave.style.color = "transparent";
               }, 2500);
    
})


//Storage
function saveToStorage(){
    localStorage.setItem('listDogs', JSON.stringify(myDogs));
    
}

