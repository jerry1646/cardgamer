/*jshint esversion : 6 */
const Game = require('./game.js');



module.exports = function(io){

  let warTemplate = require('./game_engines/gameTemplate.js')(io).war;
  // warTemplate.gameEngine(io);
  // let warEngine = require('./game_engines/war.js')(io);

  // let warTemplate = {
  //   gameVar: {
  //     deckSize: 52,
  //     // deckSize: 24,
  //     // deck: [],
  //     state: 'pregame', // 'pregame', 'ingame', 'endgame'
  //     turn: 0,
  //     round: {},
  //     // points:[],
  //     roundWinner:"",
  //     gameWinner: ""
  //   },
  //   gameEngine: warEngine
  // };


  return {

    games: {},

    generateGameId: function() {
      return Math.random().toString(36).substring(3,16) + +new Date;
    },

    createGame: function(players, gameType, mgmt) {
      try {
        let gameId = this.generateGameId();
        if(!this.games[gameId]) {
          info = {
            players: players,
            gameId: gameId
          };
          this.games[gameId] = new Game(info, warTemplate, io);
          this.games[gameId].init();
          return gameId;
        } else throw "Error: GameId already exists...";
      }
      catch(err) {
        throw err;
      }
    },

    // findGameId: function(uid) {
    //   for(let game in games) {
    //     if
    //   }
    // },

    // getGame: function() {
    //   let thisGame = this.games[gameId];
    //   this.games[gameId] = null;
    //   return thisGame;
    // },

    endGame: function(gameId) {
      this.games[gameId] = null;
    },

    // deleteByUID: function(uid) {
    //   let player = this.findByUID(uid);
    //   this.rmvFromGame(player);
    // },

    // findByUID: function(uid) {
    // },

    sendMsg: function (msg, data) {
      this.games[data.gameId][msg](data);
    },

    printState: function () {
      if(this.games.length) {
        console.log(`-->Games Running: ${this.games.length}`);
        this.games.forEach( function(game, index) {
          console.log(game);
        });
      } else {
        console.log("No games running.");
      }
    }
  };
};
