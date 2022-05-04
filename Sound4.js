console.log(ambisonics);

var maxOrder = 3;
var orderOut = 3;
var soundBuffer, sound;


function Audio4(source) {
	order = 3;
	// order = 4;


	var hoa_convolver = new ambisonics.convolver(audioContext, order);
	console.log(hoa_convolver);


	var hoa_assignFiltersOnLoad3 = function(buffer) { hoa_convolver.updateFilters(buffer); }
	var irUrl = '../MyJSAmbisonics/examples/IRs/ambisonicRIRs/room_2.wav';
	var hoa_loader_conv = new ambisonics.HOAloader(audioContext, order, irUrl, hoa_assignFiltersOnLoad3);
	hoa_loader_conv.load();
	console.log(hoa_loader_conv);


	// function to load samples
	function loadSample(url, doAfterLoading) {
	    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
	    fetchSound.open("GET", url, true); // Path to Audio File
	    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
	    fetchSound.onload = function() {
	    	console.log(fetchSound)
	        audioContext.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
	    }
	    fetchSound.send();
	}

	function onDecodeAudioDataError()  {console.log("turbo échec");}

	// load and assign audio inputs
	// var soundUrl = "../MyJSAmbisonics/examples/sounds/sample2.wav";
	var soundUrl = source.src;
	console.log(soundUrl)
	var assignSample2SoundBuffer = function(decodedBuffer) {
		console.log(decodedBuffer);
    	soundBuffer = decodedBuffer;
    	Playing();
	}
	loadSample(soundUrl, assignSample2SoundBuffer);


    hoa_convolver.out.connect(mirror.in);
    mirror.out.connect(rotator.in);
    rotator.out.connect(binDecoder.in);
    //rotator.out.connect(analyser.in);
    binDecoder.out.connect(gainControl);
    gainControl.connect(audioContext.destination);

    function Playing() {
	    sound = audioContext.createBufferSource();
	    console.log(sound)
	    sound.buffer = soundBuffer;
	    sound.loop = true;
	    sound.connect(hoa_convolver.in);
	    sound.start(0);
	    sound.isPlaying = true;
	    console.log(sound)
	}
}