"use strict";

//declare canvas and context variables
var canvas, ctx;

//constants
var frame = 0,
        centerX = (window.innerWidth / 2),
        centerY = (window.innerHeight / 3),
        speed = 8;

var packageName = localStorage.getItem('currentPackageName');
var levelNumber = localStorage.getItem('currentLevelNumber');
var packageCount = localStorage.getItem('packageCount');
var totalScore;

function init() {
        //get canvas element in html file
        canvas = document.getElementById('canvas');
        //get 2d context element for drawing
        ctx = canvas.getContext('2d');

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
                        draw(); //if all resources ready for use, draw them
                } else {
                        setTimeout(checkResources, 200); //if not loaded, wait 200ms and check again
                }
        };

        checkResources();
}

function draw() {
        requestAnimationFrame(draw);
}

window.addEventListener('DOMContentLoaded', init, false);