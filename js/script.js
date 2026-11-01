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
			 '<input type="range" min="0" max="100" id="'+filterArray[i].filter+'" class="slider" value="'+filterArray[i].default+'" data-default="'+filterArray[i].default+'">'+
			 '</div>'
		 );
	}

	for(var i = 8; i < filterArray.length; i++) {
		$('.sliderBankRight').append(
			 '<div class="control">'+
			 '<p>'+filterArray[i].filter+'</p>'+
			 '<span class="tooltip"></span>'+
			 '<input type="range" min="0" max="100" id="'+filterArray[i].filter+'" class="slider" value="'+filterArray[i].default+'" data-default="'+filterArray[i].default+'">'+
			 '</div>'
		 );
	}
	//console.log("on load", filterArray);
	initSynth(filterArray);
	initSliders(filterArray);
	bindSliders(filterArray);

	$('.filters, .playBtn, #resetBtn, #flipVertical, #flipHorizontal, #grid').click(function(e) {
		e.preventDefault();
	});

	//filters are the preset pads
	$('.filters').click(function(e) {
		var arrayNum = $('.filters').index(this);
		drawPreset(imgArray[arrayNum], filterArray);
	});

	$('.playBtn').click(function(e){
		// Modern browsers start the AudioContext suspended; resume it on this
		// user gesture so playback reliably produces sound.
		if(typeof context !== 'undefined' && context && context.resume) {
			context.resume();
		}
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
	// Set each native range input to its default and sync the tooltip.
	$('.slider').each(function(index, item) {
		item.value = $(item).data('default');
		$(item).parent().find('.tooltip').text($(item).data('default'));
	});
}

// Bind native range-input events once, delegated so dynamically-added
// sliders are covered. 'input' fires live during the drag (old jQuery UI
// "slide"); 'change' fires on release (old "stop").
function bindSliders(filterArray) {
	$(document).on('input', '.slider', function() {
		$(this).parent().find('.tooltip').text(this.value);
		if(this.id == 'volume') volume = this.value/100;
	});

	$(document).on('change', '.slider', function() {
		if(this.id == 'volume') return;
		for(var i = 0; i < filterArray.length; i++) {
			if(this.id == filterArray[i].filter) {
				filterArray[i].value = parseInt(this.value, 10);
				saved = filterArray[i];
				redrawSynth(saved);
				redrawImage(saved);
			}
		}
	});
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

// Map the raw slider value (held in filterArray[i].value) for a filter name.
function filterValue(name) {
	for(var i = 0; i < filterArray.length; i++) {
		if(filterArray[i].filter == name) return filterArray[i].value;
	}
	return 0;
}

// Update the SVG feColorMatrix used for per-channel RGB gain. Each channel
// slider is 0-100 with 50 = unchanged, so gain = value/50 (0..2).
function setChannelMix(r, g, b) {
	var m = document.getElementById('channelMixMatrix');
	if(m) {
		m.setAttribute('values',
			r + ' 0 0 0 0  0 ' + g + ' 0 0 0  0 0 ' + b + ' 0 0  0 0 0 1 0');
	}
}

function redrawImage(filtered) {
	// Keep filterArray holding the raw 0-100 slider value for this filter.
	if(filtered) {
		for(var i = 0; i < filterArray.length; i++) {
			if(filterArray[i].filter == filtered.filter) {
				filterArray[i].value = filtered.value;
				break;
			}
		}
	}

	// Bipolar sliders (hue/saturation/lightness/contrast/brightness/r/g/b) are
	// neutral at 50; additive sliders (blur) are neutral at 0. Build a native
	// canvas filter string and bake it into the pixels by drawing the clean
	// source through it — bandify() then reads those filtered pixels, so the
	// sound still reacts to every slider.
	setChannelMix(filterValue('red')/50, filterValue('green')/50, filterValue('blue')/50);

	var hue        = (filterValue('hue') - 50) * 3.6;          // +/-180deg
	var saturation = filterValue('saturation') / 50;           // 0..2
	var brightness = (filterValue('brightness')/50) * (filterValue('lightness')/50);
	var contrast   = filterValue('contrast') / 50;             // 0..2
	var blur       = filterValue('blur') / 20;                 // 0..5 px

	var canvas = document.getElementById('theCanvas');
	var ctx = canvas.getContext('2d');
	ctx.filter =
		'hue-rotate(' + hue + 'deg) ' +
		'saturate(' + saturation + ') ' +
		'brightness(' + brightness + ') ' +
		'contrast(' + contrast + ') ' +
		'blur(' + blur + 'px) ' +
		'url(#channelMix)';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(imageStore, 0, 0, 460, 320);
	ctx.filter = 'none';

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
		