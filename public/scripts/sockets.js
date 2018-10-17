
var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;

var socket = io.connect('http://localhost:8080');

socket.on('connect', () => {
  console.log('Successfully connected!');

  //Provide server with userId
  socket.emit('register', randomlyGeneratedUID);
  console.log(randomlyGeneratedUID);

});

socket.on('message', function (data) {
  console.log(data);
});
