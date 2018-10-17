
module.exports = function(io){
  return {

    queue: [],

    addToQueue: function (client) {
      try {
        this.queue.push(client);
        return 0;
      }
      catch(err) {
        throw err;
      }
    },

    rmvFromQueue: function (client) {
      return this.queue.splice(this.queue.indexOf(client), 1);
    },

    // addClientToGame: function (gameId, clientId) {
    //   game.addPlayer(clientId);
    // },

    sendMessage: (clientId, message) => {
      io.to(`${clientId}`).emit('message', message);
    },

    sendGameState: (clientId, data) => {
      io.to(`${clientId}`).emit('game-state', data);
    },

    printState: function () {
      console.log(`Current queue: ${this.queue}`);
    }
  };
};
