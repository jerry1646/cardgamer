let cards = {
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


const message = {
// turn: 1,
// cards: { id1: 15 },
// roundWinner: '',
// gameWinner: '',
// players:
// { id1: { score: 1, playable: false },
//   id2: { score: 0, playable: true } }
};

module.exports = function(io){
  return {
    packMessage: function(gameVar, players){
      message.turn = gameVar.turn;
      message.cards = gameVar.round;
      message.roundWinner = gameVar.roundWinner;
      message.gameWinner = gameVar.gameWinner;
      message.players = {};
      message.players[players[0].ioConfig.uid] = {
        score: players[0].points,
        playable: players[0].active
      };
      message.players[players[1].ioConfig.uid] = {
        score: players[1].points,
        playable: players[1].active
      };
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

      dealCards(shuffleDeck(createDeck()));
      players[0].active = true;
      players[1].active = true;

      gameVar.state = 'ingame';

      //emit ready message here
      io.to(`${players[0].ioConfig.socketId}`).emit('ready', gameVar.gameId);
      io.to(`${players[1].ioConfig.socketId}`).emit('ready', gameVar.gameId);
    },

    draw: function(request, gameVar, players){
      console.log("--> WAR.JS Player status", players[0].active, players[1].active)
      function drawCard(player){
        return player.cards.pop();
      }

      function cardParser(id){
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


      let senderId = request.uid;
      let cPlayer = (senderId == players[0].ioConfig.uid)?players[0]:players[1];
      if (cPlayer.active == true){
        console.log("--> WAR.JS Player can play")
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
          // console.log(message);
        }
        console.log("-->WAR.JS MESSAGE", message)
        io.to(`${players[0].ioConfig.socketId}`).emit('update', message);
        io.to(`${players[1].ioConfig.socketId}`).emit('update', message);

        //broadcast to both players
      }

    },

    endGame: function(gameVar, players){
      let point1 = players[0].points;
      let point2 = players[1].points;
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
