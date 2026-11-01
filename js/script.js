//Define all images for the canvas
var imageObj = new Image(),
		imageStore = imageObj,
		newImage = new Image();

//Default Values
var numberOfRows = 16,
		numberOfCols = 16,
		flipvTrue = false,
		fliphTrue = false;

var saved = [],
		imgArray = [],
		imgSrcArray = ["testImage-01.png","testImage-10.png","testImage-11.png","testImage-03.png",
									 "testImage-04.png","testImage-06.png","testImage-07.png","testImage-08.png"],
		filterArray = [
			{
				"filter":"hue",
				"default":50,
				"value":50
			}, {
				"filter":"saturation",
				"default":50,
				"value":50
			}, {
				"filter":"lightness",
				"default":50,
				"value":50
			}, {
				"filter":"contrast",
				"default":50,
				"value":50
			}, {
				"filter":"brightness",
				"default":50,
				"value":50
			}, {
				"filter":"red",
				"default":50,
				"value":50
			}, {
				"filter":"green",
				"default":50,
				"value":50
			}, {
				"filter":"blue",
				"default":50,
				"value":50
			}, {
				"filter":"blur",
				"default":0,
				"value":0
			}, {
				"filter":"sharpen",
				"default":0,
				"value":0
			}, {
				"filter":"glow",
				"default":0,
				"value":0
			}, {
				"filter":"noise",
				"default":0,
				"value":0
			}
		];

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
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		//great no problems
	} else {
	 alert('The File APIs are not fully supported in this browser.');
	}

	for(var i = 0; i < 8; i++) {
		imgArray[i] =  new Image();
		imgArray[i].src = 'images/'+imgSrcArray[i];
		var j = i+1;
		$('.filterBank').append(
			'<a id="filter'+j+'" class="filters" href="#" title="Pad '+j+'">Pad '+j+'</a>'
		);

		$('.sliderBankLeft').append(
			 '<div class="control">'+
			 '<p>'+filterArray[i].filter+'</p>'+
			 '<span class="tooltip"></span>'+
			 '<div id="'+filterArray[i].filter+'" class="slider" data-default="'+filterArray[i].default+'"></div>'+
			 '</div>'
		 );
	}

	for(var i = 8; i < filterArray.length; i++) {
		$('.sliderBankRight').append(
			 '<div class="control">'+
			 '<p>'+filterArray[i].filter+'</p>'+
			 '<span class="tooltip"></span>'+
			 '<div id="'+filterArray[i].filter+'" class="slider" data-default="'+filterArray[i].default+'"></div>'+
			 '</div>'
		 );
	}
	//console.log("on load", filterArray);
	initSynth(filterArray);
	initSliders(filterArray);

	$('.filters, .playBtn, #resetBtn, #flipVertical, #flipHorizontal, #grid').click(function(e) {
		e.preventDefault();
	});

	//filters are the preset pads
	$('.filters').click(function(e) {
		var arrayNum = $('.filters').index(this);
		drawPreset(imgArray[arrayNum], filterArray);
	});

	$('.playBtn').click(function(e){
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

	$('#resetBtn').click(function(e) {
		resetImage(filterArray);
	});
	
	$('#flipVertical').click(function(e) {
		flipvTrue = true;
		redrawImage();
	});

	$('#flipHorizontal').click(function(e) {
		fliphTrue = true;
		redrawImage();
	});

	$('#grid').click(function(e) {
		$('#theGrid').toggle('fast');
	});

});

function initSynth(filterArray) {
	// console.log('initSynth');
	reverbAmount = filterArray[9].value/100; //blur
	delayAmount = filterArray[11].value/100; //noise
	detuneAmount = filterArray[0].value - 50; //hue
	grungeAmount = filterArray[9].value/5; //sharpen
	ampDecay = 0.3-filterArray[9].value/333; //sharpen
	if(ampDecay < 0) ampDecay = 0;
	ampAttack = ampDecay;
	if(ampAttack < 0.1) ampAttack = 0.1;
}

function initSliders(filterArray) {
	// console.log('initSliders');
	$('.slider').each(function(index, item) {
		$(item).slider({value: $(item).data('default')});
		$(item).parent().find('.tooltip').text($(item).data('default'));
	});
	
	updateSliders(filterArray);
	initFilters(filterArray);
}

function initFilters(filterArray) {
	// console.log('initFilters');
	filterArray[0].value = ((filterArray[0].value - 50)*18)/5; //hue
	filterArray[1].value = ((filterArray[1].value - 50)*10)/5; //saturation
	filterArray[2].value = ((filterArray[2].value - 50)*10)/5; //lightness
	filterArray[3].value = filterArray[3].value-50; //contrast
	if(filterArray[3].value < 0) {
		filterArray[3].value = filterArray[3].value/50;
	} else {
		filterArray[3].value = (filterArray[3].value/50)*4;
	}
	filterArray[4].value = ((filterArray[4].value - 50)*15)/5; //brightness
	filterArray[5].value = (filterArray[5].value - 50)/50; //red
	filterArray[6].value = (filterArray[6].value - 50)/50; //green
	filterArray[7].value = (filterArray[7].value - 50)/50; //blue
}

function drawPreset(imgPreset, filterArray) {
	// console.log('drawPreset', filterArray);
	imageObj = imageStore = imgPreset;
	resetImage(filterArray);
}

function resetImage(filterArray) {
	// console.log('resetImage', filterArray);
	imageObj = imageStore;
	document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);

	for(var i = 0; i < filterArray.length; i++) {
		filterArray[i].value = filterArray[i].default;
	}
	initSynth(filterArray);
	initSliders(filterArray);
	drawImage(imageObj);
	bandify(numberOfRows,numberOfCols);
}

function updateSliders(filterArray) {
	// console.log('updateSliders');

	$('.slider').slider({
		range: "min",
		slider: 1,
		min: 0,
		max: 100,

		slide: function(event, ui) {
			var value  = $(this).slider('value');
			$(this).parent().find('.tooltip').text(ui.value);
			if($(this).attr('id') == 'volume') volume = ui.value/100;
		},

		stop: function(event,ui) {
			for(var i = 0; i < filterArray.length; i++) {
				if($(this).attr('id') == filterArray[i].filter) {
					filterArray[i].value = ui.value;
					saved = filterArray[i];
					redrawSynth(saved);
					redrawImage(saved);
				}
			}
		}
	});
}

function redrawSynth(filtered) {
	 // console.log('redrawSynth');

	switch(filtered.filter) {
		case 'blur':
			reverbAmount = filtered.value/100; //blur
			break;
		case 'noise':
			delayAmount = filtered.value/100;
			break;
		case 'hue':
			detuneAmount = filtered.value - 50;
			break;
		case 'sharpen':
			grungeAmount = filtered.value/5;
			ampDecay = 0.3-filtered.value/333;
			if(ampDecay < 0) {ampDecay = 0;}
			ampAttack = ampDecay;
			if(ampAttack < 0.1) {ampAttack = 0.1;}
			break;
	}
}

function redrawImage(filtered) {
	// console.log('redrawImage');
	//NEED BETTER SOLUTION FOR PREVENTING IMAGE FILTERS FROM OVERRIDING EACH OTHER
	imageObj = imageStore;
	
	if(filtered) {
		switch(filtered.filter) {
			case 'hue':
				filterArray[0].value = ((filtered.value - 50)*18)/5;
				// console.log(filterArray[0].value, filterArray[1].value, filterArray[2].value);
				break;
			case 'saturation':
				filterArray[1].value = ((filtered.value - 50)*10)/5;
				break;
			case 'lightness':
				filterArray[2].value = ((filtered.value - 50)*10)/5;
				break;
			case 'contrast':
				filterArray[3].value = filtered.value-50;
				if(filterArray[3].value < 0) {
					filterArray[3].value = filtered.value/50;
				} else {
					filterArray[3].value = (filtered.value/50)*4;
				}
				break;
			case 'brightness':
				filterArray[4].value = ((filtered.value - 50)*15)/5;
				break;
			case 'red':
				filterArray[5].value = (filtered.value - 50)/50;
				break;
			case 'green':
				filterArray[6].value = (filtered.value - 50)/50;
				break;
			case 'blue':
				filterArray[7].value = (filtered.value - 50)/50;
				break;
			case 'blur':
				filterArray[8].value = filtered.value/20;
				break;
			case 'sharpen':
				filterArray[9].value = filtered.value/100;
				break;
			case 'glow':
				filterArray[10].value = filtered.value/100;
				break;
			case 'noise':
				filterArray[11].value = filtered.value/100;
				break;
		}
	}
	//console.log(filterArray);
	imageObj = Pixastic.process(imageObj, "hsl", {hue:filterArray[0].value,saturation:filterArray[1].value,lightness:filterArray[2].value});
	imageObj = Pixastic.process(imageObj, "brightness", {brightness:filterArray[4].value,contrast:filterArray[3].value});
	imageObj = Pixastic.process(imageObj, "coloradjust", {red:filterArray[5].value,green:filterArray[6].value,blue:filterArray[7].value});
	imageObj = Pixastic.process(imageObj, "blurfast", {amount:filterArray[8].value});
	imageObj = Pixastic.process(imageObj, "sharpen", {amount:filterArray[9].value});
	imageObj = Pixastic.process(imageObj, "glow", {amount:filterArray[10].value,radius:1.0});
	imageObj = Pixastic.process(imageObj, "noise", {mono:true,amount:filterArray[11].value,strength:1});

	// var tempImgObj = imageObj;
	//
	// if(flipvTrue) {
	// 	imageObj = Pixastic.process(imageObj, "flipv");
	// 	tempImgObj = imageObj;
	// 	flipvTrue = false;
	// } else {
	// 	imageObj = Pixastic.process(tempImgObj, "flipv");
	// }
	// if(fliphTrue) {
	// 	imageObj = Pixastic.process(imageObj, "fliph");
	// 	tempImgObj = imageObj;
	// 	fliphTrue = false;
	// } else {
	// 	imageObj = Pixastic.process(tempImgObj, "fliph");
	// }
	
	document.getElementById('theCanvas').getContext('2d').drawImage(imageObj,0,0,460,320);
	bandify(numberOfRows,numberOfCols);
}
		
function drawImage(imageObj) {
	// console.log('drawImage');
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
		resetImage(filterArray);
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

$(window).load(function() {
	// Temporary patch until all browsers support unprefixed context.
	if(window.hasOwnProperty('AudioContext') && !window.hasOwnProperty('webkitAudioContext'))
		window.webkitAudioContext = AudioContext;

	init();

	var input = document.getElementById('uploader');
	input.addEventListener('change', handleFiles);

	imageObj.src = 'images/'+imgSrcArray[7];
	drawImage(imageObj);
});
		