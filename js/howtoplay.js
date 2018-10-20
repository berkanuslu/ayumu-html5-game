"use strict";

var canvas, ctx;

//constants
var frame = 0,
	centerX = 650,
	centerY = 300,
	speed = 8;

var letterCollection = new Array(26); //letters array
var numberCollection = new Array(10); //numbers array
var mixedCollection = new Array(36); //mixed array
var generalLevelsCollection = new Array(10); //general memory level's images

var topSecretImage, bigAyumuImage;

var packageName = localStorage.getItem('currentPackageName');
var levelNumber = localStorage.getItem('currentLevelNumber');
var packageCount = localStorage.getItem('packageCount');
var totalScore;

//numbers array for background sliding numbers
var numbers = new Array();

//for drawing how to play steps
var step = 1;

//how to play elements
var handClick1 = false,
	handClick2 = false,
	handClick3 = false;
var handClickTimeout, drawTimeout;
var isDrawedTopSecrets = false;

var isLevelAdded = false;
var sloganArray = new Array(
	"Ayumu, that is Japanese chimpanzee in the genus Pan, is a genius chimp, which can sort the numbers appear on the screen and disappeared in the 60 miliseconds.",
	"Now, you can show that you are smarter than Ayumu by sorting numbers and letters!",
	"But, do not underestimate Ayumu! Even Ben Pridmore, the champion of 2004, 2008 and 2009 World Memory Championships, could’t beat Ayumu!",
	"Don’t forget to sort the number by 'ascending order' and from 'A' to 'Z'. At the mixed part, numbers come first!",
	"You can reach at 'Ayumu Level' by upgrading your overall score!");

var isStep1Added = false,
	isStep2Added = false,
	isStep3Added = false,
	isStep4Added = false,
	isStep5Added = false;

var isHandAdded = false;

var totalScore = 0;

function init() {
	//get canvas element in html file
	canvas = document.getElementById('canvas');
	//get 2d context element for drawing
	ctx = canvas.getContext('2d');

	//get totalscore from local storage
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

	//fill number images to collection
	//fill mixed (numbers and letters) images to collection
	for (var i = 0; i < 10; i++) {
		numberCollection[i] = addImage("assets/numbers/" + i + ".png");
		mixedCollection[i] = addImage("assets/numbers/" + i + ".png");
	}

	//fill letter images to collection
	for (var i = 0; i < 26; i++) {
		letterCollection[i] = addImage("assets/letters/" + i + ".png");
		mixedCollection[(i + 10)] = addImage("assets/letters/" + i + ".png");
	}

	//fill level images to collection
	for (var i = 0; i < 10; i++) {
		generalLevelsCollection[i] = addImage("assets/general_levels/" + i + ".png");
	}

	topSecretImage = addImage("assets/top_secret.png");
	bigAyumuImage = addImage("assets/general_levels/10.png");

	checkResources();
}

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

	switch (step) {
		case 1:
			drawStep1();
			break;
		case 2:
			drawStep2();
			break;
		case 3:
			drawStep3();
			break;
		case 4:
			drawStep4();
			break;
		case 5:
			drawStep5();
			break;
		default:
			drawStep1();
	}

	requestAnimationFrame(draw);
}

function clearDefaults() {
	var slogan1 = document.getElementById('slogan1');
	if (slogan1 != null)
		document.body.removeChild(slogan1);

	var slogan2 = document.getElementById('slogan2');
	if (slogan2 != null)
		document.body.removeChild(slogan2);

	var slogan3 = document.getElementById('slogan3');
	if (slogan3 != null)
		document.body.removeChild(slogan3);

	var slogan4 = document.getElementById('slogan4');
	if (slogan4 != null)
		document.body.removeChild(slogan4);

	var slogan5 = document.getElementById('slogan5');
	if (slogan5 != null)
		document.body.removeChild(slogan5);

	resetHandClick();

	isStep1Added = false;
	isStep2Added = false;
	isStep3Added = false;
	isStep4Added = false;
	isStep5Added = false;
	isDrawedTopSecrets = false;
}

function nextStep() {
	if (step < 5)
		step++;
	clearTimeout(drawTimeout);
	clearTimeout(handClickTimeout);
	resetHandClick();
}

function previousStep() {
	if (step > 1)
		step--;
	resetHandClick();
	clearTimeout(drawTimeout);
	clearTimeout(handClickTimeout);
}

function drawStep1() {
	ctx.drawImage(bigAyumuImage, (window.innerWidth * 0.27), (window.innerHeight * 0.45), bigAyumuImage.width * 0.75, bigAyumuImage.height * 0.75);

	if (!isStep1Added) {
		var link1 = document.createElement('span');
		link1.setAttribute("id", "slogan1");
		link1.innerHTML = sloganArray[0];
		document.body.appendChild(link1);

		var nextButton = document.getElementById('stepNextButton');
		nextButton.setAttribute("href", "#");
		nextButton.setAttribute("onclick", "nextStep();  clearDefaults();");

		var backButton = document.getElementById('stepBackButton');
		backButton.setAttribute("href", "index.html");

		isStep1Added = true;
	}
}

function drawStep2() {
	if (!isDrawedTopSecrets) {
		ctx.drawImage(numberCollection[1], (window.innerWidth * 0.35), (window.innerHeight * 0.70), numberCollection[1].width * 0.5, numberCollection[1].height * 0.5);
		ctx.drawImage(numberCollection[4], (window.innerWidth * 0.45), (window.innerHeight * 0.75), numberCollection[4].width * 0.5, numberCollection[4].height * 0.5);
		ctx.drawImage(numberCollection[9], (window.innerWidth * 0.55), (window.innerHeight * 0.73), numberCollection[9].width * 0.5, numberCollection[9].height * 0.5);
	} else {
		if (!handClick1) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.35), (window.innerHeight * 0.70), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick2) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.45), (window.innerHeight * 0.75), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick3) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.55), (window.innerHeight * 0.73), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}

		if (!isHandAdded) {
			var link0 = document.createElement('span');
			link0.setAttribute("id", "hand");
			document.body.appendChild(link0);

			isHandAdded = true;
		}
	}

	if (!isStep2Added) {
		drawTimeout = setTimeout(drawTopSecrets, 3000);

		var link1 = document.createElement('span');
		link1.setAttribute("id", "slogan2");
		link1.innerHTML = sloganArray[1];
		document.body.appendChild(link1);

		var nextButton = document.getElementById('stepNextButton');
		nextButton.setAttribute("href", "#");
		nextButton.setAttribute("onclick", "nextStep();  clearDefaults();");

		var backButton = document.getElementById('stepBackButton');
		backButton.setAttribute("href", "#");
		backButton.setAttribute("onclick", "previousStep();  clearDefaults();");

		isStep2Added = true;
	}
}

function drawStep3() {
	if (!isDrawedTopSecrets) {
		ctx.drawImage(letterCollection[1], (window.innerWidth * 0.35), (window.innerHeight * 0.70), letterCollection[1].width * 0.5, letterCollection[1].height * 0.5);
		ctx.drawImage(letterCollection[12], (window.innerWidth * 0.45), (window.innerHeight * 0.75), letterCollection[12].width * 0.5, letterCollection[12].height * 0.5);
		ctx.drawImage(letterCollection[17], (window.innerWidth * 0.55), (window.innerHeight * 0.73), letterCollection[17].width * 0.5, letterCollection[17].height * 0.5);
	} else {
		if (!handClick1) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.35), (window.innerHeight * 0.70), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick2) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.45), (window.innerHeight * 0.75), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick3) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.55), (window.innerHeight * 0.73), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}

		if (!isHandAdded) {
			var link0 = document.createElement('span');
			link0.setAttribute("id", "hand");
			document.body.appendChild(link0);

			isHandAdded = true;
		}
	}

	if (!isStep3Added) {
		drawTimeout = setTimeout(drawTopSecrets, 3000);

		var link1 = document.createElement('span');
		link1.setAttribute("id", "slogan3");
		link1.innerHTML = sloganArray[2];
		document.body.appendChild(link1);

		var nextButton = document.getElementById('stepNextButton');
		nextButton.setAttribute("href", "#");
		nextButton.setAttribute("onclick", "nextStep();  clearDefaults();");

		var backButton = document.getElementById('stepBackButton');
		backButton.setAttribute("href", "#");
		backButton.setAttribute("onclick", "previousStep();  clearDefaults();");

		isStep3Added = true;
	}
}

function drawTopSecrets() {
	if (!isDrawedTopSecrets) {
		handClick1 = false;
		handClick2 = false;
		handClick3 = false;
		isHandAdded = false;
		isDrawedTopSecrets = true;
		handClickTimeout = setTimeout(setHandClick, 1000);
	}
}

function setHandClick() {
	if (!handClick1 && !handClick2 && !handClick3) {
		handClick1 = true;
		handClickTimeout = setTimeout(setHandClick, 1000);
	} else if (handClick1 && !handClick2 && !handClick3) {
		handClick2 = true;
		handClickTimeout = setTimeout(setHandClick, 1000);
	} else if (handClick1 && handClick2 && !handClick3) {
		handClick3 = true;
		handClickTimeout = setTimeout(setHandClick, 1000);
	} else {
		resetHandClick();
	}
}

function resetHandClick() {
	clearTimeout(handClickTimeout);
	clearTimeout(drawTimeout);
	handClick1 = false;
	handClick2 = false;
	handClick3 = false;
	isDrawedTopSecrets = false;
	var handElement = document.getElementById('hand');
	if (handElement != null) {
		document.body.removeChild(handElement);
	}
	isHandAdded = false;
	drawTimeout = setTimeout(drawTopSecrets, 3000);
}

function drawStep4() {
	if (!isDrawedTopSecrets) {
		ctx.drawImage(numberCollection[4], (window.innerWidth * 0.35), (window.innerHeight * 0.70), numberCollection[4].width * 0.5, numberCollection[4].height * 0.5);
		ctx.drawImage(letterCollection[5], (window.innerWidth * 0.45), (window.innerHeight * 0.75), letterCollection[5].width * 0.5, letterCollection[5].height * 0.5);
		ctx.drawImage(letterCollection[23], (window.innerWidth * 0.55), (window.innerHeight * 0.73), letterCollection[23].width * 0.5, letterCollection[23].height * 0.5);
	} else {
		if (!handClick1) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.35), (window.innerHeight * 0.70), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick2) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.45), (window.innerHeight * 0.75), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}
		if (!handClick3) {
			ctx.drawImage(topSecretImage, (window.innerWidth * 0.55), (window.innerHeight * 0.73), topSecretImage.width * 0.5, topSecretImage.height * 0.5);
		}

		if (!isHandAdded) {
			var link0 = document.createElement('span');
			link0.setAttribute("id", "hand");
			document.body.appendChild(link0);

			isHandAdded = true;
		}
	}

	if (!isStep4Added) {
		drawTimeout = setTimeout(drawTopSecrets, 3000);

		var link1 = document.createElement('span');
		link1.setAttribute("id", "slogan4");
		link1.innerHTML = sloganArray[3];
		document.body.appendChild(link1);

		var nextButton = document.getElementById('stepNextButton');
		nextButton.setAttribute("href", "#");
		nextButton.setAttribute("onclick", "nextStep();  clearDefaults();");

		var backButton = document.getElementById('stepBackButton');
		backButton.setAttribute("href", "#");
		backButton.setAttribute("onclick", "previousStep();  clearDefaults();");

		isStep4Added = true;
	}
}

function drawStep5() {
	ctx.font = "normal 1.5em 'Hobo Std'";
	ctx.fillStyle = "#6d4617";
	ctx.textAlign = 'left';
	ctx.fillText("Total Score: " + totalScore, (window.innerWidth * 0.50), (window.innerHeight * 0.73));

	if (totalScore >= 0 && totalScore < 1500) {
		ctx.drawImage(generalLevelsCollection[0], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[0].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 1500 && totalScore < 3000) {
		ctx.drawImage(generalLevelsCollection[1], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[1].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 3000 && totalScore < 4500) {
		ctx.drawImage(generalLevelsCollection[2], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[2].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 4500 && totalScore < 6000) {
		ctx.drawImage(generalLevelsCollection[3], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[3].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 6000 && totalScore < 7500) {
		ctx.drawImage(generalLevelsCollection[4], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[4].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 7500 && totalScore < 9000) {
		ctx.drawImage(generalLevelsCollection[5], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[5].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 9000 && totalScore < 10500) {
		ctx.drawImage(generalLevelsCollection[6], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[6].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 10500 && totalScore < 12000) {
		ctx.drawImage(generalLevelsCollection[7], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[7].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else if (totalScore >= 12000 && totalScore < 13500) {
		ctx.drawImage(generalLevelsCollection[8], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[8].width * 0.8, generalLevelsCollection[0].height * 0.8);
	} else {
		ctx.drawImage(generalLevelsCollection[9], (window.innerWidth * 0.35), (window.innerHeight * 0.60), generalLevelsCollection[9].width * 0.8, generalLevelsCollection[0].height * 0.8);
	}

	if (totalScore < 16000) {
		totalScore += speed * 8;
	} else
		totalScore = 0;


	if (!isStep4Added) {
		var link1 = document.createElement('span');
		link1.setAttribute("id", "slogan4");
		link1.innerHTML = sloganArray[4];
		document.body.appendChild(link1);

		var nextButton = document.getElementById('stepNextButton');
		nextButton.setAttribute("href", "index.html");

		var backButton = document.getElementById('stepBackButton');
		backButton.setAttribute("href", "#");
		backButton.setAttribute("onclick", "previousStep();  clearDefaults();");

		isStep4Added = true;
	}
}

function setStep(level) {
	if (!isLevelAdded) {
		document.body.removeChild(document.getElementById("slogan" + (level - 1)));
		document.body.removeChild(document.getElementById("stepNextButton"));

		var link1 = document.createElement('span');
		link1.setAttribute("id", ("slogan" + level));
		link1.innerHTML = sloganArray[(level - 1)];;
		document.body.appendChild(link1);

		var link0 = document.createElement('a');
		link0.setAttribute("href", "#");
		link0.setAttribute("id", "stepNextButton");
		link0.setAttribute("onclick", "setStep(" + (level + 1) + "); isLevelAdded=false;");
		document.body.appendChild(link0);
		isLevelAdded = true;
	}
}

window.addEventListener('DOMContentLoaded', init, false);