/*jshint esversion : 6 */

module.exports = function(io, cards, message){
  return {
  GameVar: function(){
    this.deckSize= 52;
    this.state= 'pregame'; // 'pregame', 'ingame', 'endgame'
    this.turn= 0;
    this.round= {};
    this.roundWinner="";
    this.gameWinner= "";
  },

  gameEngine:{
    packMessage: function(gameVar, players){
      message.turn = gameVar.turn;
      message.cards = gameVar.round;
      message.roundWinner = gameVar.roundWinner;
      message.gameWinner = gameVar.gameWinner;
      message.players = {};
      for (let i of [0,1]){
        message.players[players[i].ioConfig.uid] = {
        score: players[i].points,
        playable: players[i].active
        };
      }
    },

    init: function(gameVar, players){

      function createDeck(){
        let deck = [];
        for (let i = 1; i <= gameVar.deckSize; i++){
          deck.push(i);
        }
        return deck;
      }

      function shuffleDeck(deck){
        let ctr = deck.length, temp, index;
        while (ctr > 0){
          index = Math.floor(Math.random() * ctr);
          ctr--;
          temp = deck[ctr];
          deck[ctr] = deck[index];
          deck[index] = temp;
        }
        return deck;
      }

      function dealCards(deck){
        let deckSize = gameVar.deckSize;
        let handSize = deckSize / 2;
        players[0].cards = deck.slice(0,handSize); // Hard coded for 2 players
        players[1].cards = deck.slice(handSize);
      }

      // ----- Execution -------

      dealCards(shuffleDeck(createDeck()));

      gameVar.state = 'ingame';

      for (let i of [0,1]){
        players[i].active = true;
        io.to(`${players[i].ioConfig.socketId}`).emit('ready', gameVar.gameId);
      }
    },

    draw: function(request, gameVar, players){
      function drawCard(player){
        return player.cards.pop();
      }

      function cardParser(id){
        console.log("----> WAR.JS CARD PARSER: id - ", id);
        return Number(cards[id].slice(0,2));
      }

      function checkWin(cards){
        let value1 = cardParser(cards[players[0].ioConfig.uid]);
        let value2 = cardParser(cards[players[1].ioConfig.uid]);
        if (value1 > value2){
          gameVar.roundWinner = players[0].ioConfig.uid;
          players[0].points++;
        } else if (value1 == value2){
          gameVar.roundWinner = "draw";
        } else {
          gameVar.roundWinner = players[1].ioConfig.uid;
          players[1].points++;
        }
        players[0].active = true;
        players[1].active = true;
      }


      // -------- Execution --------------

      let senderId = request.uid;
      let cPlayer = (senderId == players[0].ioConfig.uid)?players[0]:players[1];
      if (cPlayer.active == true){
        gameVar.round[cPlayer.ioConfig.uid] = drawCard(cPlayer);
        gameVar.roundWinner = "";
        cPlayer.active = false;

        if (Object.keys(gameVar.round).length == 2){
          checkWin(gameVar.round);
          gameVar.turn ++;

          if (cPlayer.cards.length == 0) {
            this.endGame(gameVar, players);
          }

          this.packMessage(gameVar,players);
          // console.log(message);

          gameVar.round = {};

        } else{
          this.packMessage(gameVar,players);
        }

        console.log("-->WAR.JS MESSAGE", message);
        io.to(`${players[0].ioConfig.socketId}`).emit('update', message);
        io.to(`${players[1].ioConfig.socketId}`).emit('update', message);

      }
    },

    endGame: function(gameVar, players){
      let point1 = players[0].points,
          point2 = players[1].points;
      if (point1 > point2){
        gameVar.gameWinner = players[0].ioConfig.uid;
      } else if(point1 == point2){
        gameVar.gameWinner = 'draw';
      } else{
        gameVar.gameWinner = players[1].ioConfig.uid;
      }
      players[0].active = false;
      players[1].active = false;

      gameVar.state = 'endgame';
    }
  }
  }
}
