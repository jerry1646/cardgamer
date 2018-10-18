let warEngine = require('./game_engines/war.js');

let test_info  = {                      //test
  players: [{uid: 123, socketId: 'asd18e12he', connected: true}, {uid: 334, socketId: 'aisldjiada', connected: true}],
  gameId: 654321
  // uid1: 123,
  // uid2: 334,
  // gameId: 654321
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



  function Player(playerObj){
    this.ioConfig = playerObj;
    this.cards = [];
    this.active = false;
    this.points = 0;
  }

module.exports = function Game(info, gameManager, io){
    this.timeStamp = Date.now();
    this.players = [new Player(info.players[0]), new Player(info.players[1])];
    this.id = info.gameId;
    this.gameVar = gameManager.gameVar;
    this.gameVar.gameId = info.gameId;
    this.controller = gameManager.gameEngine;

    this.init = function(){
      console.log(this.players[0])
      if (this.players[0].ioConfig.connected && this.players[0].ioConfig.connected){
        this.controller.init(this.gameVar, this.players, io);
        // this.players = result.players;
        // console.log(this.gameVar);
        // console.log(this.players);
      } else{

      }
    };

    this.draw = function(request){
      if (request.gameId == this.id){
        this.controller.draw(request, this.gameVar, this.players);
      } else{
        throw ("This request doesn't belong here");
      }

      // check game state to see if write game record to db
    }
  }

// ---------------Test Code-----------------------

// let game1 = new Game(test_info, warManager); //test

// var requestDraw1 = {
//   title: "draw",
//   gameId: 654321,
//   // gameId: 123, // wrongid for testing
//   uid: 123
// };
// var requestDraw2 = {
//   title: "draw",
//   gameId: 654321,
//   // gameId: 123, // wrongid for testing
//   uid: 334
// };
// var requestInit = {
//   title: "init",
//   gameId: 654321,
//   // gameId: 123, // wrongid for testing
//   uid: 123
// }

// game1.init(requestInit);
// // console.log(game1.players);
// // console.log(game1.gameVar);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// game1.draw(requestDraw1);
// game1.draw(requestDraw2);
// console.log(game1.players);




// console.log(game1.players);



