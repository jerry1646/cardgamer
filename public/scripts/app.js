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
    let $p1hand = $("<div>").attr('id', 'p1hand');
    let $p2hand = $("<div>").attr('id', 'p2hand');
    let $p2card = $("<img>").attr('src', "/images/cards/purple_back.png").attr('id', 'p2card');;
    let $p1card = $('<button>').attr('id', 'p1card').attr('type', 'button');;
    let $p1cardimg = $("<img>").attr('src', "/images/cards/red_back.png").attr('id', 'p1cardimg');
    let $playfield = $("<section>").attr('id', 'middlefield');
    $p1card.append($p1cardimg)
    $p1hand.append($p1card);
    $p2hand.append($p2card);
    $('.wargamecontainer').append($p2hand, $playfield, $p1hand);
}

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
  event.preventDefault();
  gameload();
  console.log("newwargame started game init");
  })

//2nd player connect
$(".p2connect").on("click", function(event) {
  event.preventDefault();
  gameconnect();
  console.log("pconnected");
});

//2nd player disconnect
$(".p2disconnect").on("click", function(event) {
  event.preventDefault();
  gamedisconnect();
  console.log("p2disconnected");
});


 //current client drawing card
$("#p1card").on("click", function(event) {
  event.preventDefault();
  console.log("p1 draw card");
});

//when player 2 plays card
$(".p2draw").on("click", function(event) {
  event.preventDefault();
  console.log("p2 draw card");
});

//disconnect and clear game 
$(".endwargame").on("click", function(event) {
  event.preventDefault();
  gameend();
  console.log("newwargame ended");
  })
})



