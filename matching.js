'use strict';

var cardArray = []; // This will be the array of cards.
var objArray = []; //This will be all of the users that we will pull from local storage.
var tablePlace = document.getElementById('table');
var scorePlace = document.getElementById('scores');
var aiButtonPlace = document.getElementById('againstComp');
var username = document.getElementById('username');
var sectionPlace = document.getElementById('tableSection');
var instructButtonPlace = document.getElementById('instruct');
var asidePlace = document.getElementById('aside');
var cardDown = 'images/Face_Down.png';
var clickCount = 1;
var userRows = 4;
var startTime;
var endTime;
var click1 = '';
var click2 = '';
var turn = 'user';
var aiCardMatch = '';
var userScore = 0;
var aiScore = 0;
var clickHolder = '';

// function to update username message
function updateUserHeader() {
  for(var i = 0; i < objArray.length; i++) {
    if(objArray[i].active) {
      var usernameKey = objArray[i].name;
    }
  }
  var message = 'Welcome ' + usernameKey.charAt(0).toUpperCase() + usernameKey.slice(1) + '!!';
  rend('h1', message, username);
}

// function to render to page
function rend(el, content, place, id, img, newClass){
  var tempEl = document.createElement(el);
  tempEl.textContent = content;
  tempEl.setAttribute('id', id);
  tempEl.setAttribute('src', img);
  tempEl.setAttribute('class', newClass)
  place.appendChild(tempEl);
}

// function to make row
function makeRow(id, columns){
  rend('tr', '', tablePlace, id);
  var newPlace = document.getElementById(id);
  for(var i = 0; i < columns; i++){
    rend('td', '', newPlace, i + ',' + id);
  }
}

// function to add a table.
function makeTable(rows){
  for(var i = rows - 1; i >= 0 ; i--){
    makeRow(i, rows);
  }
}

//create images_ophelia
var names = ['Alki_Beach','Bruce_Brandon','Chess_Player','Chief_Seattle','Elephant_Carwash','Elliot_Bay_Bookstore','Fremont_Troll','Great_Wheel','Hiram_Chittenden_Locks','International_District','Ivar_Seafood','Jazz_Alley','Microsoft','Mount_Rainer_National_Park','Museum_of_Flight','Original_Starbucks','Pacific_Science_Center','Pike_Place_Market','Pioneer_Square','Queen_Ann_Beerhall','Safeco_Field','Science_Center','Seahawks','Seattle_Aquarium','Seattle_Art_Museum','Sleepless_in_Seattle','Space_Needle','University_of_Washington','Washington_Park_Arboretum','Washington_State_Ferries','Waterfront','Woodland_Park_Zoo']

//create object_ophelia
function CardtoBeMatch(name, uniqueName) {
  this.name = name;
  this.imgLocation = 'images/'+name+'.png';
  this.faceUp = false;
  this.removed = false;
  this.location = '';
  this.hasBeenSeen = false;
  this.uniqueName = uniqueName;
  this.pauseTime = 0;
  cardArray.push(this);
}

//new instances_ophelia
function makeCards(rows){
  cardArray = [];
  for(var i = 0; i < rows * (rows / 2); i++) {
    new CardtoBeMatch(names[i], names[i] + '1');
    new CardtoBeMatch(names[i], names[i] + '2');
  }
}

// New Game button_ophelia
document.getElementById('NewGame').addEventListener('click', function(){
  userRows = parseInt(prompt('Enter your level: 2 or 4 or 6 or 8'));
  if(userRows != 2 && userRows != 4 && userRows != 6 && userRows != 8){
    return alert('Sorry, the answer must be either 2 or 4 or 6 or 8');
  }
  scorePlace.innerHTML = '';
  sectionPlace.innerHTML = '';
  asidePlace.innerHTML = '';
  clickCount = 1;
  tablePlace.addEventListener('click', tableHandler);
  tablePlace.removeEventListener('click', aiTableHandler);
  makeCards(userRows);
  imageRandom(userRows);
  renderImage();
  startTime = Date.now();
});
function timeCount(time){
  var total = time
  var minutes = Math.floor(total / 60000);
  var seconds = Math.floor((total % 60000) / 1000);
  var msg = minutes + ' Minutes, ' + seconds + ' Seconds';
  return msg;
}
// track game time_ophelia
var gameTime = function () {
  endTime = Date.now();
  return endTime - startTime;
}

// Save button_ophelia
document.getElementById('Save').addEventListener('click', function(){
  localStorage.removeItem('cardArrayPause');
  for(var i = 0; i < userRows*userRows; i++) {
    cardArray[i].pauseTime = gameTime();
  }
  localStorage.setItem('cardArrayPause',JSON.stringify(cardArray));
});

// Resume button_ophelia
document.getElementById('Resume').addEventListener('click', function(){
  cardArray = JSON.parse(localStorage.getItem('cardArrayPause'));
  sectionPlace.innerHTML = '';
  tablePlace.innerHTML = '';
  scorePlace.innerHTML = '';
  asidePlace.innerHTML = '';
  tablePlace.addEventListener('click', tableHandler);
  tablePlace.removeEventListener('click', aiTableHandler);
  renderImage();
  startTime = Date.now();
});


function renderImage(){
  tablePlace.innerHTML = '';
  makeTable(userRows);
  for(var i = 0; i < cardArray.length; i++){
    if(!cardArray[i].removed){
      if(!cardArray[i].faceUp){
        rend('img', '', document.getElementById(cardArray[i].location), cardArray[i].location, cardDown);
      } else {
        rend('img', '', document.getElementById(cardArray[i].location), cardArray[i].location, cardArray[i].imgLocation);
      }
    }
  }
}

//provide random index for array
function random(num) {
  var number = Math.floor(Math.random() * num);
  return number;
}

// function to assign new location to each card
function imageRandom(rows) {
  var arr = [];
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < rows; y++) {
      var temp = x + ',' + y;
      arr.push(temp);
    }
  }
  for (var b = 0; b < cardArray.length; b++) {
    var tempTwo = random(arr.length);
    cardArray[b].location = arr[tempTwo];
    arr.splice(tempTwo, 1);
  }
}

//do this at end of game.
function checkIfFinished(){
  var complete = true;
  for(var i = 0; i < cardArray.length; i++){
    if(!cardArray[i].removed){
      complete = false;
    }
  }
  if(complete){
    var time = timeCount(gameTime());
    var difficulty = 'score' + userRows;
    for(var j = 0; j < objArray.length; j++){
      if(objArray[j].active){
        objArray[j][difficulty] = time;
      }
    }
    localStorage.setItem('objArray', JSON.stringify(objArray))
    setTimeout(function(){renderScores()}, 3100);
  }
}

//render scores.
function renderScores(){
  tablePlace.innerHTML = '';
  var difficulty = 'score' + userRows;
  var msg = 'User Time Difficulty ' + userRows;
  rend('tr', '', scorePlace, 'head')
  rend('th', 'User', document.getElementById('head'), '', '', 'tableHead');
  rend('th', msg, document.getElementById('head'), '', '', 'tableHead');
  for(var i = 0; i < objArray.length; i++){
    var newId = i + 'scores'
    rend('tr', '', scorePlace, newId);
    rend('td', objArray[i].name, document.getElementById(newId), '', '', 'tableUser');
    rend('td', objArray[i][difficulty], document.getElementById(newId), '', '', 'tableTime');
  }
}

//playing the game.
function tableHandler(event){
  event.preventDefault();
  for(var g = 0; g < cardArray.length; g++){
    if(cardArray[g].location === event.target.id && cardArray[g].removed === true){
      return alert('Please click on a remaining card.');
    }
  }
  var eventId = event.target.id;
  for(var c = 0; c < cardArray.length; c++){
    if(eventId === cardArray[c].location){
      var clickId = cardArray[c].name;
    }
  }
  if(clickId === '' || clickId === 'table'){
    return alert('Please click on an a remaining card.');
  }
  if(clickCount === 1){
    for(var i = 0; i < cardArray.length; i++){
      if(cardArray[i].location === eventId){
        cardArray[i].faceUp = true;
        click1 = cardArray[i].name;
        renderImage();
      }
    }
  }
  if(clickCount === 2){
    for(var j = 0; j < cardArray.length; j++){
      if(cardArray[j].location === eventId){
        cardArray[j].faceUp = true;
        click2 = cardArray[j].name;
        renderImage();
      }
    }
    if(click1 === click2){
      for(var b = 0; b < cardArray.length; b++){
        if(cardArray[b].name === click1){
          cardArray[b].removed = true;
        }
      }
    }
    for(var e = 0; e < cardArray.length; e++){
      cardArray[e].faceUp = false;
    }
  }
  setTimeout(function(){renderImage()}, 3000);
  checkIfFinished();
  if(clickCount === 1){
    clickCount += 1;
  } else {
    clickCount = 1;
  }
}

//on ai button click
function aiButtonHandler(event){
  event.preventDefault();
  userRows = parseInt(prompt('Enter your level: 2 or 4 or 6 or 8'));
  if(userRows != 2 && userRows != 4 && userRows != 6 && userRows != 8){
    return alert('Sorry, the answer must be either 2 or 4 or 6 or 8');
  }
  scorePlace.innerHTML = '';
  sectionPlace.innerHTML = '';
  asidePlace.innerHTML = '';
  delayAsideRend(turn);
  tablePlace.removeEventListener('click',tableHandler);
  tablePlace.addEventListener('click', aiTableHandler);
  clickCount = 1;
  turn = 'user';
  userScore = 0;
  aiScore = 0;
  makeCards(userRows);
  imageRandom(userRows);
  renderImage();
}

//ai tablebuttonhandler.
function aiTableHandler(event){
  event.preventDefault();
  for(var g = 0; g < cardArray.length; g++){
    if(cardArray[g].location === event.target.id && cardArray[g].removed === true){
      return alert('Please click on a remaining card.');
    }
  }
  if(turn === 'user'){
    var eventId = event.target.id;
    for(var c = 0; c < cardArray.length; c++){
      if(eventId === cardArray[c].location){
        var clickId = cardArray[c].name;
        var clickLoc = cardArray[c].location;
        var clickUnique = cardArray[c].uniqueName;
      }
    }
    if(clickId === '' || clickId === 'table'){
      return alert('Please click on an a remaining card.');
    }
    if(clickCount === 1){
      for(var m = 0; m <cardArray.length; m++){
        if(clickLoc === cardArray[m].location){
          clickHolder = cardArray[m].uniqueName;
        }
      }
      for(var i = 0; i < cardArray.length; i++){
        if(cardArray[i].location === eventId){
          cardArray[i].faceUp = true;
          cardArray[i].hasBeenSeen = true;
          click1 = cardArray[i].name;
          renderImage();
        }
      }
    }
    if(clickCount === 2){
      if(clickHolder === clickUnique){
        return alert('Please click on a different card.')
      }
      tablePlace.removeEventListener('click', aiTableHandler);
      for(var j = 0; j < cardArray.length; j++){
        if(cardArray[j].location === eventId){
          cardArray[j].faceUp = true;
          cardArray[j].hasBeenSeen = true;
          click2 = cardArray[j].name;
          renderImage();
        }
      }
      if(click1 === click2){
        userScore += 1;
        for(var b = 0; b < cardArray.length; b++){
          if(cardArray[b].name === click1){
            cardArray[b].removed = true;
            cardArray[b].hasBeenSeen = false;
          }
        }
      }
      for(var e = 0; e < cardArray.length; e++){
        cardArray[e].faceUp = false;
      }
      clickHolder = '';
      setTimeout(function(){renderImage()}, 2000);
      setTimeout(function(){checkIfFinishedAI()}, 2300);
    }
  }
  if(clickCount === 1){
    clickCount = 2;
  } else {
    clickCount = 1;
    turn = 'comp';
  }
  var complete = true;
  for( i = 0; i < cardArray.length; i++){
    if(!cardArray[i].removed){
      complete = false;
    }
  }
  if(turn === 'comp' && !complete){
    setTimeout(function(){delayAsideRend(turn)}, 2000);
    setTimeout(function(){compTurn()}, 3000);
  }
}

//functions for ai handler only
function isAMatch(element){
  return element.uniqueName === aiCardMatch && element.hasBeenSeen === true;
}

function remove(match1, match2){
  cardArray[match1].removed = true;
  cardArray[match2].removed = true;
  cardArray[match1].hasBeenSeen = false;
  cardArray[match2].hasBeenSeen = false;
  aiScore += 1;
  renderImage();
}

function compTurn(){
  turn = 'user'
  var foundMatch = false;
  var match1 = 0;
  var match2 = 0;
  for(var i = 0; i < cardArray.length; i++){
    if(cardArray[i].hasBeenSeen){
      var hold = cardArray[i].uniqueName;
      if(hold.slice(-1) === '1'){
        hold = hold.slice(0, -1) + '2';
      } else {
        hold = hold.slice(0, -1) + '1';
      }
      aiCardMatch = hold;
      if(cardArray.find(isAMatch)){
        match1 = i;
        foundMatch = true;
        for(var u = 0; u < cardArray.length; u++){
          if(cardArray[u].uniqueName === aiCardMatch){
            match2 = u;
            break;
          }
        }
      }
    }
    if(foundMatch){
      break;
    }
  }
  if(random(1) === 0 && foundMatch){
    cardArray[match1].faceUp = true;
    cardArray[match2].faceUp = true;
    renderImage();
    setTimeout(function(){remove(match1, match2)}, 2000)
  } else {
    match1 = random(cardArray.length);
    while(cardArray[match1].removed){
      match1 = random(cardArray.length);
    }
    match2 = random(cardArray.length);
    while(match1 === match2 || cardArray[match2].removed){
      match2 = random(cardArray.length);
    }
    cardArray[match1].faceUp = true;
    cardArray[match2].faceUp = true;
    cardArray[match1].hasBeenSeen = true;
    cardArray[match2].hasBeenSeen = true;
    renderImage();
    cardArray[match1].faceUp = false;
    cardArray[match2].faceUp = false;
    if(cardArray[match1].name === cardArray[match2].name){
      cardArray[match1].removed = true;
      cardArray[match2].removed = true;
      cardArray[match1].hasBeenSeen = false;
      cardArray[match2].hasBeenSeen = false;
      aiScore += 1;
    }
    setTimeout(function(){renderImage()}, 2000);
  }
  setTimeout(function(){delayAsideRend(turn)}, 2100);
  setTimeout(function(){checkIfFinishedAI()}, 2100);
  setTimeout(function(){addEventListener()}, 2100);
}

function addEventListener(){
  tablePlace.addEventListener('click', aiTableHandler);
}

function checkIfFinishedAI(){
  var complete = true;
  for(var i = 0; i < cardArray.length; i++){
    if(!cardArray[i].removed){
      complete = false;
    }
  }
  if(complete){
    tablePlace.innerHTML = '';
    asidePlace.innerHTML = '';
    var msg = '';
    var endMsg = 'Final Score = Player, ' + userScore + ' Computer, ' + aiScore;
    if(userScore > aiScore){
      msg = 'Congratulations You Win. ' + endMsg;
    }
    if(aiScore > userScore){
      msg = 'The Computer Wins. ' + endMsg;
    }
    if(aiScore === userScore){
      msg = 'It\'s A Draw. ' + endMsg;
    }
    rend('h1', msg, sectionPlace, 'compVsAi');
  }
}

function delayAsideRend(turn){
  asidePlace.innerHTML = '';
  rend('p', 'It is the ' + turn + '\'s turn.', asidePlace, '', '', turn);
}

function renderInstructions(){
  sectionPlace.innerHTML = '';
  tablePlace.innerHTML = '';
  scorePlace.innerHTML = '';
  asidePlace.innerHTML = '';
  rend('ol', 'Solo Game Instructions', sectionPlace, 'soloInstruct');
  rend('li', 'Cards are laid out in a grid face down.', document.getElementById('soloInstruct'));
  rend('li', 'Click on a card to flip it over, then click on a second card and try to find a match.', document.getElementById('soloInstruct'));
  rend('li', 'The game continues in this fashion until all the cards are played.', document.getElementById('soloInstruct'));
  rend('ol', 'AI Game Instructions', sectionPlace, 'aiInstruct');
  rend('li', 'AI Game is played like solo game except after your turn there is a computer turn.', document.getElementById('aiInstruct'));
  rend('li', 'Try and get the most matches to win the game.', document.getElementById('aiInstruct'));
  rend('li', 'Please wait for the computer to finish before clicking the board again.', document.getElementById('aiInstruct'));
}

//function call

// Part of localStorage
if(localStorage.objArray){
  objArray = JSON.parse(localStorage.objArray);
}
updateUserHeader();
renderInstructions();

// tablePlace.addEventListener('click', tableHandler);
aiButtonPlace.addEventListener('click', aiButtonHandler);
instructButtonPlace.addEventListener('click', renderInstructions);
