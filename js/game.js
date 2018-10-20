"use strict";

var canvas, ctx;

//constants
var frame = 0,
	centerX = (window.innerWidth / 2),
	centerY = (window.innerHeight / 3),
	speed = 20;

//gameplay buttons
var successButton, errorButton, playButton;

//default in-game menu order
var menuOrder = -1; //start with drawStartPlaying()

//letters array
var letterCollection = new Array(26);

//numbers array
var numberCollection = new Array(10);

//mixed array
var mixedCollection = new Array(36);

//deck clubs
var clubsCollection = new Array(13);

//deck diamonds
var diamondsCollection = new Array(13);

//deck hearts
var heartsCollection = new Array(13);

//deck clubs
var spadesCollection = new Array(13);

//general level images
var generalLevelsCollection = new Array(10);

//end game
var star_empty, star_active, score = 0,
	totalScore = 0;

var packageName = localStorage.getItem('currentPackageName');
var levelNumber = localStorage.getItem('currentLevelNumber');
var packageCount = localStorage.getItem('packageCount');

var currentStage = 1;

var positionArray = new Array();

//play gui
var isContentAdded = false;
var isPauseButtonAdded = false;
var descriptionTextY = -10;
var valueTextY = 0;

//pause menu
var pausedY = -5;
var isPauseMenuAdded = false;

//gameplay variables
var time;

var contentCollection = new Array();
var tempNumberCollection = new Array(10);
var tempLetterCollection = new Array(26);
var tempMixedCollection = new Array(36);

var tempPositionCollection = new Array();

var selectedCollection = new Array();
var correctCollection = new Array();

var isTopSecret = false;

//end game menu
var endGameY = -5;
var sprite1Y = 0,
	sprite2Y = 0,
	sprite3Y = 0;
var isEndGameMenuAdded = false;
var starCount = 0;
var isIncreasedLevel = false;
var incScores = 0;
var isDrawStars = false;
var sprite1;
var sprite2;
var sprite3;

//success screen variables
var successY = -centerY;
var successWaitY = -centerY;

//error screen variables
var errorY = -centerY;
var errorWaitY = -centerY;

//play button
var playY = -(window.innerHeight / 3);
var isPlayButtonAdded = false;

function init() {
	//get canvas element in html file
	canvas = document.getElementById('canvas');
	//get 2d context element for drawing
	ctx = canvas.getContext('2d');

	if (localStorage.getItem('totalScore') != null) {
		totalScore = parseInt(localStorage.getItem('totalScore'));
	}

	//preloadAssets function for pre-loading all assets like images, sounds and fonts
	preloadAssets();

	//setup input actions
	setupInput();

	//create position array for grid
	createPositionArray();

	//initializing game sounds
	initSounds();
}

function createPositionArray() {
	//create position array for how to draw content and topsecret icons in grids
	var x = Math.floor(((window.innerWidth - (window.innerWidth * 0.20)) - (window.innerWidth * 0.3125)) / (window.innerWidth * 0.075));
	var y = Math.floor((window.innerHeight - (window.innerHeight * 0.25)) / (window.innerHeight * 0.20));
	for (var i = 0; i < y; i++) {
		for (var k = 0; k < x; k++) {
			var _x = (window.innerWidth * 0.3125) + (k * (window.innerWidth * 0.075));
			var _y = (window.innerHeight * 0.25) + (i * (window.innerHeight * 0.20));
			positionArray.push({
				x: _x,
				y: _y
			});
		}
	}
}

function preloadAssets() {
	//control variable for resource load or not
	var _toPreload = 0;

	var addImage = function (src) {
		var img = new Image();
		img.src = src;
		_toPreload++; //increase when resource added
		img.addEventListener('load', function () {
			_toPreload--; //decrease when load finished
		}, false);
		return img;
	};

	var checkResources = function () {
		//all resources to ready for use
		if (_toPreload == 0) {
			draw(); //if all resources ready for use, draw them
		} else {
			setTimeout(checkResources, 200); //if not loaded, wait 200ms and check again
		}
	};

	//fill collections with asset images
	for (var i = 0; i < 10; i++) {
		numberCollection[i] = addImage("assets/numbers/" + i + ".png");
		mixedCollection[i] = addImage("assets/numbers/" + i + ".png");
	}

	for (var i = 0; i < 26; i++) {
		letterCollection[i] = addImage("assets/letters/" + i + ".png");
		mixedCollection[(i + 10)] = addImage("assets/letters/" + i + ".png");
	}

	for (var i = 0; i < 13; i++) {
		clubsCollection[i] = addImage("assets/decks/clubs/c" + i + ".png");
		diamondsCollection[i] = addImage("assets/decks/diamonds/d" + i + ".png");
		heartsCollection[i] = addImage("assets/decks/hearts/h" + i + ".png");
		spadesCollection[i] = addImage("assets/decks/spades/s" + i + ".png");
	}

	//fill memory level collection with asset images
	for (var i = 0; i < 10; i++) {
		generalLevelsCollection[i] = addImage("assets/general_levels/" + i + ".png");
	}

	successButton = addImage("assets/buttons/success.png");
	errorButton = addImage("assets/buttons/error.png");
	playButton = addImage("assets/buttons/play.png");

	star_empty = addImage("assets/star_empty.png");
	star_active = addImage("assets/star_active.png");

	checkResources();
}

function draw() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	frame += 1;

	switch (menuOrder) {
		case -1:
			drawStartPlaying();
			break;
		case 0:
			drawPlayGUI();
			break;
		case 1:
			drawEndGameMenu();
			break;
		case 2:
			drawPauseMenu();
			break;
		case 3:
			drawSuccess();
			break;
		case 4:
			drawError();
			break;
		default:
			drawPlayGUI();
			break;
	}

	requestAnimationFrame(draw);
}

function clearAndDefault() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	setVariablesDefault();
}

function setVariablesDefault() {
	pausedY = -5;
	descriptionTextY = -30;
	valueTextY = -10;
	successY = -centerY;
	sprite1Y = 0;
	sprite2Y = 0;
	sprite3Y = 0;
	endGameY = -5;
	errorY = -centerY;
	errorWaitY = -centerY;
	successWaitY = -centerY;

	var pauseButton = document.getElementById('pauseMenuButton');
	if (pauseButton != null)
		document.body.removeChild(pauseButton);

	var levelsButton = document.getElementById('levelsMenuButton');
	if (levelsButton != null)
		document.body.removeChild(levelsButton);

	var resumeButton = document.getElementById('resumeMenuButton');
	if (resumeButton != null)
		document.body.removeChild(resumeButton);

	var retryButton = document.getElementById('retryEndMenuButton');
	if (retryButton != null)
		document.body.removeChild(retryButton);

	var retryButton = document.getElementById('retryMenuButton');
	if (retryButton != null)
		document.body.removeChild(retryButton);

	var playButton = document.getElementById('playButton');
	if (playButton != null)
		document.body.removeChild(playButton);

	var nextMenuButton = document.getElementById('nextMenuButton');
	if (nextMenuButton != null)
		document.body.removeChild(nextMenuButton);

	var levelsFailedMenuButton = document.getElementById('levelsFailedMenuButton');
	if (levelsFailedMenuButton != null)
		document.body.removeChild(levelsFailedMenuButton);

	var retryFailedMenuButton = document.getElementById('retryFailedMenuButton');
	if (retryFailedMenuButton != null)
		document.body.removeChild(retryFailedMenuButton);

	var levelTextPlaying = document.getElementById('levelTextPlaying');
	if (levelTextPlaying != null)
		document.body.removeChild(levelTextPlaying);

	var levelsPlayButton = document.getElementById('levelsPlayButton');
	if (levelsPlayButton != null)
		document.body.removeChild(levelsPlayButton);

	var totalScorePlaying = document.getElementById('totalScorePlaying');
	if (totalScorePlaying != null)
		document.body.removeChild(totalScorePlaying);

	if (contentCollection.length > 0) {
		for (var i = 0; i < contentCollection.length; i++) {
			var _id = (packageName + "_" + contentCollection[i].indexNumber);
			var item = document.getElementById(_id);
			if (item != null)
				document.body.removeChild(document.getElementById(_id));
		}
	}

	isPauseMenuAdded = false;
	isPauseButtonAdded = false;
	isEndGameMenuAdded = false;
	isContentAdded = false;
	isPlayButtonAdded = false;
	isTopSecret = false;
	isIncreasedLevel = false;
	isDrawStars = false;

	selectedCollection.splice(0, selectedCollection.length);
	correctCollection.splice(0, correctCollection.length);
	contentCollection.splice(0, contentCollection.length);
}

function changeMenu(_orderNumber) {
	clearAndDefault();
	menuOrder = _orderNumber;
}

function drawPauseMenu() {
	ctx.font = "normal 5em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'left';
	ctx.fillText("Level Paused", centerX - (window.innerWidth * 0.15), pausedY + (pausedY * 0.1));

	if (pausedY < (window.innerHeight / 4.5)) {
		pausedY += speed * 0.5;
	} else {
		ctx.font = "normal 2em 'Hobo Std'";
		ctx.fillStyle = "#6d4617";
		ctx.textAlign = 'right';
		ctx.fillText("Score: ", centerX + (window.innerWidth / 10), pausedY + (window.innerHeight / 4));
		ctx.fillText("Total Score: ", centerX + (window.innerWidth / 10), pausedY + (window.innerHeight / 3));

		ctx.textAlign = 'left';
		ctx.fillText(score, centerX + (window.innerWidth / 10), pausedY + (window.innerHeight / 4));
		ctx.fillText(totalScore, centerX + (window.innerWidth / 10), pausedY + (window.innerHeight / 3));

		var _index = getGeneralLevelImageIndex();
		var memLevel = generalLevelsCollection[_index];
		ctx.drawImage(memLevel, (centerX - (window.innerWidth / 6)), pausedY + (window.innerHeight / 8));
	}

	if (!isPauseMenuAdded) {
		var link0 = document.createElement('a');
		link0.setAttribute("href", "levelSelect.html");
		link0.setAttribute("id", "levelsMenuButton");
		link0.setAttribute("style", "animation-duration: 1s");
		document.body.appendChild(link0);

		var link = document.createElement('a');
		link.setAttribute("href", "#");
		link.setAttribute("id", "resumeMenuButton");
		link.setAttribute("onclick", "changeMenu('0')"); //call playgui
		link.setAttribute("style", "animation-duration: 1s");
		document.body.appendChild(link);

		var link2 = document.createElement('a');
		link2.setAttribute('href', 'game.html');
		link2.setAttribute('id', 'retryMenuButton');
		link2.setAttribute("style", "animation-duration: 1s");
		document.body.appendChild(link2);

		isPauseMenuAdded = true;
	}
}

function drawPlayGUI() {
	ctx.font = "normal 2em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'right';

	ctx.fillText("Stage", (window.innerWidth / 8), descriptionTextY);
	ctx.fillText(getStageText(levelNumber), (window.innerWidth / 8), valueTextY);
	ctx.fillText("Score", (window.innerWidth / 8), descriptionTextY + (descriptionTextY * 0.7));
	ctx.fillText(score, (window.innerWidth / 8), valueTextY + (valueTextY * 0.6));

	if (descriptionTextY < (window.innerHeight / 6))
		descriptionTextY += speed * 0.25;

	if (valueTextY < (window.innerHeight / 5)) {
		valueTextY += speed * 0.25;
	} else {
		if (!isContentAdded) {
			isContentAdded = true;
			getContent();
		}
	}

	if (!isTopSecret) {
		if ((getTotalStageCount(levelNumber) + 2) == contentCollection.length) {
			drawContentCollection();
		}
	}

	if (!isPauseButtonAdded) {
		var link = document.createElement('a');
		link.setAttribute('href', '#');
		link.setAttribute('id', 'pauseMenuButton');
		link.setAttribute('onclick', 'changeMenu(2)'); //call pause menu
		document.body.appendChild(link);

		isPauseButtonAdded = true;
	}
}

function drawContentCollection() {
	for (var i = 0; i < contentCollection.length; i++) {
		var indexNum = contentCollection[i].indexNumber;
		if (packageName == "Numbers") {
			ctx.drawImage(numberCollection[indexNum], contentCollection[i].x, contentCollection[i].y, contentCollection[i].width, contentCollection[i].height);
		} else if (packageName == "Letters") {
			ctx.drawImage(letterCollection[indexNum], contentCollection[i].x, contentCollection[i].y, contentCollection[i].width, contentCollection[i].height);
		} else if (packageName == "Mixed") {
			ctx.drawImage(mixedCollection[indexNum], contentCollection[i].x, contentCollection[i].y, contentCollection[i].width, contentCollection[i].height);
		}
	}
}

//get game content for current category (numbers, letters, mixed etc.)
function getContent() {
	time = (10 - levelNumber) + 15 - currentStage;

	if (packageName == "Numbers") {
		copyArray(numberCollection, tempNumberCollection);
	} else if (packageName == "Letters") {
		copyArray(letterCollection, tempLetterCollection);
	} else if (packageName == "Mixed") {
		copyArray(mixedCollection, tempMixedCollection);
	}

	copyArray(positionArray, tempPositionCollection);

	if (currentStage <= getTotalStageCount(levelNumber)) {
		var contentCount = getTotalStageCount(levelNumber) + 2;

		getContentCollectionByStage(contentCount);
	}
}

function getContentCollectionByStage(_contentCount) {
	for (var i = 0; i < _contentCount; i++) {
		var randomNumber;

		if (packageName == "Numbers") {
			randomNumber = Math.floor(Math.random() * tempNumberCollection.length);
		} else if (packageName == "Letters") {
			randomNumber = Math.floor(Math.random() * tempLetterCollection.length);
		} else if (packageName == "Mixed") {
			randomNumber = Math.floor(Math.random() * tempMixedCollection.length);
		}

		var posRandom = Math.floor(Math.random() * tempPositionCollection.length);
		var _xPos = tempPositionCollection[posRandom].x;
		var _yPos = tempPositionCollection[posRandom].y;
		var _width;
		var _height;
		var _indexNumber;

		if (packageName == "Numbers") {
			_width = tempNumberCollection[randomNumber].width;
			_height = tempNumberCollection[randomNumber].height;
			_indexNumber = numberCollection.indexOf(tempNumberCollection[randomNumber]);
		} else if (packageName == "Letters") {
			_width = tempLetterCollection[randomNumber].width;
			_height = tempLetterCollection[randomNumber].height;
			_indexNumber = letterCollection.indexOf(tempLetterCollection[randomNumber]);
		} else if (packageName == "Mixed") {
			_width = tempMixedCollection[randomNumber].width;
			_height = tempMixedCollection[randomNumber].height;
			_indexNumber = mixedCollection.indexOf(tempMixedCollection[randomNumber]);
		}

		contentCollection.push({
			x: _xPos,
			y: _yPos,
			width: _width / 2,
			height: _height / 2,
			indexNumber: _indexNumber
		});

		if (packageName == "Numbers") {
			tempNumberCollection.splice(randomNumber, 1);
		} else if (packageName == "Letters") {
			tempLetterCollection.splice(randomNumber, 1);
		} else if (packageName == "Mixed") {
			tempMixedCollection.splice(randomNumber, 1);
		}

		tempPositionCollection.splice(posRandom, 1);
	}

	setTimeout(getTopSecrets, (time * 100));
}

//replace content images with top secret images after time out
function getTopSecrets() {
	isTopSecret = true;
	for (var i = 0; i < contentCollection.length; i++) {
		var link = document.createElement('a');
		link.setAttribute('href', "#");
		link.setAttribute('class', "topSecretButton");
		var _id = (packageName + "_" + contentCollection[i].indexNumber);
		link.setAttribute('id', _id);

		var myStyle = "top:" + Math.round(contentCollection[i].y) + "px;left:" + Math.round(contentCollection[i].x - 25) + "px";
		link.setAttribute("style", myStyle);

		link.setAttribute("onclick", "addSelectedCollection(" + contentCollection[i].indexNumber + ")");
		document.body.appendChild(link);
		correctCollection.push(contentCollection[i].indexNumber);
	}
	isTopSecret = true;
}

function addSelectedCollection(_indexNumber) {
	selectedCollection.push(_indexNumber);
	document.body.removeChild(document.getElementById((packageName + "_" + _indexNumber)));

	if (selectedCollection.length == correctCollection.length) {
		checkSelected();
	}
}

function checkSelected() {
	var stageSuccessCount = 0;
	correctCollection.sort(function (a, b) {
		return a - b
	});
	for (var i = 0; i < correctCollection.length; i++) {
		if (correctCollection[i] == selectedCollection[i]) {
			stageSuccessCount++;
		}
	}

	if (stageSuccessCount == (getTotalStageCount(levelNumber) + 2)) {
		changeMenu(3); //get success menu
	} else {
		changeMenu(4); //get error menu
	}
}

function drawEndGameMenu() {
	//animate level completed and failed text
	if (score > 0) {
		animateLevelCompletedText();
	} else {
		animateLevelFailedText();
	}

	if (endGameY < (window.innerHeight * 0.25)) {
		endGameY += speed;
	} else {
		if (!isDrawStars) {
			//animate stars after level completed or failed text animation finished
			getStarSpriteByScore();

			animateStars();
		} else {
			//draw score and memory level after star arnimations finished
			drawScoreAndMemoryLevel();
		}
	}
}

function animateLevelCompletedText() {
	if (!isEndGameMenuAdded) {
		var link0 = document.createElement('a');
		link0.setAttribute("href", "levelSelect.html");
		link0.setAttribute("id", "levelsMenuButton");
		document.body.appendChild(link0);

		var link = document.createElement('a');
		link.setAttribute("href", "game.html");
		link.setAttribute("id", "nextMenuButton");
		//link.setAttribute("onclick", "increaseLevel()");
		document.body.appendChild(link);

		var link2 = document.createElement('a');
		link2.setAttribute('href', 'game.html');
		link2.setAttribute('id', 'retryEndMenuButton');
		link2.setAttribute("onclick", "decreaseLevel()");
		document.body.appendChild(link2);
		isEndGameMenuAdded = true;
	}

	ctx.font = "normal 5em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'left';
	ctx.fillText("Level Completed!", centerX - (window.innerWidth * 0.2), endGameY);
}

function animateLevelFailedText() {
	if (!isEndGameMenuAdded) {
		var link0 = document.createElement('a');
		link0.setAttribute("href", "levelSelect.html");
		link0.setAttribute("id", "levelsFailedMenuButton");
		document.body.appendChild(link0);

		var link = document.createElement('a');
		link.setAttribute('href', 'game.html');
		link.setAttribute('id', 'retryFailedMenuButton');
		link.setAttribute("onclick", "decreaseLevel()");
		document.body.appendChild(link);
		isEndGameMenuAdded = true;
	}

	ctx.font = "normal 5em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'left';
	ctx.fillText("Level Failed!", centerX - (window.innerWidth * 0.15), endGameY);
}

function animateStars() {
	//draw and animate star1
	ctx.drawImage(sprite1, centerX - (window.innerWidth / 40), sprite1Y);

	animateStar1();
}

function animateStar1() {
	if (sprite1Y < (window.innerHeight / 2.5)) {
		sprite1Y += speed;
	} else {
		//draw and animate star2, after star1 animation finished
		ctx.drawImage(sprite2, centerX + (window.innerWidth / 25), sprite2Y);

		animateStar2();
	}
}

function animateStar2() {
	if (sprite2Y < (window.innerHeight / 2.5)) {
		sprite2Y += speed;
	} else {
		//draw and animate star3, after star2 animation finished
		ctx.drawImage(sprite3, centerX + (window.innerWidth / 10), sprite3Y);

		animateStar3();
	}
}

function animateStar3() {
	if (sprite3Y < (window.innerHeight / 2.5)) {
		sprite3Y += speed;
	} else {
		var _index = getGeneralLevelImageIndex();
		var memLevel = generalLevelsCollection[_index];
		ctx.drawImage(memLevel, (centerX - (window.innerWidth / 6)), sprite3Y - 30);

		//animate score and total score, after star3 animation finished
		animateScoreAndTotalScore();
	}
}

function animateScoreAndTotalScore() {
	ctx.font = "normal 2em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'right';
	ctx.fillText("Score: ", centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 8));
	if (incScores >= score) {
		ctx.fillText("Total Score: ", centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 5.5));
	}

	ctx.textAlign = 'left';
	if (incScores <= score) {
		incScores += 4;
		ctx.fillText(incScores, centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 8));
	} else {
		ctx.fillText(score, centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 8));
		ctx.fillText(totalScore, centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 5.5));

		isDrawStars = true;
	}
}

function drawScoreAndMemoryLevel() {
	ctx.drawImage(sprite1, (centerX - (window.innerWidth / 40)), sprite1Y);
	ctx.drawImage(sprite2, (centerX + (window.innerWidth / 25)), sprite2Y);
	ctx.drawImage(sprite3, (centerX + (window.innerWidth / 10)), sprite3Y);

	ctx.font = "normal 2em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'right';
	ctx.fillText("Score: ", centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 8));
	ctx.fillText("Total Score: ", centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 5.5));

	ctx.textAlign = 'left';
	ctx.fillText(score, centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 8));
	ctx.fillText(totalScore, centerX + (window.innerWidth / 10), sprite3Y + (window.innerHeight / 5.5));

	var _index = getGeneralLevelImageIndex();
	var memLevel = generalLevelsCollection[_index];
	ctx.drawImage(memLevel, (centerX - (window.innerWidth / 6)), sprite3Y - 30);

	if (!isIncreasedLevel) {
		if (score > 0)
			increaseLevel();

		isIncreasedLevel = true;
	}
}

function getStarSpriteByScore() {
	sprite1 = star_empty;
	sprite2 = star_empty;
	sprite3 = star_empty;

	switch (getTotalStageCount(levelNumber)) {
		case 1:
			if (score == (100 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_active;
				starCount = 3;
			} else {
				sprite1 = star_empty;
				sprite2 = star_empty;
				sprite3 = star_empty;
				starCount = 0;
			}
			break;
		case 2:
			if (score == (100 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_empty;
				sprite3 = star_empty;
				starCount = 1;
			} else if (score == (200 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_empty;
				starCount = 2;
			} else if (score == (300 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_active;
				starCount = 3;
			}
			break;
		case 3:
			if (score > 0 && score < (300 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_empty;
				sprite3 = star_empty;
				starCount = 1;
			} else if (score >= (300 * getPackageNumber()) && score < (600 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_empty;
				starCount = 2;
			} else if (score >= (600 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_active;
				starCount = 3;
			}
			break;
		case 4:
			if (score > 0 && score < (500 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_empty;
				sprite3 = star_empty;
				starCount = 1;
			} else if (score >= (500 * getPackageNumber()) && score < (900 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_empty;
				starCount = 2;
			} else if (score >= (900 * getPackageNumber())) {
				sprite1 = star_active;
				sprite2 = star_active;
				sprite3 = star_active;
				starCount = 3;
			}
			break;
		default:
			break;
	}
}

function decreaseLevel() {
	if (score > 0) {
		if (levelNumber > 1) {
			levelNumber--;
			localStorage.setItem('currentLevelNumber', levelNumber);
			localStorage.setItem(("stars_" + packageName + "_" + levelNumber), starCount);
		} else {
			levelNumber == 15;
			if (packageCount > 1) {
				packageCount--;
			}

			localStorage.setItem('currentLevelNumber', levelNumber);
			localStorage.setItem('packageCount', packageCount);
			var newPackageName = getPreviousPackageName();
			localStorage.setItem('currentPackageName', newPackageName);
		}
	}
}

function increaseLevel() {
	if (levelNumber < 15) {
		//save current level star count
		localStorage.setItem(("stars_" + packageName + "_" + levelNumber), starCount);

		var previousScore = localStorage.getItem(("score_" + packageName + "_" + levelNumber));
		if (previousScore != null) {
			totalScore -= previousScore;
		}
		localStorage.setItem(("score_" + packageName + "_" + levelNumber), score);
		localStorage.setItem('totalScore', totalScore);

		levelNumber++;

		//if next level is opened, automatically set star count to 0
		if (localStorage.getItem(("stars_" + packageName + "_" + levelNumber)) == null)
			localStorage.setItem(("stars_" + packageName + "_" + levelNumber), 0);

		localStorage.setItem('currentLevelNumber', levelNumber);
		localStorage.setItem('packageCount', packageCount);
		localStorage.setItem('currentPackageName', packageName);
	} else {
		localStorage.setItem(("stars_" + packageName + "_" + levelNumber), starCount);
		var previousScore = localStorage.getItem(("score_" + packageName + "_" + levelNumber));
		if (previousScore != null) {
			totalScore -= previousScore;
		}
		localStorage.setItem(("score_" + packageName + "_" + levelNumber), score);
		localStorage.setItem('totalScore', totalScore);
		levelNumber = 1;

		if (packageCount < 3) {
			packageCount++;
		}

		localStorage.setItem('currentLevelNumber', levelNumber);
		localStorage.setItem('packageCount', packageCount);
		var newPackageName = getNextPackageName();
		localStorage.setItem('currentPackageName', newPackageName);
		setTimeout("openPackageSelectMenu", 3000);
	}
}

function openPackageSelectMenu() {
	window.open('packageSelect.html');
}

function getNextPackageName() {
	if (packageName == "Numbers") {
		return "Letters";
	} else if (packageName == "Letters") {
		return "Mixed";
	} else if (packageName == "Mixed") {
		return "Deck";
	} else {
		return "Numbers";
	}
}

function getPreviousPackageName() {
	if (packageName == "Letters") {
		return "Numbers";
	} else if (packageName == "Mixed") {
		return "Letters";
	} else if (packageName == "Deck") {
		return "Mixed";
	} else {
		return "Numbers";
	}
}

function drawSuccess() {
	ctx.drawImage(successButton, centerX - (window.innerWidth * 0.1), successY);

	if (successWaitY < centerY) {
		successY += speed;
		successWaitY += speed;
	} else if (successWaitY >= centerY && successWaitY < (window.innerHeight - (window.innerHeight * 0.1))) {
		successWaitY += speed;
	} else {
		score += (currentStage * (100 * getPackageNumber()));
		checkStages(score);
	}
}

function drawError() {
	ctx.drawImage(errorButton, centerX - (window.innerWidth * 0.1), errorY);

	if (errorWaitY < centerY) {
		errorY += speed;
		errorWaitY += speed;
	} else if (errorWaitY >= centerY && errorWaitY < (window.innerHeight - (window.innerHeight * 0.1))) {
		errorWaitY += speed;
	} else {
		score += 0;
		checkStages(score);
	}
}

function checkStages(_score) {
	if (currentStage == getTotalStageCount(levelNumber)) {
		//all stages are done, call end game menu
		totalScore += _score;
		changeMenu(1); //call end game menu
	} else {
		//all stages are not done yet
		//increase score and getContent()
		currentStage++;
		changeMenu(0); //call playgui
	}
}

function drawStartPlaying() {
	if (!isPlayButtonAdded) {
		var text = ("Level: " + levelNumber);
		if (packageName == "Deck") {
			text == "Coming soon...";
		}
		var link0 = document.createElement('span');
		link0.setAttribute("id", "levelTextPlaying");
		link0.innerHTML = text;
		document.body.appendChild(link0);

		var link2 = document.createElement('span');
		link2.setAttribute("id", "totalScorePlaying");
		link2.innerHTML = "Total Score: " + totalScore;
		document.body.appendChild(link2);

		if (packageName != "Deck") {
			var link = document.createElement('a');
			link.setAttribute("href", "#");
			link.setAttribute("id", "playButton");
			link.setAttribute("onclick", "changeMenu('0')"); //call playgui
			document.body.appendChild(link);
		}

		var link1 = document.createElement('a');
		link1.setAttribute("href", "levelSelect.html");
		link1.setAttribute("id", "levelsPlayButton");
		document.body.appendChild(link1);

		isPlayButtonAdded = true;
	}
}

window.addEventListener('DOMContentLoaded', init, false);