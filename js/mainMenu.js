"use strict";

var canvas, ctx;

//constants
var frame = 0,
	centerX = (window.innerWidth / 2),
	centerY = (window.innerHeight / 3),
	speed = 10;

//numbers array
var numberCollection = new Array(10);

//audio
var isAudioPlaying = true;

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

	for (var i = 0; i < 10; i++) {
		numberCollection[i] = addImage("assets/numbers/" + i + ".png");
	}

	checkResources();
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

function draw() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	drawBackgroundNumbers();

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

window.addEventListener('DOMContentLoaded', init, false);