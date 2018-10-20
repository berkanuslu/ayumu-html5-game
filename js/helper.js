"use strict";

//audio
var isAudioPlaying = true;

//windows store input variables
var pointerX = 0;

//copy array helper function
function copyArray(_base, _temp) {
	for (var i = 0; i < _base.length; i++) {
		_temp[i] = _base[i];
	}
}

function initSounds() {
	var soundValue = localStorage.getItem("sound");
	if (soundValue == null) {
		localStorage.setItem("sound", "1");
	}

	if (localStorage.getItem("sound") == "1") {
		gameAudio.volume = 0.2;
		gameAudio.play();
	}
}

function playSound() {
	if (isAudioPlaying) {
		isAudioPlaying = false;
		document.getElementById('playSoundButton').className = "soundOffMenuButton";
		gameAudio.pause();
		localStorage.setItem('sound', '0');
	} else {
		isAudioPlaying = true;
		document.getElementById('playSoundButton').className = "soundOnMenuButton";
		gameAudio.volume = 0.2;
		gameAudio.play();
		localStorage.setItem('sound', '1');
	}
}

function getGeneralLevelImageIndex() {
	if (totalScore >= 0 && totalScore <= 4000) {
		return 0;
	} else if (totalScore > 4000 && totalScore <= 10000) {
		return 1;
	} else if (totalScore > 10000 && totalScore <= 18000) {
		return 2;
	} else if (totalScore > 18000 && totalScore <= 28000) {
		return 3;
	} else if (totalScore > 28000 && totalScore <= 40000) {
		return 4;
	} else if (totalScore > 40000 && totalScore <= 54000) {
		return 5;
	} else if (totalScore > 54000 && totalScore <= 70000) {
		return 6;
	} else if (totalScore > 70000 && totalScore <= 88000) {
		return 7;
	} else if (totalScore > 88000 && totalScore <= 100000) {
		return 8;
	} else if (totalScore > 100000) {
		return 9;
	}
}

function getMemoryLevelName() {
	if (totalScore >= 0 && totalScore <= 4000) {
		return "Hominoidae";
	} else if (totalScore > 4000 && totalScore <= 10000) {
		return "Hylobatidae";
	} else if (totalScore > 10000 && totalScore <= 18000) {
		return "Hominidae";
	} else if (totalScore > 18000 && totalScore <= 28000) {
		return "Pongo";
	} else if (totalScore > 28000 && totalScore <= 40000) {
		return "Gorilla";
	} else if (totalScore > 40000 && totalScore <= 54000) {
		return "Homo";
	} else if (totalScore > 54000 && totalScore <= 70000) {
		return "Pan";
	} else if (totalScore > 70000 && totalScore <= 88000) {
		return "Paniscus";
	} else if (totalScore > 88000 && totalScore <= 100000) {
		return "Troglodytes";
	} else if (totalScore > 100000) {
		return "Ayumu";
	}
}

// get stage count by level number
// 1-2-3 stage 1/1
// 4-5-6-7-8 stage 1/2
// 9-10-11-12 stage 1/3
// 13-14-15 stage 1/4
function getTotalStageCount(_levelNumber) {
	var totalStageCount = 1;

	if (_levelNumber == 1 || _levelNumber == 2 || _levelNumber == 3) {
		totalStageCount = 1;
	} else if (_levelNumber == 4 || _levelNumber == 5 || _levelNumber == 6 || _levelNumber == 7 || _levelNumber == 8) {
		totalStageCount = 2;
	} else if (_levelNumber == 9 || _levelNumber == 10 || _levelNumber == 11 || _levelNumber == 12) {
		totalStageCount = 3;
	} else if (_levelNumber == 13 || _levelNumber == 14 || _levelNumber == 15) {
		totalStageCount = 4;
	} else {
		totalStageCount = 1;
	}

	return totalStageCount;
}

function getPackageNumber() {
	switch (packageName) {
		case "Numbers":
			return 1;
		case "Letters":
			return 2;
		case "Mixed":
			return 3;
		case "Deck":
			return 4;
		default:
			return 1;
	}
}

function getStageText(_levelNumber) {
	var stageText = currentStage + " / " + getTotalStageCount(_levelNumber);
	return stageText;
}

//init share for windows store application
function initShare() {
	var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
	dataTransferManager.addEventListener('datarequested', function (e) {
		var localImage = "ms-appx:///images/widelogo.png";
		var request = e.request;
		request.data.properties.title = "Ayumu";
		request.data.properties.description = "Play with the Ayumu memory game!";
		request.data.setHtmlFormat(Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat("<img src=\"" + localImage + "\" /><br /><br />I'm playing Ayumu. My Score: " + score + " and Total Score: " + totalScore + " at Package: " + packageName + ", Level: " + levelNumber + ". My memory level equal to " + getMemoryLevelName() + ".<br/><br/>http://www.kodgraf.com<br />Game Developed and Published By Kodgraf Game Studio<br />All rights reserved. &copy; 2013, Ankara, Turkey<br /><br />http://facebook.com/kodgraf<br />http://twitter.com/kodgraf"));
		var streamRef = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(new Windows.Foundation.Uri(localImage));
		request.data.resourceMap[localImage] = streamRef;
	});
}

//setup inputs for windows store application
function setupInput() {
	document.body.addEventListener('MSPointerMove', function (ev) {
		pointerX = ev.clientX;
	}, false);

	document.body.addEventListener('MSPointerDown', function (ev) {
		pointerX = ev.clientX;
	}, false);

	document.body.addEventListener('MSPointerUp', function (ev) {
		pointerX = ev.clientX;
	}, false);
}

function testCollision(button) {
	Array.prototype.remove = function (from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
}

// set selected package name
// it can be Numbers, Letters, Mixed, Deck values.
function setCurrentPackage(name) {
	localStorage.setItem("currentPackageName", name);
}

function addPackageItem(_idName, _packageName, _isLocked) {
	var packageElement = document.createElement('a');
	packageElement.setAttribute('id', _idName);
	if (!_isLocked) {
		packageElement.setAttribute('href', 'levelSelect.html');
		packageElement.setAttribute('onclick', 'setCurrentPackage("' + _packageName + '")');
	}
	document.body.appendChild(packageElement);
}

//describes which packages star count
//for example: stars_Numbers_1 is equal to star count of 1st level in Numbers package
//it can be 0,1,2,3 values
function getLevelStarCount(_packageName, _levelNumber) {
	var starCount = localStorage.getItem("stars_" + _packageName + "_" + _levelNumber);

	if (starCount == null)
		return -1;
	else
		return starCount;
}

function setLevelStarCount(_packageName, _levelNumber) {
	var key = "stars_" + _packageName + "_" + _levelNumber;
	localStorage.setItem(key, "0");
}

function setCurrentLevel(_levelNumber) {
	localStorage.setItem("currentLevelNumber", _levelNumber);
}

function resizeCanvas() {
	// only change the size of the canvas if the size it's being displayed
	// has changed.
	if (canvas.width != canvas.clientWidth ||
		canvas.height != canvas.clientHeight) {
		// Change the size of the canvas to match the size it's being displayed
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
}