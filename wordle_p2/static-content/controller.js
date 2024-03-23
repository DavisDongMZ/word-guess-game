/******************************************************************************
 * globals routines
 ******************************************************************************/
var words=[];

var wordle=null;

gui_state = {
	row: 0,
	col: 0,
	guess: [], 
	alphabetMap: getAlphabetMap(),
};

function gui_resetGame(){
	gui_state.row=0;
	gui_state.col=0;
	gui_state.guess=[];
	gui_state.alphabetMap=getAlphabetMap();
}

function getAlphabetMap(inputChar) {
    var alphabetMap = {};
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < alphabet.length; i++) {
        alphabetMap[alphabet[i]] = true;
    }
    if (inputChar) {
        return alphabetMap.hasOwnProperty(inputChar.toUpperCase());
    }
    return alphabetMap;
}

/******************************************************************************
 * gui utilities
 ******************************************************************************/

// manage the userinterface, we show the specified user interface
// and also change the class of the nav so that the selected element is
// highlighted in green
function showUI(ui){
    $('#ui_home, #ui_username, #ui_play, #ui_stats, #ui_instructions').hide();
	$(ui).show();
    var uiNew = ui.substring(1);
    $('#ui_nav .aligncenter [name="ui_home"]').removeClass('nav_selected');
    $('#ui_nav .alignright [name="ui_username"]').removeClass('nav_selected');
    $('#ui_nav .alignright [name="ui_play"]').removeClass('nav_selected');
    $('#ui_nav .alignright [name="ui_stats"]').removeClass('nav_selected');
    $('#ui_nav .alignright [name="ui_instructions"]').removeClass('nav_selected');
    
    if (uiNew === "ui_home"){
        $('#ui_nav .aligncenter [name="' + uiNew + '"]').addClass('nav_selected');
    } else {
        $('#ui_nav .alignright [name="' + uiNew + '"]').addClass('nav_selected');
    }
}

/******************************************************************************
 * gui utilities: coloring the letters depending on the guess score
 ******************************************************************************/

// As a result of the latest guess, update the colours of the game board
// and keyboard.
function colourBoardAndKeyboard(score){
    score.forEach((item, index) => {
        if (item.score === 3) {
            $(`.row${gui_state.row} .col${index}`).addClass('green');
            $(`.keyboardrow td`).each(function() {
                if ($(this).text() === item.char) {
                    $(this).addClass('green');
                }
            });
            $(`.letterbox .row${gui_state.row} .col${index}`).addClass('green');
        } else if (item.score === 2) {
            $(`.row${gui_state.row} .col${index}`).addClass('yellow');
            $(`.keyboardrow td`).each(function() {
                if (($(this).text() === item.char)&&(!$(this).hasClass('green'))) {
                    $(this).addClass('yellow');
                }
            });
            $(`.letterbox .row${gui_state.row} .col${index}`).addClass('yellow');
        } else if (item.score === 1) {
            $(`.row${gui_state.row} .col${index}`).addClass('grey');
            $(`.keyboardrow td`).each(function() {
                if ($(this).text() === item.char&&(!$(this).hasClass('green'))&&(!$(this).hasClass('yellow'))){
                    $(this).addClass('grey');
                }
            });
            $(`.letterbox .row${gui_state.row} .col${index}`).addClass('grey');
        }
    });
}

/******************************************************************************
 * gui utilities: handling virtual keyboard events
 ******************************************************************************/

// #ui_play delete the last character from the current board row
function delCharacter(){
    if (gui_state.col > 0) {
        gui_state.col--;
        $(`.row${gui_state.row} .col${gui_state.col}`).text('');
    }
}

// #ui_play put character c at the end of the current board row
function putCharacter(c){
    if (gui_state.col < 5) {
        $(`.row${gui_state.row} .col${gui_state.col}`).text(c);
        gui_state.guess[gui_state.col] = c;
        gui_state.col++;
    }
}

/******************************************************************************
 * gui routines
 ******************************************************************************/

// #ui_play update the model with a guess, and then modify the gui appropriately
function gui_guess(data){
    var state = data.error;
    $('#error').text(state).fadeIn().delay(3000).fadeOut();
    colourBoardAndKeyboard(data.score);
    gui_state.row++;
    gui_state.col=0;
    if (data.state === "won" || data.state === "lost") {
        gui_gameDisable();
    }
}


// #ui_play: hide the play button and enable the onscreen keyboard
function gui_gameEnable(){
    $('.green').removeClass('green');
    $('.grey').removeClass('grey');
    $('.yellow').removeClass('yellow');
    $('.letterbox td').text('');
	$('#play_newgame_button').hide();
}

// #ui_play: show the play button and disable the onscreen keyboard
function gui_gameDisable(){
    $('#play_newgame_button').show();
    //$('.keyboardrow td').off('click');
}

// #ui_play: reset the state of the game in the model and gui_state, clear the game from #ui_play
function gui_newgame(){
	gui_resetGame();
    colourBoardAndKeyboard([]);
    gui_gameEnable();
}

