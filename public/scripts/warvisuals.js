//CREATE RANDOM USER ID ONCE PER SESSION (REGENERATED ON REFRESH BUT NOT ON SOCKET DROP/RECONNECT)
var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;
var gameId, players, opponentUID;
const cardRef = {
  1:'01H',
  2:'02H',
  3:'03H',
  4:'04H',
  5:'05H',
  6:'06H',
  7:'07H',
  8:'08H',
  9:'09H',
  10:'10H',
  11:'11H',
  12:'12H',
  13:'13H',
  14:'01S',
  15:'02S',
  16:'03S',
  17:'04S',
  18:'05S',
  19:'06S',
  20:'07S',
  21:'08S',
  22:'09S',
  23:'10S',
  24:'11S',
  25:'12S',
  26:'13S',
  27:'01C',
  28:'02C',
  29:'03C',
  30:'04C',
  31:'05C',
  32:'06C',
  33:'07C',
  34:'08C',
  35:'09C',
  36:'10C',
  37:'11C',
  38:'12C',
  39:'13C',
  40:'01D',
  41:'02D',
  42:'03D',
  43:'04D',
  44:'05D',
  45:'06D',
  46:'07D',
  47:'08D',
  48:'09D',
  49:'10D',
  50:'11D',
  51:'12D',
  52:'13D',
  53:'j01',
  54:'j02',
};

// const message = {
// // turn: 1,
// // cards: { id1: 15 },
// // roundWinner: '',
// // gameWinner: '',
// // players:
// // { id1: { score: 1, playable: false },
// //   id2: { score: 0, playable: true } }
// };

//INITIATE SOCKET CONNECTION
var socket = io.connect('http://localhost:8080');


//LISTENER FOR SOCKET

//CONNECT SOCKET TO SERVER
socket.on('connect', () => {
  console.log('Successfully connected!');

});

//message both peopel connected and server ready for game
socket.on('ready', (message) => {
  gameId = message.gameId;
  players = message.players;
  opponentUID = (players.indexOf(randomlyGeneratedUID) == 1)? players[0]: players[1];
  console.log('My opponent is: ',opponentUID);
  console.log(gameId, "this is gameid")
  gameconnect()
  console.log('p2 connected and game loaded');

});

socket.on('update', (message) => {
  let mycard = cardRef[message.cards[randomlyGeneratedUID]];
  let opponentcard = cardRef[message.cards[opponentUID]];
  p1draw(mycard);
  p2draw(opponentcard);
  setScore(message);
  cardmove(message);
  gameEndCheck(message);
  console.log(message);
});

//end of game
socket.on('end-game', () => {
  data = {
    // gameId:
    uid: randomlyGeneratedUID
  }
  socket.emit('end-game', data)
  console.log('game ended MISSING gameId');

});

// FUNCTIONS -------------------------------------------------------------------------
//initial game load and waiting for other player
function gameload(){
    //show game container and end button
    if ($('.wargamecontainer').is(":hidden")) {
      $('.wargamecontainer').slideToggle();}
      $('.endwargame').show();

  let $waitingmessage = $("<h2>").text("WAITING FOR A FRIEND");
  let $gametitle = $("<h2>").addClass('title').text("Game of War");
  $('.wargamecontainer').append($waitingmessage);
  $('.gametitlesection').prepend($gametitle)

}

//player 2 disconnected
function gamedisconnect(){
    $('.wargamecontainer').empty();

let $disconnectmessage = $("<h2>").text("FRIEND LOST");
$('.wargamecontainer').append($disconnectmessage);

}


//loads game of war code
function gameconnect(){
  $('.wargamecontainer').empty();
    //add game of war visuals to page
    let $p1cardcontainer = $("<div>").attr('id', 'cardcontainer');
    let $p2cardcontainer = $("<div>").attr('id', 'cardcontainer');
    let $p1hand = $("<div>").attr('id', 'p1hand');
    let $p2hand = $("<div>").attr('id', 'p2hand');
    let $p2card = $("<img>").attr('src', "/images/cards/purple_back.png").attr('id', 'p2card');;
    let $p1card = $('<button>').attr('id', 'p1card').attr('type', 'button');;
    let $p1cardimg = $("<img>").attr('src', "/images/cards/red_back.png").attr('id', 'p1cardimg');
    let $playfield = $("<section>").attr('id', 'middlefield');
    let $p2cardbox = $("<div>").attr('id', 'p2carddrawnbox');
    let $p1cardbox = $("<div>").attr('id', 'p1carddrawnbox');
    $p1card.append($p1cardimg)
    $p1hand.append($p1card, $p1cardbox);
    $p2hand.append($p2card, $p2cardbox);
    $p1cardcontainer.append($p1hand)
    $p2cardcontainer.append($p2hand)
    $('.wargamecontainer').append($p2cardcontainer, $playfield, $p1cardcontainer);
}

//p1draw
function p1draw(param){
  if (param && !document.getElementById("#p1carddrawn")){
    p1drawnCard = `/images/cards/${param}.png`;
    let $p1card = $("<img>").attr('src', p1drawnCard).attr('id', 'p1carddrawn');;
    $('#p1carddrawnbox').empty();
    $('#p1carddrawnbox').append($p1card)
    // $('#p1carddrawnbox').append(`<img src = '${p1drawnCard}' id = 'p1carddrawn'>`)
    setTimeout(function () {
      // $("#p1carddrawn").animate({left: '+=75px'});
    }, 500);
  }
}

//p2draw
function p2draw(param){
  if (param && !document.getElementById("#p2carddrawn")){
    p2drawnCard = `/images/cards/${param}.png`;
    let $p2card = $("<img>").attr('src', p2drawnCard).attr('id', 'p2carddrawn');;
    $('#p2carddrawnbox').empty();
    $('#p2carddrawnbox').append($p2card)
    // $('#p2carddrawnbox').append(`<img src = '${p2drawnCard}' id = 'p2carddrawn'>`);
    setTimeout(function () {
      // $("#p2carddrawn").animate({right: '+=75px'});
    }, 500);
  }
}

//card movement
function cardmove(param) {
  setTimeout(function () {
    if (param.roundWinner) {
      $("#p2carddrawn").animate({right: '+=70px', top: '+=220px'});
      $("#p1carddrawn").animate({left: '+=70px', bottom: '+=220px'});
      setTimeout(function () {
          $('#p1carddrawnbox').empty();
          $('#p2carddrawnbox').empty();
          console.log("cards cleared")
        }, 3000);
    }
  }, 500);
}

//display player scores
function setScore(param) {
  $('#my-score').text(param.players[randomlyGeneratedUID].score);
  $('#op-score').text(param.players[opponentUID].score);
  $('#turn').text(param.turn);
}

// display winner message
function displaygameWinner(param) {
  if (param.gameWinner == randomlyGeneratedUID){
    alert("YOU WIN!!")
  } else {
    alert("YOU'RE A LOSER ;)")
  }
}

//game end check and actions
function gameEndCheck(param){
  if (param.gameWinner) {
    if ($('.wargamecontainer').is(":visible")) {
      $('.wargamecontainer').empty();
      $('.gametitlesection').empty();
      $('.wargamecontainer').slideToggle();
      $('.newwargame').show();
      $('.endwargame').hide();
      displaygameWinner(param);
      console.log("send end game")
}
}
}


// EVENTS-------------------------------------------------------------------------

//on page load
$(document).ready(function() {
  //hide and show certain items
  if ($('.wargamecontainer').is(":visible")) {
    $('.endwargame').hide();
    $('.wargamecontainer').hide();}

//send player ready and load gamebox
$(".newwargame").on("click", function(event) {
  $('.newwargame').hide();
  gameload();
  //"JOIN GAME ACTION"
  //Provide server with userId upon "JOIN GAME ACTION"
  //ASSIGN GAMETYPE FROM DROP DOWN LIST OF GAMES
  var registration = {
    uid: randomlyGeneratedUID,
    gameType: "war"
  };
  socket.emit('register', registration);
  console.log(randomlyGeneratedUID);
  console.log("newwargame started game init");
  })

//2nd player disconnect
$(".p2disconnect").on("click", function(event) {
  gamedisconnect();
  console.log("p2disconnected");
});


//  current client drawing card
$("#p1card").on("click", function(event) {
  event.preventDefault();
  console.log("p1 draw card");
  p1draw();
});

//when player 1 plays card
$(".p1draw").on("click", function(event) {
  var data = {
    gameId: gameId,
    uid: randomlyGeneratedUID
  }
  socket.emit('draw', data);
});


//disconnect and clear game
$(".endwargame").on("click", function(event) {
  gameend();
  console.log("newwargame ended");
  });
});



