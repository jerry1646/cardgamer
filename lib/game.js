let warEngine = require('./game_engines/war.js');


let test_info  = {                      //test
  uid1: 123,
  uid2: 334,
  gameId: 654321
}


let warManager = {
  gameVar: {
    deckSize: 52,
    // deckSize: 24,
    // deck: [],
    state: 'pregame', // 'pregame', 'ingame', 'endgame'
    turn: 0,
    round: {},
    // points:[],
    roundWinner:"",
    gameWinner: ""
  },
  gameEngine: warEngine
};



function Player(uid){
  this.uid = uid;
  this.cards = [];
  this.active = false;
  this.points = 0;
}

function Game(info, gameManager){
  this.timeStamp = Date.now();
  this.players = [new Player(info.uid1), new Player(info.uid2)];
  this.id = info.gameId;
  this.gameVar = gameManager.gameVar;
  this.controller = gameManager.gameEngine;

  this.init = function(request){
    if (request.gameId == this.id && request.title == "init"){
      this.controller.init(this.gameVar, this.players);
      // this.players = result.players;
      // console.log(this.gameVar);
      // console.log(this.players);
    } else{
      throw ("This request doesn't belong here");
    }
  }

  this.draw = function(request){
    if (request.gameId == this.id && request.title == "draw"){
      this.controller.draw(request, this.gameVar, this.players);
    } else{
      throw ("This request doesn't belong here");
    }
  }
}

// Game.prototype.draw = function(request){
//   if (request.gameId == this.id && request.title == "draw"){
//     this.controller.drawcard(request).bind(this);
//   } else{
//     throw ("This request doesn't belong here");
//   }
// }

let game1 = new Game(test_info, warManager); //test

var requestDraw1 = {
  title: "draw",
  gameId: 654321,
  // gameId: 123, // wrongid for testing
  uid: 123
};
var requestDraw2 = {
  title: "draw",
  gameId: 654321,
  // gameId: 123, // wrongid for testing
  uid: 334
};
var requestInit = {
  title: "init",
  gameId: 654321,
  // gameId: 123, // wrongid for testing
  uid: 123
}

game1.init(requestInit);
// console.log(game1.players);
// console.log(game1.gameVar);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
game1.draw(requestDraw1);
game1.draw(requestDraw2);
console.log(game1.players);




// console.log(game1.players);





