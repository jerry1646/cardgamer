/*jshint esversion : 6 */

const cards = require('./cardReference.js');


const message = {};
// turn: 1,
// cards: { id1: 15 },
// roundWinner: '',
// gameWinner: '',
// players:
// { id1: { score: 1, playable: false },
//   id2: { score: 0, playable: true } }

const war = require("./games/war.js");


module.exports = function(io){
  return {
    war : war(io, cards, message)

    //more games goes here
  };
};
