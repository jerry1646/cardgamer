/*jshint esversion : 6 */
const managers = require('./managers.js');

module.exports = function(io){
  return {

    games: {},

    generateGameId: function() {
      return Math.random().toString(36).substring(3,16) + +new Date;
    },

    createGame: function(player1, player2, gameType) {
      try {
        let gameId = this.generateGameId();
        this.games[gameId] = new Game(player, player2, gameType);
        return 1;
      }
      catch(err) {
        throw err;
      }
    },

    getGame: function() {
      let thisGame = this.games[gameId];
      this.games[gameId] = null;
      return thisGame;
    },

    deleteByUID: function(uid) {
      let player = this.findByUID(uid);
      this.rmvFromGame(player);
    },

    findByUID: function(uid) {
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
