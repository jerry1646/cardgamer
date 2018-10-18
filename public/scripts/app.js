// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });

// FUNCTIONS -------------------------------------------------------------------------
//initial game load and waiting for other player
function gameload(){
    //show game container and end button
    if ($('.wargamecontainer').is(":hidden")) {
      $('.wargamecontainer').slideToggle();}
      $('.newwargame').hide();
      $('.endwargame').show();

  let $waitingmessage = $("<h2>").text("WAITING FOR A FRIEND");
  let $gametitle = $("<h2>").addClass('title').text("Game of War");
  $('.wargamecontainer').append($waitingmessage);
  $('.gametitlesection').prepend($gametitle)
  
}

//player 2 disconnected 
function gamedisconnect(){
    $('.wargamecontainer').empty();

let $disconnectmessage = $("<h2>").text("FRIEND LOST");
$('.wargamecontainer').append($disconnectmessage);

}


//loads game of war code
function gameconnect(){
  $('.wargamecontainer').empty();
    //add game of war visuals to page
    let $p1cardcontainer = $("<div>").attr('id', 'cardcontainer');
    let $p2cardcontainer = $("<div>").attr('id', 'cardcontainer');
    let $p1hand = $("<div>").attr('id', 'p1hand');
    let $p2hand = $("<div>").attr('id', 'p2hand');
    let $p2card = $("<img>").attr('src', "/images/cards/purple_back.png").attr('id', 'p2card');;
    let $p1card = $('<button>').attr('id', 'p1card').attr('type', 'button');;
    let $p1cardimg = $("<img>").attr('src', "/images/cards/red_back.png").attr('id', 'p1cardimg');
    let $playfield = $("<section>").attr('id', 'middlefield');
    let $p2cardbox = $("<div>").attr('id', 'p2carddrawnbox');
    let $p1cardbox = $("<div>").attr('id', 'p1carddrawnbox');
    $p1card.append($p1cardimg)
    $p1hand.append($p1card, $p1cardbox);
    $p2hand.append($p2card, $p2cardbox);
    $p1cardcontainer.append($p1hand)
    $p2cardcontainer.append($p2hand)
    $('.wargamecontainer').append($p2cardcontainer, $playfield, $p1cardcontainer);
}

//p1draw
function p1draw(){
  // p1drawnCard = "/images/cards/AH.png";
  // let $p1card = $("<img>").attr('src', p1drawnCard).attr('id', 'p1carddrawn');;
  // // $('#p1hand').empty();
  // $('#p1hand').append($p1card);
  p1drawnCard = "/images/cards/AH.png";
  let $p1card = $("<img>").attr('src', p1drawnCard).attr('id', 'p1carddrawn');;
  // $('#p2hand').empty();
  $('#p1carddrawnbox').append($p1card)
}

//p2draw
function p2draw(){
  p2drawnCard = "/images/cards/2H.png";
  let $p2card = $("<img>").attr('src', p2drawnCard).attr('id', 'p2carddrawn');
  // $('#p2hand').empty();
  $("#p2carddrawnbox").append($p2card)
  
}

//card movement
function cardmove() {
  $("#p2carddrawn").animate({left: '400px', bottom: '575px'});
  $("#p1carddrawn").animate({right: '400px', top: '385px'});
  console.log("cards moving")
}

//display winner message


//game end actions
function gameend(){
  if ($('.wargamecontainer').is(":visible")) { 
    $('.wargamecontainer').empty();
    $('.gametitlesection').empty();
    $('.wargamecontainer').slideToggle();
    $('.newwargame').show();
    $('.endwargame').hide();
    console.log("send end game")
}}

// EVENTS-------------------------------------------------------------------------

//on page load
$(document).ready(function() {
  //hide and show certain items
  if ($('.wargamecontainer').is(":visible")) {
    $('.endwargame').hide();
    $('.wargamecontainer').hide();}

//send player ready and load gamebox
$(".newwargame").on("click", function(event) {
  gameload();
  console.log("newwargame started game init");
  })

//2nd player connect
$(".p2connect").on("click", function(event) {
  gameconnect();
  console.log("pconnected");
});

//2nd player disconnect
$(".p2disconnect").on("click", function(event) {
  gamedisconnect();
  console.log("p2disconnected");
});


//  current client drawing card
$("#wargamecontainer #p1hand #p1card").on("click", function(event) {
  event.preventDefault(); 
  console.log("p1 draw card");
  gameend()
});

//when player 1 plays card
$(".p1draw").on("click", function(event) {
  p1draw();
  console.log("p1 draw card");
});

//when player 2 plays card
$(".p2draw").on("click", function(event) {
  console.log("p2 draw card");
  p2draw();
});

//REMOVE shortcut to make testing faster
$(".p1p2draw").on("click", function(event) {
  console.log("both draw card shortcut");
  p2draw();
  p1draw();
});

//when both cards are played.
$(".bothdrawn").on("click", function(event) {
console.log("both hands drawn card should move");
  cardmove();
  setTimeout(function () {
    $('#p1carddrawnbox').empty();
    $('#p2carddrawnbox').empty();
    console.log("cards cleared")
}, 3000);
});

//disconnect and clear game 
$(".endwargame").on("click", function(event) {
  gameend();
  console.log("newwargame ended");
  });
});



