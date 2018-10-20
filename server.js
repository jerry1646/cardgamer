"use-strict";
/* jshint esversion : 6 */
require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();


const cookieSession = require('cookie-session');
const bcrypt        = require('bcrypt');

//ADD SOCKET OVERHEAD
const http          = require('http').Server(app);

//DATABASE CONFIGURATION
const knexConfig    = require("./knexfile");
const db            = require("knex")(knexConfig[ENV]);

//LOGGING SOFTWARE
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes   = require("./routes/users");
const socketRoutes  = require("./routes/sockets");

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
  keys: ["jbkbjkk"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


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

    return db('users')
    .where('username', username)
    .select('id', 'username')
    .then( (rows) => {
      let user = rows[0];
      if(user) {
        req.currentUser = user;
      } else {
        req.currentUser = anonUser;
      }
    })
    .catch((err) => {
      console.log(err);
      req.currentUser = anonUser;
    })
    .then(() => {
      return next();
    });
  } else {
    req.currentUser = anonUser;
    next();
  }
});

// Mount all resource routes
app.use("/api/users", usersRoutes(db));

// Home page
app.get("/", (req, res) => {
  res.render("welcome", {user: req.currentUser});
  // res.redirect("/welcome");
});

//REAL HOME PAGE
app.get("/welcome", (req, res) => {
  res.render("welcome", {user: req.currentUser});
});

app.get("/login", (req, res) => {
  res.render("login", {user: req.currentUser});
});

//War game page
app.get("/wargame", (req, res) => {
  res.render("wargame", {user: req.currentUser});
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if(username && password) {
    db('users')
    .where('username', username)
    .select('*').limit(1)
    .catch( (err) => {
      console.log("User does not exist");
      res.redirect("/login");
    })
    .then( ([user]) => {
      bcrypt.compare(password, user.password).then(function(match) {
        if(match === true) {
          req.session.username = username;
          res.redirect("/welcome");
        } else if (match === false) {
          console.error("Failed login");
          res.redirect('/login');
        }
      });
    });
  } else {
    console.log("Empty username and password");
  }

});

app.get("/register", (req, res) => {
  res.render("register", {user: req.currentUser});
});

app.post("/register", (req, res) => {

  const { username, email, password, password_confirm } = req.body;

  if(username && email && password) {
    bcrypt.hash(password, 10).then(function(password) {
      // Store hash in your password DB.
      db("users")
      .insert({username, email, password})
      .catch( (err) => {
        console.log("Username or Email already taken!", err);
        res.redirect("/register");
      })
      .then( () => {
        req.session.username = username;
        res.redirect("/welcome");
      });
    });
  } else {
    console.log("Empty Fields!");
    res.redirect("/register");
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/welcome');
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

  let playerStatus = {/* CONNECTION DROP HANDLER */};
  console.log(`Socket: ${socket.id} connected...`);

  //SOCKET DISCONNECT HANDLING
  socket.on('disconnect', function() {
    console.log("PLAYER DISCONNECTED ---- SOCKET ID: ", socket.id);
    // playerStatus.disconnected = true;

    // setTimeout(function () {
    //       if (playerStatus.disconnected) {
    //         //SET PLAYER TO DISCONNECTED FOR ALL OTHER OBJECTS IN CODE
    //         let player = socketManager.findBySID(socket.id);
    //         console.log(`-->DISCONNECTED: ${player.uid} - ${socket.id}`);
    //         player.connected = false;
    //         //REMOVE PLAYER REFERENCE FROM SOCKET MANAGER
    //         socketManager.deleteByUID(player.uid);
    //         socketManager.printState();
    //       }
    //     }, 10000);
  });

  socket.on('register', function (data) {
    if(data) {

      let uid = data.uid;
      let gameType = data.gameType;
      //REMEMBER TO ADD THIS TO DIFFERENT QUEUES AND PROCESS GAMETYPE INFORMATION EFFECTIVELY YOU BITCH ASS MUTHAFUCKA

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
    queueManager.addToQueue(player);
    gameManager.endGame(data.gameId);
  });

  // socket.on(<Event Name>, function (<data>) {
  //  <data> contains gameId,uid,game-data
  //  socketManager uses gameId and uid to properly handle request
  //  Passes request to game controller
  //  Game controller uses a gameObject to send new data back

  // });



  // socket.on('draw-card ', function (from, msg) {

  // });

  // socket.on('draw-card', function (from, msg) {

  // });

});









