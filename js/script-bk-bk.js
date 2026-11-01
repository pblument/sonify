//Define all images for the canvas
var imageObj = new Image(),
		imageStore = imageObj,
		newImage = new Image();			

//DEFAULT VALUES
var hueDefault = 50,
		lightDefault = 50,
		satDefault = 50,
		brightnessDefault = 50,
		contrastDefault = 50,
		redDefault = 50,
		greenDefault = 50,
		blueDefault = 50,
		blurDefault = 0,
		sharpenDefault = 0,
		glowDefault = 0,
		noiseDefault = 0,
		volumeDefault = 50,
		newImageWidth = 0,
		newImageHeight = 0,
		scaledWidth = 0,
		scaledHeight = 0,
		numberOfRows = 16,
		numberOfCols = 16;

$(document).ready(function() {
	navigator.sayswho= (function(){
	    var ua= navigator.userAgent, tem,
	    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return 'IE '+(tem[1] || '');
	    }
	    if(M[1]=== 'Chrome'){
	        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	    }
	    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
	    //return M.join(' ');
	    return M[0];
	})();
	if(navigator.sayswho == 'Chrome' || navigator.sayswho == 'Safari') {

	} else {
		alert("This browser currently doesn't support Sonify. Please use Chrome or Safari instead.");
	}

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	} else {
	 alert('The File APIs are not fully supported in this browser.');
	}
	
	var imgArray = [],
			imgSrcArray = ["testImage-01.png","testImage-10.png","testImage-11.png","testImage-03.png",
										 "testImage-04.png","testImage-06.png","testImage-07.png","testImage-08.png"];
	
	for(var i = 0; i < 8; i++) {
		imgArray[i] =  new Image();
		imgArray[i].src = 'images/'+imgSrcArray[i];		
	}
	
	$('.filters').click(function(e) {
		e.preventDefault();
		var arrayNum = $('.filters').index(this);
		drawPreset(imgArray[arrayNum]);
	});
	
	updateSliders(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);

	$('.playBtn').click(function(event){
		event.preventDefault();
		console.log(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
		
		$('#playBack').toggleClass('stopBtn');
		if(! $('#playBack').hasClass('stopBtn')) {
			playStatus = false;
			$('#timeline').css('width', 0);
		} else {
			playStatus = true;
		  init();
			bandify(numberOfRows,numberOfCols);
		}
	});

	
	$('#grid').click(function(e) {	
		e.preventDefault();
		$('#theGrid').toggle('fast');
	});	
				
});//end of doc on ready


function updateSliders(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault) {
	var $slider = $('.slider');
	$slider.each(function(index, item) {
		$(item).slider({value: $(item).data('default')});
		$(item).parent().find('.tooltip').text($(item).data('default'));
	});

	$slider.slider({
		range: "min",
		slider: 1,
		min: 0,
		max: 100,
		//value: $slider.data('default'),
		slide: function(event, ui) {
			var value  = $(this).slider('value');
			$(this).parent().find('.tooltip').text(ui.value);
			switch($(this).attr('id')) {
				case 'volume':
					volume = ui.value/100;
					break;
			}
		},

		stop: function(event,ui) {
			//console.log($(this).attr('id'));
			var type = $(this).attr('id');
			switch($(this).attr('id')) {
				case 'hue': 
					hueDefault = ui.value;
					break;
				case 'saturation':
					satDefault = ui.value;
					break;
				case 'lightness':
					lightDefault = ui.value;
					break;
				case 'contrast':
					contrastDefault = ui.value;		
					break;
				case 'brightness':
					brightnessDefault = ui.value;
					break;
				case 'red':
					redDefault = ui.value;
					break;
				case 'green':
					greenDefault = ui.value;
					break;
				case 'blue':
					blueDefault = ui.value;
					break;
				case 'blurry':
					blurDefault = ui.value;
					break;
				case 'sharpen':
					sharpenDefault = ui.value;
					break;
				case 'glow':
					glowDefault = ui.value;
					break;
				case 'noise':
					noiseDefault = ui.value;
					break; 
			}		
			redrawImage(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
			redrawSynth(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
			//console.log(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
			
		}
	});
}

//Synth operations
redrawSynth(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
					

function drawPreset(imgPreset) {
	imageObj = imageStore = imgPreset;	
	resetImage();
}

var flipVCount = 0;
var flipHCount = 0;
var imageFlips = imageObj;

function flipVertical() {
	if(flipVCount >= 1) flipVCount = -1;
	flipVCount++;

	if(flipVCount == 1){
		imageObj = Pixastic.process(imageObj, "flipv");		
		document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
		bandify(numberOfRows,numberOfCols);
	}

	if(flipVCount == 0){
		imageObj = imageStore;
		document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
		bandify(numberOfRows,numberOfCols);
	}
}

function flipHorizontal() {

	if(flipHCount >= 1) flipHCount = -1;
	flipHCount++;
	console.log("flipHCount: "+flipHCount);

	if(flipHCount == 1){
		imageObj = Pixastic.process(imageObj, "fliph");		
		document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
		bandify(numberOfRows,numberOfCols);
	}

	if(flipHCount == 0){
		imageObj = imageStore;
		document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
		bandify(numberOfRows,numberOfCols);
	}				
}

function redrawSynth(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault) {
	reverbAmount = blurDefault/100;
	delayAmount = noiseDefault/100;
	detuneAmount = hueDefault - 50;
	grungeAmount = sharpenDefault/5;
	ampDecay = 0.3-sharpenDefault/333;
	if(ampDecay < 0) ampDecay = 0;
	ampAttack = ampDecay;
	if(ampAttack < 0.1) ampAttack = 0.1;
}

function redrawImage(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault) {
	 hueDefault = ((hueDefault - 50)*18)/5;
	 satDefault = ((satDefault - 50)*10)/5;
	 lightDefault = ((lightDefault - 50)*10)/5;
	 brightDefault = ((brightnessDefault - 50)*15)/5;
	 redDefault = (redDefault - 50)/50;
	 greenDefault = (greenDefault - 50)/50;
	 blueDefault = (blueDefault - 50)/50;
	 blurDefault = blurDefault/20;
	 sharpenDefault = sharpenDefault/100;
	 glowDefault = glowDefault/100;
	 noiseDefault = noiseDefault/100;
	 contrastDefault = contrastDefault-50;
	if(contrastDefault < 0) {
		contrastDefault = contrastDefault/50;
	} else {
		contrastDefault = (contrastDefault/50)*4;
	}

	imageObj = imageStore;
	imageObj = Pixastic.process(imageObj, "brightness", {brightness:brightnessDefault,contrast:contrastDefault});
	imageObj = Pixastic.process(imageObj, "hsl", {hue:hueDefault,saturation:satDefault,lightness:lightDefault});
	imageObj = Pixastic.process(imageObj, "coloradjust", {red:redDefault,green:greenDefault,blue:blueDefault});
	imageObj = Pixastic.process(imageObj, "blurfast", {amount:blurDefault});
	imageObj = Pixastic.process(imageObj, "sharpen", {amount:sharpenDefault});
	imageObj = Pixastic.process(imageObj, "glow", {amount:glowDefault,radius:1.0});
	imageObj = Pixastic.process(imageObj, "noise", {mono:true,amount:noiseDefault,strength:1});

  
	document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
	bandify(numberOfRows,numberOfCols);
}


function drawImage(imageObj){
	var canvas = document.getElementById('theCanvas');
	var context = canvas.getContext('2d');
	imageObj.onload = function() {
  	context.drawImage(imageObj,0,0,460,320); 
	};
}

function handleFiles(e) {
	var ctx = document.getElementById('theCanvas').getContext('2d'),
			reader = new FileReader;
	
	reader.onload = function(event) {										
		resetImage();
		newImage.src = event.target.result;
		imageObj = newImage;
		imageObj.onload = function() {
			ctx.drawImage(imageObj,0,0,460,320);
			imageStore = imageObj;
			bandify(numberOfRows,numberOfCols);
    }
  }
  reader.readAsDataURL(e.target.files[0]);
}

function resetImage() {
	
	var hueDefault = 50,
			lightDefault = 50,
			satDefault = 50,
			brightnessDefault = 50,
			contrastDefault = 50,
			redDefault = 50,
			greenDefault = 50,
			blueDefault = 50,
			blurDefault = 0,
			sharpenDefault = 0,
			glowDefault = 0,
			noiseDefault = 0,
			volumeDefault = 50,
			newImageWidth = 0,
			newImageHeight = 0,
			scaledWidth = 0,
			scaledHeight = 0,
			numberOfRows = 16,
			numberOfCols = 16;
	
	var $slider = $('.slider');
	$slider.each(function(index, item) {
		$(item).slider({value: $(item).data('default')});
		$(item).parent().find('.tooltip').text($(item).data('default'));
	});
		
	imageObj = imageStore;
	document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
	
	updateSliders(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
	redrawImage(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
	redrawSynth(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);
	console.log(hueDefault, satDefault, lightDefault, contrastDefault, brightnessDefault, redDefault, greenDefault, blueDefault, blurDefault, sharpenDefault, glowDefault, noiseDefault);

	bandify(numberOfRows,numberOfCols);
}


$(window).load(function() {
	
	// Temporary patch until all browsers support unprefixed context.
	if(window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext'))
		window.webkitAudioContext = AudioContext;

	init();

	var input = document.getElementById('uploader');
	input.addEventListener('change', handleFiles);

	imageObj.src = 'images/testImage-08.png';
	drawImage(imageObj);
});