// TO DO: get chat to show up on both screens in real time
// fix functionality of text displays - text not syncing correctly (colors work though)
// some issues with setting which player is which - lost on page refresh - need to find a way to make them disconnect
// name box not hiding correctly

// ------------------------------------ initializing firebase
var config = {
    apiKey: "AIzaSyAT7sJ8-IImUQY0Fs4iWMoBVcf9tUl6raQ",
    authDomain: "rps-game-3e8f1.firebaseapp.com",
    databaseURL: "https://rps-game-3e8f1.firebaseio.com",
    projectId: "rps-game-3e8f1",
    storageBucket: "rps-game-3e8f1.appspot.com",
    messagingSenderId: "341723394309"
};

firebase.initializeApp(config);
var database = firebase.database();

// ------------------------------------ 

// player one
var name1 = "";
var p1select = "";
var p1wins = 0;
var p1ties = 0;
var p1losses = 0;
var player1 = false;

// player two
var name2 = "";
var p2select = "";
var p2wins = 0;
var p2ties = 0;
var p2losses = 0;
var player2 = false;

// use this to reset the database:
//sendToDatabase();

// default state: hide start button, selection menu, and scores
$("#name-form").show();
$("#p1select").hide();
$("#p1score").hide();
$("#p2select").hide();
$("#p2score").hide();

// pull data from firebase
database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    name1 = snapshot.val().name1;
    p1select = snapshot.val().p1select;
    p1wins = snapshot.val().p1wins;
    p1losses = snapshot.val().p1losses;
    p1ties = snapshot.val().p1ties;
    name2 = snapshot.val().name2;
    p2select = snapshot.val().p2select;
    p2wins = snapshot.val().p2wins;
    p2losses = snapshot.val().p2losses;
    p2ties = snapshot.val().p2ties;

    updateScreen();
    updateScores();

    if (name1 == "" || name2 == "") {
        $("#name-form").show();
    } else {
        $("#name-form").hide();
    }
});

// beginning the game by adding your name
$("#add-name").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // grabs user input and trims excess spaces
    var name = $("#name-input").val().trim();

    if (name1 == "" && name2 == "") {
        name1 = name;
        player1 = true;
    } else if (name1 != "" && name2 == "") {
        name2 = name;
        player2 = true;
        $("#name-form").hide();
    } else if (name1 == "" && name2 != "") {
        name1 = name;
        player1 = true;
        $("#name-form").hide();
    } else {
        $("#name-form").hide();
    }

    sendToDatabase();
});

// chat functionality
$("#send-chat").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // grabs user input and trims excess spaces
    var chat = $("#chat-input").val().trim();

    // create new chat line and add user input
    var p = $("<p>");
    
    if (player1 == true) {
        p.html("<b style='color: red'>" + name1 + ":</b> " + chat);
    } else if (player2 == true) {
        p.html("<b style='color: blue'>" + name2 + ":</b> " + chat);
    } else {
        p.text(chat);
    }

    // append to chat and scroll to show latest entry
    $("#chat").append(p);
    $("#chat").animate({scrollTop: p.offset().top}, 500);

    // clears user input
    // reference: https://stackoverflow.com/questions/8701812/clear-form-after-submission-with-jquery
    $("#chat-form").each(function() {
        this.reset();
    });
});

// selection of rock
$(".rock").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "rock";
        $("#rock1").css("background-color", "red");
    } else if (player2 == true && p2select == "") {
        p2select = "rock";
        $("#rock2").css("background-color", "red");
    } else {
        alert("Stop trying to cheat!");
    }

    showResult();
    sendToDatabase();
})

// selection of paper
$(".paper").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "paper";
        $("#paper1").css("background-color", "red");
    } else if (player2 == true && p2select == "") {
        p2select = "paper";
        $("#paper2").css("background-color", "red");
    } else {
        alert("Stop trying to cheat!");
    }

    showResult();
    sendToDatabase();
})

// selection of scissors
$(".scissors").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "scissors";
        $("#scissors1").css("background-color", "red");
    } else if (player2 == true && p2select == "") {
        p2select = "scissors";
        $("#scissors2").css("background-color", "red");
    } else {
        alert("Stop trying to cheat!");
    }

    showResult();
    sendToDatabase();
})

// end game
$("button").on("click", function() {
    // ensure name field input is empty
    $("#name-form").each(function() {
        this.reset();
    });

    if (player1 == true) {
        // announce that player one has left
        var p = $("<p>");
        p.html("<b style='color: red'>" + name1 + " has left the game.</b>")
        $("#chat").append(p);

        // reset player one
        $("#player1").text("Player 1");
        $("#result").text("Waiting on Player 1...");
        p1wins = 0;
        p1losses = 0;
        p1ties = 0;
        p1select = "";
        name1 = "";
        $("#name-form").show();
        $("#p1select").hide();
        $("#p1score").hide();
    } 

    if (player2 == true) {
        // announce that player two has left
        var p = $("<p>");
        p.html("<b style='color: blue'>" + name2 + " has left the game.</b>")
        $("#chat").append(p);

        // reset player two
        $("#player2").text("Player 2");
        $("#result").text("Waiting on Player 2...");
        p2wins = 0;
        p2losses = 0;
        p2ties = 0;
        p2select = "";
        name2 = "";
        $("#name-form").show();
        $("#p2select").hide();
        $("#p2score").hide();
    }

    sendToDatabase();
})

// allow players to make a selection
function runGame() {
    updateScores();

    if (player1 == true) {
        $("#p1select").show();
        //$("#p2select").hide();
    } 

    if (player2 == true) {
        //$("#p1select").hide();
        $("#p2select").show();
    }
}

// send data to firebase
function sendToDatabase() {
    database.ref().set({
        name1: name1,
        p1select: p1select,
        p1wins: p1wins,
        p1losses: p1losses,
        p1ties: p1ties,
        name2: name2,
        p2select: p2select,
        p2wins: p2wins,
        p2losses: p2losses,
        p2ties: p2ties,
    });
}

// determine winner, show result, and reset for next turn
function showResult() {
    // show user selections in console
    console.log(p1select);
    console.log(p2select);

    // once both users have selected, determine a winner
    if (p1select != "" && p2select != "") {
        if (p1select == p2select) {
            p1ties++;
            p2ties++;
            $("#result").text("It's a tie!");
        } else if (p1select == "rock" && p2select == "paper") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "rock" && p2select == "scissors") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else if (p1select == "paper" && p2select == "rock") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else if (p1select == "paper" && p2select == "scissors") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "scissors" && p2select == "rock") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins!");
            $("#middle").css("background-color", "blue");
        } else if (p1select == "scissors" && p2select == "paper") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins!");
            $("#middle").css("background-color", "red");
        } else {
            alert("Oops! Something went wrong!");
        }
    }

    updateScores();

    // show player choices
    $("#p1select").show();
    $("#p2select").show();

    // reset selections for next turn
    setTimeout(function() {
        $("#result").text("Waiting for players to choose!");
        $("#middle").css("background-color", "black");

        // reset selections
        p1select = "";
        p2select = "";

        // reset all background colors of icons
        $("img").css("background-color", "white");

        runGame();
    }, 2000);

    sendToDatabase();
}

// display scores
function updateScores() {
    // updating scores
    $("#p1score").html("<b>Wins:</b> " + p1wins + ", <b>Ties:</b> " + p1ties + ", <b>Losses:</b> " + p1losses);
    $("#p2score").html("<b>Wins:</b> " + p2wins + ", <b>Ties:</b> " + p2ties + ", <b>Losses:</b> " + p2losses);
}

// display player names
function updateScreen() {
    // displaying player names and status
    if (name1 == "" && name2 == "") {
        $("#result").text("Waiting on Player 1 and Player 2...");
        $("#player1").text("Player 1");
        $("#player2").text("Player 2");
    } else if (name1 != "" && name2 == "") {
        $("#result").text("Waiting on Player 2...");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text("Player 2");
    } else if (name1 == "" && name2 != "") {
        $("#result").text("Waiting on Player 1...");
        $("#player1").text("Player 1");
        $("#player2").text(name2);
        $("#p2score").show();
    } else if (name1 != "" && name2 != "") {
        $("#result").text("Waiting for players to choose!");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text(name2);
        $("#p2score").show();
        runGame();
    } else {
        alert("Oops! Something went wrong!");
    }
}