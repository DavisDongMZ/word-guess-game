/*
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
*/
// https://nodejs.org/api/n-api.html
// https://blog.postman.com/how-to-create-a-rest-api-with-node-js-and-express/
// https://developer.mozilla.org/en-US/docs/Web
// https://developer.mozilla.org/en-US/docs/Web/JavaScript

var port = 8290;
var express = require('express');
var crypto = require('crypto');
var app = express();
const fs = require('fs');
const Wordle  = require('./model.js');

// https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
app.use(express.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

// https://expressjs.com/en/starter/static-files.html
app.use(express.static('static-content')); 
const words = fs.readFileSync('./static-content/words.5', 'utf-8').split('\n');
var games = [];
for (var i = 0; i < 10; i++) {
    var wordle = new Wordle(words);
    games.push({
        wordle: wordle,
        guess: "", 
        ongoing: false 
    });
}
var players = 0; // indicate how many people playing the game.

app.get('/api/wordle/initialData', function (req, res) {
	if (players >= 10){
		res.status(400).json("too many people playing");
		return;
	}
	wordle = games[players].wordle;
	res.json({username: wordle.getUsername(), won: wordle.won, lost: wordle.lost, player: players});
	players++;
});

app.get('/api/wordle/guess/player/:player', function (req, res) {
	// when user input guess request the word.5 file
	//console.log(guess);
	if (games[players].ongoing == false){
		res.status(400).json("game not start yet.");
		return;
	} else if (games[players].guess.length !== 5){
		res.status(409).json("the guess length is not 5.");
		return;
	}
	var data = games[players].wordle.makeGuess(games[players].guess);
	if (data.success) { games[players].guess = "";}
	if (data.state === "won" || data.state === "lost") {games[players].ongoing = false;}
	res.json(data);
});

app.post('/api/wordle/newgame/player/:player', function (req, res){
	games[players].wordle.reset();
	games[players].ongoing = true;
	games[players].guess = "";
	res.json("game created successfully");
	res.status(200);
});

app.post('/api/wordle/newgame/wordel/:player', function (req, res) {
	wordle = new Wordle(words);
});

app.put('/api/wordle/putChar/:letter/player/:player', function(req, res) {
	var letter = req.params.letter;
	if (games[players].ongoing == false){
		res.status(400).json("game not start yet.");
		return;
	} else if (games[players].guess.length >= 5){
		res.status(409).json("words should be less than 5 length.");
		return;
	}
	games[players].guess += letter;
	res.json({ letter: letter });
	res.status(200);
});

app.delete('/api/wordle/deleteChar/player/:player', function (req, res) {
	if (games[players].ongoing == false){
		res.status(400).json("game not start yet.");
		return;
	} else if (games[players].guess.length === 0){
		res.status(409).json("can't delete letter from empty word.");
		return;
	}
	games[players].guess = games[players].guess.slice(0, -1);
	res.json("delete chars successfully");
	res.status(200);
});

app.listen(port, function () {
  	console.log('Example app listening on port '+port);
});