"use-strict";
/* jshint esversion : 6 */


if(process.env.NODE_ENV === 'production') {
  require('dotenv').config();
}

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.NODE_ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const flash         = require('connect-flash');
const cookieParser  = require('cookie-parser');

const cookieSession = require('cookie-session');
const bcrypt        = require('bcrypt');

//ADD SOCKET OVERHEAD
const http          = require('http').Server(app);

//DATABASE CONFIGURATION
const knexConfig    = require("./knexfile");
const db            = require("knex")(knexConfig[ENV]);
const users         = require("./models/user.js")(db);
const games         = require("./models/games.js")(db);

//LOGGING SOFTWARE
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes   = require("./routes/users");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(morgan('dev'));

// // Log knex SQL queries to STDOUT as well
app.use(knexLogger(db));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: ["jbkbjkk hkuydhtdhgfhg"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//CONNECT-FLASH MIDDLEWARE FOR NOTIFICATIONS
  app.use(flash());

//USER AUTHENTICATION MIDDLEWARE
app.use((req, res, next) => {
  const username = req.session.username;
  const anonUser = {
    id: -1,
    username: '',
    email: 'anon@anon.com',
    password: 'anonpassword'
  };

  if(username) {

    return users
      .findByUsername(username)
      .then(([user]) => {
        req.currentUser = user;
      })
      .catch(() => {
        req.currentUser = anonUser;
      })
      .then(next, next);
  }

  req.currentUser = anonUser;
  next();
});

// Mount all resource routes
app.use("/api/users", usersRoutes(db));

// Home page
app.get("/", (req, res) => {
  if (req.currentUser.id != -1){
  // find user's game record
    let result = games.findGames(req.currentUser.username)
    .then((rows) => {
      let templateVars = {
        user: req.currentUser, gameHistory: rows, info: req.flash('info')
      };
      console.log(templateVars.gameHistory);
      res.render("welcome", templateVars);
      // res.send(templateVars);
    })
    .catch((err) => console.error(err));
  } else{
    res.render("welcome", {user: req.currentUser, info: req.flash('info')});
  }
});

app.get("/login", (req, res) => {
  res.render("login", {user: req.currentUser, info: req.flash('info')});
});


app.get("/register", (req, res) => {
  res.render("register", {user: req.currentUser, info: req.flash('info') });
});

app.get("/leaderboard", (req, res) => {
  // load all user data
  users.findAllUser()
    .then((rows) => {
      console.log(rows.rows);
      let results = [];
      for (let row of rows.rows){
        let username = row.username;
        let winCount = row.win;
        let loseCount = row.lose;
        let score = winCount*10 - loseCount*5;

        let templateVars = {
          username, winCount, loseCount, score
        };
        results.push(templateVars);
      }

      // result is [{player1data}, {}, ...]
      console.log(results);
      res.render("leaderboard", {results, user: req.currentUser, info: req.flash('info') });
    })
    .catch((err) => console.error(err));
})

//War game page
app.get("/wargame", (req, res) => {
  if (req.currentUser.id == -1){
    // Send error message: NEED LOG IN
    res.redirect('/login');
  } else{
    res.render("wargame", {user: req.currentUser, info: req.flash('info')});
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if(username && password) {
    users
    .login(username, password)
    .then(user => {
      req.session.username = username;
      // req.flash('info', `signed in as ${req.session.username}`)
      res.redirect("/");
    })
    .catch(e => {
      console.log('Failed login')
      console.error(e);
      req.flash('info', `Username or password is incorrect`)
      res.redirect("/login");
    });
  } else {
    console.log("Empty username and password");
    req.flash('info', `Any fields cannot be empty`)
    res.redirect("/login");
  }

});

app.post("/register", (req, res) => {

  const { username, email, password, password_confirm } = req.body;

  if(username && email && password) {
    users.register(username, email, password)

      .then(() => {
        req.session.username = username;
        res.redirect("/");
      })
      .catch(e => {
        console.log('Username or Email already taken!');
        console.error(e);
        res.redirect("/register");
      });
  } else {
    console.log("Empty Fields!");
    req.flash('info', `Any fields cannot be empty`)
    res.redirect("/register");
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});

const server = app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


//SOCKETS
//##################################################
var io = require('socket.io').listen(server);

let socketManager = require('./lib/socket-manager')(io);
let queueManager = require('./lib/queue-manager')(io);
let gameManager = require('./lib/game-manager')(io);

io.on('connection', function(socket) {


  // Get username from cookieSession middleware
  let cookie_string = socket.request.headers.cookie;
  let req = { headers : {cookie : cookie_string} }
  cookieSession({ keys: ["jbkbjkk hkuydhtdhgfhg"] })(req, {}, function(){})
  let username = req.session.username;


  let playerStatus = {/* CONNECTION DROP HANDLER */};
  console.log(`Socket: ${socket.id} connected...`);

  //SOCKET DISCONNECT HANDLING
  socket.on('disconnect', function() {
    console.log("PLAYER DISCONNECTED ---- SOCKET ID: ", socket.id);

    //Handles Disconnection but bot fully tested and not implemented in production version
    /*playerStatus.disconnected = true;
    setTimeout(function () {
      if (playerStatus.disconnected) {
        //SET PLAYER TO DISCONNECTED FOR ALL OTHER OBJECTS IN CODE
        let player = socketManager.findBySID(socket.id);
        console.log(`-->DISCONNECTED: ${player.uid} - ${socket.id}`);
        player.connected = false;
        //REMOVE PLAYER REFERENCE FROM SOCKET MANAGER
        socketManager.deleteByUID(player.uid);
        socketManager.printState();
      }
    }, 10000);*/
  });

  socket.on('register', function (data) {
    if(data) {

      let uid = data.uid;
      let gameType = data.gameType;
      //gametyp in place in order to allow future extension into multiple gametypes

      //CHECK IF THE INCOMING CONNECTION IS FROM A RECONNECT
      if (socketManager.findByUID(uid)) {
        playerStatus.disconnected = false;

        //IF RECONNECT UPDATE THE SOCKET ID
        console.log(`-->RECONNECTED: ${uid} - ${socket.id}`);
        socketManager.updateSocket(uid, socket.id);

      } else {

        //REGISTER A NEW USER
        console.log("-->REGISTRATION:","-USER-",socket.id, "-MSG-", uid);

        let newPlayer = {
          username: username,
          socketId: socket.id,
          uid: uid,
          connected: true
        };

        socketManager.addToList(newPlayer);
        queueManager.addToQueue(newPlayer);

        socketManager.sendMessage(uid, "Added to List...");
        socketManager.printState();
      }

    } else {
        console.log("Empty registration");
    }

    if(queueManager.queue.length > 1) {

      //TAKE TWO PLAYERS OUT OF QUEUE AND PASS THEM TO THE GAME MANAGER
      player1 = queueManager.shiftQueue();
      player2 = queueManager.shiftQueue();
      queueManager.printState();

      //CREATING NEW GAME INSTANCE
      let gameId = gameManager.createGame([player1, player2], "WAR");
      console.log(`-->NEW GAME -ID-${gameId} -USERS-${player1.uid},${player2.uid} "-GAME- WAR`);

      socketManager.sendMessage(player1.uid,`Joining Game! ID:${gameId}`);
      socketManager.sendMessage(player2.uid,`Joining Game! ID:${gameId}`);
    }

  });

  socket.on('draw', function (data) {
    console.log(data);
    gameManager.sendMsg('draw', data);

  });

  socket.on('end-game', function(data) {
    player = {
      uid: data.uid,
      socketId: socket.id,
      connected: true
    };
    // queueManager.addToQueue(player);
    gameManager.endGame(data.gameId);

  });

});









