function Player(playerObj){
  this.ioConfig = playerObj;
  this.cards = [];
  this.active = false;
  this.points = 0;
}

module.exports = function Game(info, gameTemplate, io){
  this.timeStamp = Date.now();
  this.players = [new Player(info.players[0]), new Player(info.players[1])];
  this.id = info.gameId;
  this.gameVar = new gameTemplate.GameVar();
  this.gameVar.gameId = info.gameId;
  this.controller = gameTemplate.gameEngine;

  this.init = function(){
    if (this.players[0].ioConfig.connected && this.players[0].ioConfig.connected){
      this.controller.init(this.gameVar, this.players, io);
    } else{
      console.log("---> GAME INIT: A PLAYER IS DISCONNECTED");
    }
  };

  this.draw = function(request){
    console.log("-->DRAW FUNCTION: gameId-",request.gameId);
    if (request.gameId == this.id){
      this.controller.draw(request, this.gameVar, this.players);
    } else{
      throw ("This request doesn't belong here");
    }
  };
};
