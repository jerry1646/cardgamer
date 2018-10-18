//CREATE RANDOM USER ID ONCE PER SESSION (REGENERATED ON REFRESH BUT NOT ON SOCKET DROP/RECONNECT)
var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;

//INITIATE SOCKET CONNECTION
var socket = io.connect('http://localhost:8080');

//CONNECT SOCKET TO SERVER
socket.on('connect', () => {
  console.log('Successfully connected!');

});

//"JOIN GAME ACTION"
//Provide server with userId upon "JOIN GAME ACTION"
//ASSIGN GAMETYPE FROM DROP DOWN LIST OF GAMES
var registration = {
  uid: randomlyGeneratedUID,
  gameType: gameType
};
socket.emit('register', registration);
console.log(randomlyGeneratedUID);



socket.on('message', function (data) {
  console.log(data);
});
