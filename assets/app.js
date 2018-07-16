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

  var database = firebase.database();

  var initialUser1 = "Waiting for player 1";
  var initialUser2 = "Waiting for player 2";
  var whoIsIt;  
  var wins = 0;
  var wins = 0;
  
  
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

    //this should capture any extra users after them game is full so they don't inturrupt
    // if ($("#player1").text() != initialUser1 && $("#player2").text() != initialUser2) {
    //     alert("sorry this game is full");

    //     user1 = $("#player-input").val().trim();

    //     database.ref("/extraPlayer").push({
    //       name: user1,
    //     });

    //  }


    //we are writing an if statement that fills whichever user does not have a value in it other than the default
    if ($("#player1").text() === initialUser1) {
      console.log("we got it")
      whoIsIt = "player1";
        
          
          // Get inputs
          user1 = $("#player-input").val().trim();



          // Change what is saved in firebase
          database.ref("/player1").set({
              name: user1,
              wins: 0,
              losses: 0
              
          });

          database.ref("/player1").onDisconnect().set({
            name: initialUser1,
           }); 

          //this clears the input bar after a name is input
        $("#player-input").val('');
 
       
    }  //$("#player1").text() != initialUser1 && $("#player2").text() === initialUser2) 
      else {
      console.log("we are onto the second player");
      whoIsIt = "player2";
        
          
          // Get inputs
          user2 = $("#player-input").val().trim();



          // Change what is saved in firebase
          database.ref("/player2").set({
              name: user2,
              wins: 0,
              losses: 0
              
          });

          database.ref("/player2").onDisconnect().set({
            name: initialUser2,
           }); 

          //this clears the input bar after a name is input
        $("#player-input").val('');

}    
     

});

database.ref().on("value", function(snapshot){
  
  var sv = snapshot.val();
  
  
  
  //console.log(sv);
  console.log(sv.player1);
  //console.log(sv.player2);
// append the html with the name

$("#player1").text(sv.player1.name);
$("#player2").text(sv.player2.name);

});






