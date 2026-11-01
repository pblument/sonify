function hue(resetHue){
		
	var slider  = $('#hue'),
	   	tooltip = $('.hueTip');

	tooltip.show();
	tooltip.text(resetHue);

	//Call the Slider
	slider.slider({
		//Config
		range: "min",
		slider: 1,
		min: 0,
		max: 100,
		value: resetHue,

		start: function(event,ui) {
		},

		slide: function(event, ui) { 
			var value  = slider.slider('value');
			tooltip.text(ui.value); 
			
		},

		stop: function(event,ui) {
				getHue(ui.value);
		}
	});
};

function saturation(resetSaturation){

	var slider  = $('#saturation'),
		  tooltip = $('.saturationTip');

	tooltip.show();
	tooltip.text(resetSaturation);

	//Call the Slider
	slider.slider({
		//Config
		range: "min",
		slider: 1,
		min: 0,
		max: 100,
		value: resetSaturation,

		start: function(event,ui) {
		},

		slide: function(event, ui) { 
			var value  = slider.slider('value');
			tooltip.text(ui.value);  
			
		},

		stop: function(event,ui) {
			getSaturation(ui.value);
		},
	});
};

function lightness(resetLightness){
	var slider  = $('#lightness'),
	  	tooltip = $('.lightnessTip');

	tooltip.show();
	tooltip.text(resetLightness);

	//Call the Slider
	slider.slider({
		//Config
		range: "min",
		slider: 1,
		min: 0,
		max: 100,
		value: resetLightness,

		start: function(event,ui) {
			//tooltip.fadeIn('fast');
		},

		//Slider Event
		slide: function(event, ui) { //When the slider is sliding
			var value  = slider.slider('value');
			tooltip.text(ui.value);  //Adjust the tooltip accordingly
			
		},

		stop: function(event,ui) {
			getLightness(ui.value);	
		},
	});
};

function contrast(resetContrast){
	var slider  = $('#contrast'),
		  tooltip = $('.contrastTip');
	tooltip.show();
	tooltip.text(resetContrast);

	//Call the Slider
	slider.slider({
		//Config
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetContrast,

		start: function(event,ui) {			
		},

		slide: function(event, ui) {
			var value  = slider.slider('value');
			tooltip.text(ui.value);
			
		},

		stop: function(event,ui) {
			getContrast(ui.value);
		},
	});
};


function brightness(resetBrightness){
	var slider  = $('#brightness'),
		  tooltip = $('.brightnessTip');
	tooltip.show();
	tooltip.text(resetBrightness);

	//Call the Slider
	slider.slider({
		//Config
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetBrightness,

		start: function(event,ui) {			
		},

		slide: function(event, ui) {
			var value  = slider.slider('value');
			tooltip.text(ui.value);
			
		},

		stop: function(event,ui) {
			getBrightness(ui.value);
		},
	});
};


function sendRed(resetRed){
	var slider  = $('#red'),
		tooltip = $('.redTip');

	tooltip.show();
	tooltip.text(resetRed);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetRed,

		start: function(event,ui) {			
		},

		//Slider Event
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value);  
			
		},

		stop: function(event,ui) {
			getRed(ui.value);
		},
	});
};

function sendGreen(resetGreen){
	var slider  = $('#green'),
		tooltip = $('.greenTip');

	tooltip.show();
	tooltip.text(resetGreen);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetGreen,

		start: function(event,ui) {			
		},

		//Slider Event
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value);  
			
		},

		stop: function(event,ui) {
			getGreen(ui.value);
		},
	});
};



function sendBlue(resetBlue){
	var slider  = $('#blue'),
		tooltip = $('.blueTip');

	tooltip.show();
	tooltip.text(resetBlue);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetBlue,

		start: function(event,ui) {			
		},

		//Slider Event
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
			
		},

		stop: function(event,ui) {
			getBlue(ui.value); 
		},
	});
};

function sendBlur(resetBlur){
	var slider  = $('#blurry'),
		tooltip = $('.blurTip');

	tooltip.show();
	tooltip.text(resetBlur);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetBlur,

		start: function(event,ui) {			
		},
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
		},

		stop: function(event,ui) {
			getBlur(ui.value); 
		},
	});
};

function sendSharpen(resetSharpen){
	var slider  = $('#sharpen'),
		tooltip = $('.sharpenTip');

	tooltip.show();
	tooltip.text(resetSharpen);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetSharpen,

		start: function(event,ui) {			
		},
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
			
		},

		stop: function(event,ui) {
			getSharpen(ui.value); 
		},
	});
};

function sendGlow(resetGlow){
	var slider  = $('#glow'),
		tooltip = $('.glowTip');

	tooltip.show();
	tooltip.text(resetGlow);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetGlow,

		start: function(event,ui) {			
		},
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
			 
		},

		stop: function(event,ui) {
			getGlow(ui.value);
		},
	});
};

function sendNoise(resetNoise){
	var slider  = $('#noise'),
		tooltip = $('.noiseTip');

	tooltip.show();
	tooltip.text(resetNoise);

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: resetNoise,

		start: function(event,ui) {			
		},
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
			
		},

		stop: function(event,ui) {
			getNoise(ui.value); 
		},
	});
};

function sendVolume(){
	var slider  = $('#volume'),
		tooltip = $('.volumeTip');

	tooltip.show();
	tooltip.text("50");

	slider.slider({
		range: "min",
		step: 1,
		min: 0,
		max: 100,
		value: 50,

		start: function(event,ui) {			
		},
		slide: function(event, ui) { 
			var value  = slider.slider('value');

			tooltip.text(ui.value); 
			getVolume(ui.value); 
		},

		stop: function(event,ui) {
		},
	});
};


