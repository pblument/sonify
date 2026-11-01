//SONIFY UPDATES
var playStatus = false;
var prevPlayStatus = false;

var arp = true;

var context;
var staticAudioRouting;

var loader;
var startTime;

var tempo = 60.0;

var lowpassFilter = 0;
//var compressor = 0;

var cutoff = 0.0;
var resonance = 0;
var envAmount = 1.0;
var width = 1;
var detune1 = 0;
var detune2 = 0;
var octave = 0;

var redWave = "piano";
var greenWave = "Bass";
var blueWave = "04_Noise";
var waveTableType;
var waveTableType2;
var redWaveTable;
var greenWaveTable;
var blueWaveTable;

var volume = 0.5;
var filterAttack = 0.056;
var filterDecay = 0.3;
var ampAttack = 0.3;
var ampDecay = 0.3;
var playDoubleOctave = false;
var grungeDrive = 50;
var grungeAmount = 1;

var delayFeedbackAmount = 0.1;

var lpf = 0.0;
var hpf = 0.0;

var reverbAmount = 0.8;
var reverbWetDryPanning = 0.2;

var isOn = true;
var isOff = false;

var monophonicNote;
var playMonophonic = false;
var redRhythm = new Array();
var greenRhythm = new Array();
var blueRhythm = new Array();
var redGain = new Array();
var greenGain = new Array();
var blueGain = new Array();

var minor1 = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var minor2 = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var minor3 = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];




function loadWaveTables() {
    loader = new WaveTableLoader();
    loader.load(start);
}

function WaveTableLoader() {
    this.waveNames = [
		        "01_Saw",
		        "02_Triangle",
		        "03_Square",
		        "04_Noise",
		        "05_Pulse",
		        "Bass",
						"celeste",
						"piano"
    			];
}

WaveTableLoader.prototype.load = function(finishedCallback) {
    var loader = this;

    loader.finishedCallback = finishedCallback;
    loader.loadedCount = 0;
    loader.waveList = new Array();

    for (var i = 0; i < loader.waveNames.length; ++i) {
        var name = loader.waveNames[i];
        loader.waveList[i] = new WaveTable(name, context);
        loader.waveList[i].load(function(redWaveTable) {
            loader.loadedCount++;
            if (loader.loadedCount == loader.waveList.length)
                loader.finishedCallback();
        });
    }
}

WaveTableLoader.prototype.getTable = function(name) {
    for (var i = 0; i < this.waveNames.length; ++i) {
        if (name == this.waveNames[i]) {
            return this.waveList[i];
        }
    }
}

function Sequence(argument) {
    this.loopLength = numberOfCols;

 		this.rhythmIndex = 0;
		this.rhythmIndex2 = 0;
		this.rhythmIndex3 = 0;

		this.lastRhythmIndex = -1;
		this.lastRhythmIndex2 = -1;
		this.lastRhythmIndex3 = -1;

		this.loopNumber = 0;
    this.noteTime = 0.0;
}

Sequence.prototype.advanceNote = function(onOrOff) {
    // Advance time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;
    this.noteTime += 0.25 * secondsPerBeat;

    this.lastRhythmIndex = this.rhythmIndex;

    this.rhythmIndex++;
    if (this.rhythmIndex == this.loopLength) {
        this.rhythmIndex = 0;
        this.loopNumber++
    }

		this.lastRhythmIndex2 = this.rhythmIndex2;

    this.rhythmIndex2++;
    if (this.rhythmIndex2 == this.loopLength) {
        this.rhythmIndex2 = 0;
        this.loopNumber++
    }

		this.lastRhythmIndex3 = this.rhythmIndex3;

    this.rhythmIndex3++;
    if (this.rhythmIndex3 == this.loopLength) {
        this.rhythmIndex3 = 0;
        this.loopNumber++
    }

		//if(onOrOff == isOn){
		if(this.rhythmIndex == 1){
		  $('#timeline').css('width', 0);
		}
		//jankity way to create a timeline...
		$('#timeline').css('width', '+=28.75');
		//$('#timeline').css('width','+=12.5');
}

function ddd() {
    masterSequence.schedule(redRhythm, greenRhythm, blueRhythm, redGain, greenGain, blueGain, redWaveTable, greenWaveTable, blueWaveTable, isOn);
}

Sequence.prototype.resetRhythm = function() {
	this.rhythmIndex = 0;
	this.lastRhythmIndex = -1;
}


Sequence.prototype.schedule = function(rhythmType1, rhythmType2, rhythmType3, gainType, gainType2, gainType3, waveTableType, waveTableType2, waveTableType3, onOrOff) {

	if(playStatus) {

	    var currentTime = context.currentTime;

    	// The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
    	currentTime -= startTime;

			//SETTING ALL THE IMAGE FILTERS HERE
			staticAudioRouting.setReverbDryWet(reverbAmount);
			staticAudioRouting.setDelayFeedback(delayFeedbackAmount);
			staticAudioRouting.setDelayDryWet(delayAmount);
			staticAudioRouting.setDelayGrunge(grungeDrive);
			staticAudioRouting.setMainGrunge(grungeAmount);
			detune1 = detuneAmount;

	    while (this.noteTime < currentTime + 0.040 /*0.120*/) {
	        // Convert noteTime to context time.
	        var contextPlayTime = this.noteTime + startTime;

	        if (rhythmType1[this.rhythmIndex] != -1) {
	            var noteNumber = rhythmType1[this.rhythmIndex];
	            var noteGain = gainType[this.rhythmIndex];
	            if (arp) {
	                var arpOctave = Math.floor(noteNumber / minor1.length); //the rhythm index value is being divided
	                var i = noteNumber % minor1.length; //one of the four minor index values is chosen in succession
	                noteNumber = minor1[i] + 12 * arpOctave;
									//console.log("noteNumber "+noteNumber);
	            }

	            if (playMonophonic) {
	                monophonicNote.play(waveTableType, waveTableType, noteNumber, noteGain, octave, contextPlayTime);
	            } else {
	                var note = new Note(staticAudioRouting, false);
	                note.play(waveTableType, waveTableType, noteNumber, noteGain, octave, contextPlayTime);
	                if (playDoubleOctave) {
	                    var note2 = new Note(staticAudioRouting, false);
	                    note2.play(waveTableType, waveTableType, noteNumber + 12, noteGain, octave, contextPlayTime);
	                }
	            }
	        }

					if (rhythmType2[this.rhythmIndex2] != -1) {
	            var noteNumber = rhythmType2[this.rhythmIndex2];
	            var noteGain = gainType2[this.rhythmIndex2];
	            if (arp) {
	                var arpOctave = Math.floor(noteNumber / minor2.length);
	                var i = noteNumber % minor2.length;
	                noteNumber = minor2[i] + 12 * arpOctave;
	            }

	            if (playMonophonic) {
	                monophonicNote.play(waveTableType2, waveTableType2, noteNumber, noteGain, octave, contextPlayTime);
	            } else {
	                var note = new Note(staticAudioRouting, false);
	                note.play(waveTableType2, waveTableType2, noteNumber, noteGain, octave, contextPlayTime);

	                if (playDoubleOctave) {
	                    var note2 = new Note(staticAudioRouting, false);
	                    note2.play(waveTableType2, waveTableType2, noteNumber + 12, noteGain, octave, contextPlayTime);
	                }
	            }
	        }

					if (rhythmType3[this.rhythmIndex3] != -1) {
	            var noteNumber = rhythmType3[this.rhythmIndex3];
	            var noteGain = gainType3[this.rhythmIndex3];
	            if (arp) {
	                var arpOctave = Math.floor(noteNumber / minor3.length);
	                var i = noteNumber % minor3.length;
	                noteNumber = minor3[i] + 12 * arpOctave;
	            }

	            if (playMonophonic) {
	                monophonicNote.play(waveTableType3, waveTableType3, noteNumber, noteGain, octave, contextPlayTime);
	            } else {
	                var note = new Note(staticAudioRouting, false);
	                note.play(waveTableType3, waveTableType3, noteNumber, noteGain, octave, contextPlayTime);

	                if (playDoubleOctave) {
	                    var note2 = new Note(staticAudioRouting, false);
	                    note2.play(waveTableType23, waveTableType3, noteNumber + 12, noteGain, octave, contextPlayTime);
	                }
	            }
	        }

	        this.advanceNote(onOrOff);
	        //console.log('Rhythm Index 1: '+this.rhythmIndex+'; Rhythm Index 2: '+this.rhythmIndex2+'; Rhythm Index 3: '+this.rhythmIndex3);
	    }


    	setTimeout("ddd()", 0);
	}

}

function Note(staticAudioRouting, isMonophonic) {
    this.staticAudioRouting = staticAudioRouting;
    this.isMonophonic = isMonophonic;

    // Create oscillators, panners, amplitude, and filter envelopes.

    var osc1 = context.createBufferSource();
    osc1.loop = true;

    var osc1Octave = context.createBufferSource();
    osc1Octave.loop = true;

    var osc2 = context.createBufferSource();
    osc2.loop = true;

    var osc2Octave = context.createBufferSource();
    osc2Octave.loop = true;

    var panner1 = context.createPanner();
    panner1.panningModel = "equalpower";

    var panner2 = context.createPanner();
    panner2.panningModel = "equalpower";

    // Amplitude envelope
    var ampEnvelope = context.createGain();
    ampEnvelope.gain.value = 0.0; // default value

    // Filter
    var filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.gain.value = lpf; // default value

    // Create note volume.
    var noteVolume = context.createGain();
    noteVolume.gain.value = 0; // start out silent until told otherwise

    // Make connections

    // oscillators --> panners.
    osc1.connect(panner1);
    osc1Octave.connect(panner1);
    osc2.connect(panner2);
    osc2Octave.connect(panner2);

    // panners --> amplitude envelope
    panner1.connect(ampEnvelope);
    panner2.connect(ampEnvelope);

    // amplitude envelope --> filter envelope
    ampEnvelope.connect(filter);

    // filter envelope --> note volume
    filter.connect(noteVolume);

    // note volume -> subsonic filter
    noteVolume.connect(this.staticAudioRouting.hiPassFilter /*hiPassFilter*/);

    // Keep oscillators playing at all times if monophonic.
    if (this.isMonophonic) {
        osc1.start(0);
        osc2.start(0);
        osc1Octave.start(0);
        osc2Octave.start(0);
				//console.log(noteVolume);

    }

    // Keep track of all the nodes.
    this.osc1 = osc1;
    this.osc2 = osc2;
    this.osc1Octave = osc1Octave;
    this.osc2Octave = osc2Octave;
    this.panner1 = panner1;
    this.panner2 = panner2;
    this.ampEnvelope = ampEnvelope;
    this.filter = filter;
    this.noteVolume = noteVolume;

    this.wave = 0;
    this.wave2 = 0;
}

Note.prototype.setFilterValues = function() {
    var time = this.time;
    var filter = this.filter;
    var pitchFrequency = this.pitchFrequency;

    filter.frequency.cancelScheduledValues(0);

    filter.type = "lowpass";
    filter.Q.value = resonance; // !!FIXME: should be Q

    var nyquist = 0.5 * context.sampleRate;

    var cutoffCents = 9600 * cutoff;
    var cutoffRate = Math.pow(2, cutoffCents / 1200.0);
    var startFrequency = cutoffRate * pitchFrequency;
    if (startFrequency > nyquist)
        startFrequency = nyquist;

    var envAmountCents = 7200 * envAmount;
    var envAmountRate = Math.pow(2, envAmountCents / 1200.0);
    var envAmountFrequency = startFrequency * envAmountRate;
    if (envAmountFrequency > nyquist)
        envAmountFrequency = nyquist;

    if (!this.isMonophonic) {
        filter.frequency.value = startFrequency;
        filter.frequency.setValueAtTime(startFrequency, time);
    } else {
        // filter.frequency.setValueAtTime(filter.frequency.value, time); // !! not correct
    }

    filter.frequency.setTargetAtTime(envAmountFrequency, time, filterAttack);
    filter.frequency.setTargetAtTime(startFrequency, time + filterAttack, filterDecay);
}

var firstTime = true;

Note.prototype.play = function(wave, wave2, semitone, gain, octave, time) {
    this.time = time;

    if (wave != this.wave || wave2 != this.wave2 || !this.isMonophonic) {
        this.wave = wave;
        this.wave2 = wave2;
        firstTime = true;
    }

    // Get local copies.
    var osc1 = this.osc1;
    var osc2 = this.osc2;
    var osc1Octave = this.osc1Octave;
    var osc2Octave = this.osc2Octave;
    var panner1 = this.panner1;
    var panner2 = this.panner2;
    var ampEnvelope = this.ampEnvelope;
    var filter = this.filter;
    var noteVolume = this.noteVolume;

    // Set oscillator pitches.

    var pitchFrequency = 130.81 /* C3 */ * Math.pow(2.0, semitone / 12.0);
    this.pitchFrequency = pitchFrequency;

		//console.log("pitchFrequency: "+pitchFrequency); //this is where the magic happens

    var pitchRate = pitchFrequency * wave.getRateScale();

    var rate1 = pitchRate * Math.pow(2.0, -detune1/1200);
    var buffer1 = wave.getWaveDataForPitch(rate1);
    if (firstTime) osc1.buffer = buffer1;

    osc1.playbackRate.value = rate1;


    var rate2 = pitchRate * Math.pow(2.0, octave - detune2/1200);
    var buffer2 = wave2.getWaveDataForPitch(rate2);
    if (firstTime) osc1Octave.buffer = buffer2;
    osc1Octave.playbackRate.value = rate2;

    if (firstTime) osc2.buffer = buffer1;
    osc2.playbackRate.value = pitchRate * Math.pow(2.0, +detune1/1200); // max one semi-tone

    if (firstTime) osc2Octave.buffer = buffer2;
    osc2Octave.playbackRate.value = pitchRate * Math.pow(2.0, octave + detune2/1200); // max one semi-tone

    // Set panning amount for width spreading.

    // pan maximum from -90 -> +90 degrees
    var x = Math.sin(0.5*Math.PI * width);
    var z = -Math.cos(0.5*Math.PI * width);
    panner1.panningModel = "equalpower";
    panner1.setPosition(-x, 0, z);

    panner2.panningModel = "equalpower";
    panner2.setPosition(x, 0, z);

    // Amplitude envelope
    ampEnvelope.gain.cancelScheduledValues(0);

    if (!this.isMonophonic)
        ampEnvelope.gain.setValueAtTime(0.0, time);
    else {
        // ampEnvelope.gain.setValueAtTime(ampEnvelope.gain.value, time); // !! not correct
    }

    // Amplitude attack
    var ampAttackTime = time + ampAttack;

    // Amplitude decay
    ampEnvelope.gain.setTargetAtTime(1, time, ampAttack);
    ampEnvelope.gain.setTargetAtTime(0, ampAttackTime, ampDecay);

    // Filter
    this.setFilterValues();

    // Set note volume.
    noteVolume.gain.value = 0.1 * volume*volume * gain*gain; // use x^2 volume curve for now. FIXME: Tweak later if necessary.

    // Trigger note if polyphonic, otherwise oscillators are running all the time for monophonic.
    if (!this.isMonophonic) {
        var ampDecayAdjust = 8*ampDecay; // time-constant adjusting...
        if (ampDecayAdjust < 0.100) ampDecayAdjust = 0.100;
        if (ampDecayAdjust > 4) ampDecayAdjust = 4;
        var offTime = ampAttackTime + ampDecayAdjust;

        osc1.start(time);
        osc2.start(time);
        osc1.stop(offTime);
        osc2.stop(offTime);

        osc1Octave.start(time);
        osc2Octave.start(time);
        osc1Octave.stop(offTime);
        osc2Octave.stop(offTime);
    } else {
        firstTime = false;
    }
}

function setTempo(x) {
    tempo = x;
    bpmDelay.setTempo(tempo);
}


function loadImpulseResponse(url, convolver) {
    // Load impulse response asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

			//     request.onload = function() {
			// console.log(request.response);
			//         //convolver.buffer = context.createBuffer(request.response, false);
			// 	convolver.buffer = context.createBuffer(2, 22050, 44100);
			//         isImpulseResponseLoaded = true;
			//     }
    request.onload = function() {
        context.decodeAudioData(
            request.response,
            function(buffer) {
                convolver.buffer = buffer;
                isImpulseResponseLoaded = true;
            },

            function(buffer) {
                console.log("Error decoding impulse response!");
            }
        );
    }
    request.onerror = function() {
        alert("error loading reverb");
    }

    request.send();
}

function StaticAudioRouting() {
    // Create dynamics compressor to sweeten the overall mix.
    var compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);

    var convolver = context.createConvolver();
    loadImpulseResponse('js/audio/matrix-reverb6.wav', convolver);

    var convolverDry = context.createGain();
    var convolverWet = context.createGain();

    convolverDry.connect(compressor);
    convolverWet.connect(convolver);
    convolver.connect(compressor);

    // BPM delay through delayWaveShaper feedback loop
    bpmDelay = new BpmDelay(context);

    var delayFeedback = context.createGain();
    var delayDry = context.createGain();
    var delayWet = context.createGain();

    delayFeedback.gain.value = 0.5;
    delayDry.gain.value = 0.5;
    delayWet.gain.value = 0.5;

    delayDry.connect(compressor);
    bpmDelay.delay.connect(delayWet);
    delayWet.connect(compressor);

    bpmDelay.delay.connect(delayFeedback);
    delayWaveShaper = new WaveShaper(context);

    delayFeedback.connect(delayWaveShaper.input);
    delayWaveShaper.output.connect(bpmDelay.delay);

    grungeWaveShaper = new WaveShaper(context);

    // Connect to delay dry/wet
    grungeWaveShaper.output.connect(delayDry);
    grungeWaveShaper.output.connect(bpmDelay.delay);

    // Connect to reverb dry/wet
    grungeWaveShaper.output.connect(convolverDry);
    grungeWaveShaper.output.connect(convolverWet);

    var hiPassFilter = context.createBiquadFilter();

    hiPassFilter.type = "highpass";
    hiPassFilter.frequency.value = hpf;

    hiPassFilter.connect(grungeWaveShaper.input);

    this.compressor = compressor;
    this.convolver = convolver;
    this.convolverDry = convolverDry;
    this.convolverWet = convolverWet;
    this.bpmDelay = bpmDelay;
    this.delayFeedback = delayFeedback;
    this.delayDry = delayDry;
    this.delayWet = delayWet;
    this.delayWaveShaper = delayWaveShaper;
    this.grungeWaveShaper = grungeWaveShaper;
    this.hiPassFilter = hiPassFilter;
    this.setReverbDryWet(reverbWetDryPanning); //default is 0.2
}

StaticAudioRouting.prototype.setDelayDryWet = function(x) {
    // Equal-power cross-fade dry -> wet
    var gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
    var gain2 = 0.5 * (1.0 + Math.cos((1.0-x) * Math.PI));
    this.delayDry.gain.value = gain1;
    this.delayWet.gain.value = gain2;
}

StaticAudioRouting.prototype.setReverbDryWet = function(x) {
    // Equal-power cross-fade dry -> wet
    var gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
    var gain2 = 0.5 * (1.0 + Math.cos((1.0-x) * Math.PI));

    this.convolverDry.gain.value = gain1;
    this.convolverWet.gain.value = gain2;
}

StaticAudioRouting.prototype.setDelayFeedback = function(x) {
    this.delayFeedback.gain.value = x;
}

StaticAudioRouting.prototype.setDelayGrunge = function(driveDb) {
    this.delayWaveShaper.setDrive(Math.pow(10, 0.05*driveDb));
}

StaticAudioRouting.prototype.setMainGrunge = function(driveDb) {
    this.grungeWaveShaper.setDrive(Math.pow(10, 0.05*driveDb));
}

function init() {
	
		var AudioContext = window.AudioContext // Default
		    || window.webkitAudioContext // Safari and old versions of Chrome
		    || false; 

		if (AudioContext) {
				context = new AudioContext();

		    staticAudioRouting = new StaticAudioRouting();
		    monophonicNote = new Note(staticAudioRouting, true);

		    loadWaveTables();

		    masterSequence = new Sequence();
		} else {
		    // Web Audio API is not supported
			alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
		}

}

function start() {
    startTime = context.currentTime + 0.160;

    redWaveTable = loader.getTable(redWave);
    greenWaveTable = loader.getTable(greenWave);
 	  blueWaveTable = loader.getTable(blueWave);

    masterSequence.schedule(redRhythm, greenRhythm, blueRhythm, redGain, greenGain, blueGain, redWaveTable, greenWaveTable, blueWaveTable, isOn);

		//console.log('startTmie: '+startTime);

}
