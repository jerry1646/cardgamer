/*jshint esversion : 6 */
module.exports = function(io){
  return {
    generateGameId: function() {
      var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;
    },

    queue: [],

    addToQueue: function(player) {
      try {
        this.queue.push(player);
        return 0;
      }
      catch(err) {
        throw err;
      }
    },

    rmvFromQueue: function(player) {
      return this.queue.splice(this.queue.indexOf(player), 1);
    },

    shiftQueue: function() {
      return this.queue.shift();
    },

    deleteByUID: function(uid) {
      let player = this.findByUID(uid);
      this.rmvFromQueue(player);
    },

    findByUID: function(uid) {
      if(this.queue.length) {
        let correct_player = null;
        this.queue.forEach( function(player, index) {
          if(player.uid == uid) {
            correct_player = player;
          }
        });
        return correct_player;
      } else {
        return null;
      }
    },

    findBySID: function(sid) {
      if(this.queue.length) {
        let correct_player = null;
        this.queue.forEach( function(player, index) {
          if(player.socketId == sid) {
            correct_player = player;
          }
        });
        return correct_player;
      } else {
        return null;
      }
    },

    updateSocket: function(uid, socketId) {
      let player = this.findByUID(uid);
      try {
        player.socketId = socketId;
      } catch(err) {
        throw err;
      }
    },

    // addplayerToGame: function (gameId, clientId) {
    //   game.addPlayer(clientId);
    // },

    sendMessage: function (uid, message) {
      let player = this.findByUID(uid);
      try {
        io.to(`${player.socketId}`).emit('message', message);
      } catch(err) {
        throw err;
      }
    },

    // sendGameState: (uid, data) => {
    //   let player = this.findByUID(uid);
    //   try {
    //     io.to(`${player.socketId}`).emit('game-state', data);
    //   } catch(err) {
    //     throw err;
    //   }
    // },

    printState: function () {
      if(this.queue.length) {
        console.log(`-->Current queue: ${this.queue.length} users`);
        this.queue.forEach( function(player, index) {
          console.log(player);
        });
      } else {
        console.log("Empty queue.");
      }
    }
  };
};
