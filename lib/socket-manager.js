/*jshint esversion : 6 */

//MODULE HANDLES ALL INCOMING CONNECTIONS, MAINTAINING A CONSISTENT COLLECTION OF USER-ID : SOCKET-ID PAIRS TO BE REFERENCED BY QUEUE MANAGERS, GAME MANAGERS AND GAMES

module.exports = function(io){
  return {

    playerList: [],

    addToList: function(player) {
      try {
        this.playerList.push(player);
        return 0;
      }
      catch(err) {
        throw err;
      }
    },

    rmvFromList: function(player) {
      return this.playerList.splice(this.playerList.indexOf(player), 1);
    },

    shiftList: function() {
      return this.playerList.shift();
    },

    deleteByUID: function(uid) {
      let player = this.findByUID(uid);
      this.rmvFromList(player);
    },

    findByUID: function(uid) {
      if(this.playerList.length) {
        let correct_player = null;
        this.playerList.forEach( function(player, index) {
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
      if(this.playerList.length) {
        let correct_player = null;
        this.playerList.forEach( function(player, index) {
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

    sendMessage: function (uid, message) {
      let player = this.findByUID(uid);
      try {
        io.to(`${player.socketId}`).emit('message', message);
      } catch(err) {
        throw err;
      }
    },

    printState: function () {
      if(this.playerList.length) {
        console.log(`-->Current playerList: ${this.playerList.length} users`);
        this.playerList.forEach( function(player, index) {
          console.log(player);
        });
      } else {
        console.log("Empty playerList.");
      }
    }
  };
};
