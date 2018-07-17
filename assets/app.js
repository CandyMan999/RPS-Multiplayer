// Initialize Firebase
var config = {
  apiKey: "AIzaSyCaj8KA0yJ_y_7xf4m-oxqaYfNUVVfiykQ",
  authDomain: "rps-multiplayer-d76a4.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-d76a4.firebaseio.com",
  projectId: "rps-multiplayer-d76a4",
  storageBucket: "rps-multiplayer-d76a4.appspot.com",
  messagingSenderId: "549801769528"
};
firebase.initializeApp(config);


// These are all our global variables
var database = firebase.database();
var initialUser1 = "Waiting for player 1";
var initialUser2 = "Waiting for player 2";
var whoIsIt;  
var wins = 0;
var losses = 0;
let name; 
let choice;
let user_choice = null;
// this is a function for the game rules, myChoice and theirChoice are the parameters of the function whereas each parameter is specific for the window of a particular operator
const gameRules = (myChoice, theirChoice) => {
  var options = ["Rock", "Paper", "Scissors"];
  var myIndex = options.indexOf(myChoice);
  var theirIndex = options.indexOf(theirChoice);
  let dif = (myIndex - theirIndex);
// based off the result of the difference of the two indices we can confer the outcome of the game round
  console.log(dif);
// this is the logic that handles the outcome between the indices
  if (dif === 0) {
    alert("draw");
  } else if (dif === 1){
    alert("win")
  } else if (dif === 2) {
    alert('loss')
  } else if (dif === -2) {
    alert('win')
  } else if (dif === -1) {
    alert('loss')
  } 
}; // *******************END OF FUNCTION *******************************************

// this start the game with initial text that is used when waiting for users to join the game
$("#player1").text(initialUser1);
$("#player2").text(initialUser2);

//all connections will be stored in this directory
var connectionsRef = database.ref("/connections");

//"info/connected" is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// this is a boolean value, true if connected, false if disconnected
var connectedRef = database.ref(".info/connected");

// when the players connection state changes...
connectedRef.on("value", function(snap) {
  
  //If they are connected..
  if (snap.val()){
    
    //Add user to the connections list
    var con = connectionsRef.push(true);

    //Remove user from the connection list when they disconnect
    con.onDisconnect().remove() 

    // database.ref("/player1").onDisconnect().set({
    //   name: initialUser1,
    // }); 

  }

});

// when first loaded or when the connections list changes..
connectionsRef.on("value", function(snap){
    $("#connected").text(snap.numChildren());
});


$("#ready").on('click', function(event) {
// prevents the page from refreshing  
event.preventDefault();
console.log($("#player1").text());
name = $("#player-input").val().trim();
//this should capture any extra users after them game is full so they don't inturrupt
// if ($("#player1").text() != initialUser1 && $("#player2").text() != initialUser2) {
//     alert("sorry this game is full");

//     user1 = $("#player-input").val().trim();

//     database.ref("/extraPlayer").push({
//       name: user1,
//     });

//  }


//we are writing an if statement that fills whichever user does not have a value in it, other than the default starting value
if ($("#player1").text() === initialUser1) { 
  console.log("we got it")
  whoIsIt = "1";
  //this will disconnect the current user and refresh their name back to the intial starting point
  database.ref(`/player${whoIsIt}`).onDisconnect().set({
    name: initialUser1,
  }); 
  //this dynamically creates the list inside of the html
  $("#choices1").html(` <ul>
      <li id='rock'>Rock</li>
      <li id='paper'>Paper</li>
      <li id='scissors'>Scissors</li>
      </ul>`
  );
  // This references the database for user 2 and if they have selected a choice then we are going to run the two choices in the gameRules function parameters to see the outcome
  database.ref("/player2").on("value", function(snapshot){
    let sv = snapshot.val();
    if (sv.choice) {
      $("#choices2").html(sv.choice);
      gameRules(choice, sv.choice);
    }
  });
} 


else {
  console.log("we are onto the second player");
  whoIsIt = "2";
  database.ref(`/player${whoIsIt}`).onDisconnect().set({
    name: initialUser2,
  }); 
  // This will reference the database for user 1 and see if they have selected a choice, if they have then the html will populate for user 2 and for their turn
  database.ref("/player1").on("value", function(snapshot){
    let sv = snapshot.val();
    if (sv.choice) {
      user_choice = sv.choice;
      $("#choices2").html(`
        <ul>
          <li id='rock'>Rock</li>
          <li id='paper'>Paper</li>
          <li id='scissors'>Scissors</li>
        </ul>`
      );
     
    } 
  });
}  

//this will set the name wins and losses for both players
database.ref(`/player${whoIsIt}`).set({
  name,
  wins,
  losses       
}); 
$("#player-input").val('');
});

database.ref().on("value", function(snapshot){
var sv = snapshot.val();
console.log(sv.player1);
// append the html with the name
$("#player1").text(sv.player1.name);
$("#player2").text(sv.player2.name);
$("#win1").text(sv.player1.wins);
$("#loss1").text(sv.player1.losses);
$("#win2").text(sv.player2.wins);
$("#loss2").text(sv.player2.losses);
});

$(".choices").on('click', 'ul li', function(){
  choice = $(this).text();
        // Change what is saved in firebase
  database.ref(`/player${whoIsIt}`).set({
    choice,
    name,
    wins,
    losses,     
  });
$(`#choices${whoIsIt}`).html(choice);
if (whoIsIt === "2") {
  gameRules(choice, user_choice); //lcheck which player before run this

};
});
