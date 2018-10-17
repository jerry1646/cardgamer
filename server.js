"use-strict";
/* jshint esversion : 6 */
require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

//Add socket overhead
const http        = require('http').Server(app);

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const socketRoutes = require("./routes/sockets");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.

app.use(morgan('dev'));

// // Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/socket", socketRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

const server = app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


//SOCKETS
//##################################################
var io = require('socket.io').listen(server);

let playerManager = require('./lib/socket-manager')(io);

io.on('connection', function(socket){
  let player = null;

  console.log(`New user: ${socket.id} connected...`);
  playerManager.printState();

  socket.on('disconnect', function() {
    player.disconnected = true;

    console.log(`User: ${socket.id} disconnected...`);
    setTimeout(function () {
          if (player.disconnected) playerManager.deleteByUID(uid);
        }, 10000);
    playerManager.printState();
  });

  socket.on('register', function (uid) {
    if(uid) {
      console.log("REGISTRATION");
      console.log("USER:",socket.id, "MSG:", uid);

      if (playerManager.findByUID(uid)) {
        playerManager.updateSocket(uid, socket.id);
      } else {
        playerManager.addToQueue({
          socketId: socket.id,
          uid: uid
        });
        playerManager.sendMessage(socket.id, "Added to queue...");
        playerManager.printState();
      }
    }
    else {

        console.log("Empty registration");
    }
  }

  // socket.on('draw-card', function (from, msg) {

  // });

};










