
module.exports = function(io){
  return {

    queue: [],

    addToQueue: function (player) {
      try {
        this.queue.push(player);
        return 0;
      }
      catch(err) {
        throw err;
      }
    },

    rmvFromQueue: function (player) {
      return this.queue.splice(this.queue.indexOf(player), 1);
    },

    findByUID: function(uid) {
      let correct_player = null
      this.queue.forEach( function(player, index) {
        if(player.uid == uid) {
          correct_player = player;
          break;
        }
      });
      return correct_player;
    },

    updateSocket: function(uid, socketId) {
      let player = this.findByUID(uid);
      player.socketId = socketId;
    },

    // addplayerToGame: function (gameId, clientId) {
    //   game.addPlayer(clientId);
    // },

    sendMessage: (uid, message) => {
      let socketId = this.findByUID(uid).socketId;
      io.to(`${socketId}`).emit('message', message);
    },

    sendGameState: (uid, data) => {
      let socketId = this.findByUID(uid).socketId;
      io.to(`${socketId}`).emit('game-state', data);
    },

    printState: function () {
      console.log(`Current queue: ${this.queue}`);
    }
  };
};
