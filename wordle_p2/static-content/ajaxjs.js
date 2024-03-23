function updateUsername() {
    $.ajax({
        method: "GET",
        url: "/api/wordle/initialData",
        dataType: "json",
        xhrFields: {  withCredentials: true }
    }).done(function(data, text_status, jqXHR) {
        playerId = data.player;
        $("#username").html(data.username);
        $('#won').text(data.won);
        $('#lost').text(data.lost);
    }).fail(function(err) {
        console.log("Failed to update username: " + JSON.stringify(err.responseJSON));
    });
}

function getResult() {
    $.ajax({
        method: "GET",
        url: "/api/wordle/guess/player/" + playerId,
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        if (jqXHR.status === 200){
            gui_guess(data);
        } else if (jqXHR === 400){
            console.log("Error: " + data.error);
        }
    }).fail(function(err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}
  

function createWordle() {
    $.ajax({
        method: "POST",
        url: "/api/wordle/newgame/player/" +playerId,
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        gui_newgame();
    }).fail(function(err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}
 

function update(c) {
    $.ajax({
        method: "PUT",
        url: "/api/wordle/putChar/" + c + "/player/" + playerId,
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        putCharacter(data.letter);
    }).fail(function(err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}
 

function deleteLetter() {
    $.ajax({
        method: "DELETE",
        url: "/api/wordle/deleteChar/player/" +playerId,
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        delCharacter();
    }).fail(function(err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}

function createNewGame() {
    $.ajax({
        method: "POST",
        url: "/api/wordle/newgame/wordel/player/" + playerId,
        processData: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function(data, text_status, jqXHR) {
        console.log(jqXHR.status + " " + text_status + JSON.stringify(data));
        updateUsername();
        gui_newgame();
    }).fail(function(err) {
        console.log("fail " + err.status + " " + JSON.stringify(err.responseJSON));
    });
}


window.addEventListener('beforeunload', function (e) {
    createNewGame();
});
/******************************************************************************
 * onload 
 ******************************************************************************/

$(function(){
    var playerId;
        updateUsername();
        showUI("#ui_username");
        $("#play_newgame_button").on('click',function(){ createWordle() });
        $(".keyboardrow td:contains('DEL')").on('click', function() { console.log('del');deleteLetter() });
        $(".keyboardrow").on('click', 'td:not(:contains("DEL")):not(:contains("ENTER"))', function() {
            var letter = $(this).text();
            update(letter);
        });
        $(".keyboardrow td:contains('ENTER')").on('click', function() {console.log('enter'); getResult() });
});