"use strict";

var canvas, ctx;

//constants
var frame = 0,
	centerX = (window.innerWidth / 2),
	centerY = (window.innerHeight / 3),
	speed = 10;

//level images
var level_0, level_1, level_2, level_3, level_passive;

//numbers array
var numberCollection = new Array(10);

var packageName = localStorage.getItem('currentPackageName');
var levelNumber = localStorage.getItem('currentLevelNumber');
var packageCount = localStorage.getItem('packageCount');
var totalScore;

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

	initSounds();
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
			addNumbers();
			draw(); //if all resources ready for use, draw them
		} else {
			setTimeout(checkResources, 200); //if not loaded, wait 200ms and check again
		}
	};

	//add images for load
	level_0 = addImage("assets/level_0.png");
	level_1 = addImage("assets/level_1.png");
	level_2 = addImage("assets/level_2.png");
	level_3 = addImage("assets/level_3.png");
	level_passive = addImage("assets/level_passive.png");

	for (var i = 0; i < 10; i++) {
		numberCollection[i] = addImage("assets/numbers/" + i + ".png");
	}

	checkResources();
}

var creditsPosY = (window.innerHeight - 100);
var isAdded = false;

function draw() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	drawBackgroundNumbers();

	drawLevelSelectGrid();

	drawPackageNameText();

	requestAnimationFrame(draw);
}

function drawBackgroundNumbers() {
	ctx.globalAlpha = 0.25;

	//draw background numbers with alpha
	for (var i = 0; i < numbers.length; i++) {
		ctx.drawImage(numbers[i].sprite, numbers[i].x, numbers[i].y, numbers[i].sprite.width * 0.5, numbers[i].sprite.height * 0.5);
		if (numbers[i].y < (window.innerHeight - 100)) {
			numbers[i].y += speed * 0.125;
		} else {
			numbers[i].y = Math.random() * -(window.innerHeight - 200);
		}
	}
}

function drawLevelSelectGrid() {
	ctx.globalAlpha = 1;

	if (!isAdded) {
		var yPosition = (window.innerHeight / 2.5);
		var xPosition = centerX - (window.innerWidth / 4.5);
		for (var i = 0; i < 3; i++) {
			for (var k = 0; k < 5; k++) {
				var levelNumber = (i * 5) + (k + 1);
				var levelStarCount = getLevelStarCount(packageName, levelNumber);
				switch (levelStarCount) {
					case "0":
						addLevelItem('game.html', 'level_0_Button', xPosition, yPosition, levelNumber, false);
						break;
					case "1":
						addLevelItem('game.html', 'level_1_Button', xPosition, yPosition, levelNumber, false);
						break;
					case "2":
						addLevelItem('game.html', 'level_2_Button', xPosition, yPosition, levelNumber, false);
						break;
					case "3":
						addLevelItem('game.html', 'level_3_Button', xPosition, yPosition, levelNumber, false);
						break;
					default:
						if (i == 0 && k == 0) {
							addLevelItem('game.html', 'level_0_Button', xPosition, yPosition, levelNumber, false);
							setCurrentLevel(levelNumber);
							setLevelStarCount(packageName, levelNumber);
						} else {
							addLevelItem('#', 'level_passive_Button', xPosition, yPosition, levelNumber, true);
						}
						break;
				}
				xPosition += (window.innerWidth / 10);
			}
			xPosition = centerX - (window.innerWidth / 4.5);
			yPosition += (window.innerHeight / 6);
		}
		isAdded = true;
	}
}

function drawPackageNameText() {
	ctx.font = "normal 2.5em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.fillText(packageName, centerX - (window.innerWidth / 16), (window.innerHeight / 2.5));
}

function addLevelNumberText(_href, _xPos, _yPos, _levelNumber) {
	var levelNumberText = document.createElement('a');
	levelNumberText.setAttribute('class', 'levelNumberText');
	var pos = 'top:' + (_yPos + (window.innerHeight / 15)) + 'px;left:' + (_xPos - 10) + 'px';
	levelNumberText.setAttribute('style', pos);
	levelNumberText.setAttribute('href', _href);
	levelNumberText.setAttribute('onclick', 'setCurrentLevel(' + _levelNumber + ')');
	levelNumberText.innerHTML = _levelNumber;
	document.body.appendChild(levelNumberText);
}

function addLevelItem(_href, _className, _xPos, _yPos, _levelNumber, _isLocked) {
	var levelElement = document.createElement('a');
	levelElement.setAttribute('class', _className);
	var pos = 'top:' + _yPos + 'px;left:' + _xPos + 'px';
	levelElement.setAttribute('style', pos);

	if (!_isLocked) {
		levelElement.setAttribute('href', _href);
		levelElement.setAttribute('onclick', 'setCurrentLevel(' + _levelNumber + ')');
	}
	document.body.appendChild(levelElement);

	if (!_isLocked) {
		addLevelNumberText(_href, _xPos, _yPos, _levelNumber);
	}
}

var numbers = new Array();

function addNumbers() {
	for (var k = 0; k < 5; k++) {
		for (var i = 0; i < 10; i++) {
			numbers.push({
				x: (100 + (Math.random() * (window.innerWidth - 200))),
				y: Math.random() * -(window.innerHeight - 100),
				sprite: numberCollection[i]
			});
		}
	}
}

window.addEventListener('DOMContentLoaded', init, false);