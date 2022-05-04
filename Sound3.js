console.log(ambisonics);

// // Setup audio context and variables
// var AudioContext = window.AudioContext // Default
//     || window.webkitAudioContext; // Safari and old versions of Chrome
// var context = new AudioContext; // Create and Initialize the Audio Context

// added resume context to handle Firefox suspension of it when new IR loaded
// see: http://stackoverflow.com/questions/32955594/web-audio-scriptnode-not-called-after-button-onclick
audioContext.onstatechange = function() {
    if (audioContext.state === "suspended") { context.resume(); }
}

var soundUrl = "../MyJSAmbisonics/examples/sounds/sample2.wav";
var irUrl = "../MyJSAmbisonics/examples/IRs/ambisonic2binaural_filters/HOA3_IRC_1008_virtual.wav";
var ambiIrUrl = "../MyJSAmbisonics/examples/IRs/ambisonicRIRs/room_2.wav";

// var maxOrder = 3;
// var soundBuffer, sound;

// // initialise encoder (convolver really)
// var convolver = new ambisonics.convolver(context, maxOrder);
// console.log(convolver);
// // initialize ambisonic mirroring
// var mirror = new ambisonics.sceneMirror(context, maxOrder);
// console.log(mirror);
// // initialize ambisonic rotator
// var rotator = new ambisonics.sceneRotator(context, maxOrder);
// console.log(rotator);
// // initialize ambisonic decoder
// var decoder = new ambisonics.binDecoder(context, maxOrder);
// console.log(decoder);
// // initialize ambisonic analyser
var analyser = new ambisonics.intensityAnalyser(audioContext);
// console.log(analyser);
// // output gain
// var gainOut = context.createGain();

// // connect graph
// convolver.out.connect(mirror.in);
// mirror.out.connect(rotator.in);
// rotator.out.connect(decoder.in);
// rotator.out.connect(analyser.in);
// decoder.out.connect(gainOut);
// gainOut.connect(context.destination);

// // debug
// gainOut.gain.value = 0.01;

// function to load samples
function Audio3() {
    console.log("audio3")

function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() {
        audioContext.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
    }
    fetchSound.send();
}

function onDecodeAudioDataError()  {console.log("turbo échec");}

// function to change sample from select box
function changeSample() {
    document.getElementById('play').disabled = true;
    document.getElementById('stop').disabled = true;
    soundUrl = document.getElementById("sample_no").value;
    if (typeof sound != 'undefined' && sound.isPlaying) {
        sound.stop(0);
        sound.isPlaying = false;
    }
    loadSample(soundUrl, assignSample2SoundBuffer);
}

// load and assign audio inputs
var assignSample2SoundBuffer = function(decodedBuffer) {
    soundBuffer = decodedBuffer;
    //document.getElementById('play').disabled = false;
}
loadSample(soundUrl, assignSample2SoundBuffer);

// load and assign convolver filters
var assignSample2Convolver = function(decodedBuffer) {
    convolver.updateFilters(decodedBuffer);
}
var loader_convolver = new ambisonics.HOAloader(audioContext, order, ambiIrUrl, assignSample2Convolver);
loader_convolver.load();

// load and assign decoding filters
var assignFiltersOnLoad = function(buffer) {
    binDecoder.updateFilters(buffer);
}
var loader_filters = new ambisonics.HOAloader(audioContext, order, irUrl, assignFiltersOnLoad);
loader_filters.load();

// Define mouse drag on spatial map .png local impact
function mouseActionLocal(angleXY) {
    rotator.yaw = -angleXY[0];
    rotator.pitch = angleXY[1];
    rotator.updateRotMtx();
}

function drawLocal() {
    // Update audio analyser buffers
    analyser.updateBuffers();
    var params = analyser.computeIntensity();
    //updateCircles(params, canvas);
}

// $.holdReady( true ); // to force awaiting on common.html loading



    convolver.out.connect(mirror.in);
    mirror.out.connect(rotator.in);
    rotator.out.connect(binDecoder.in);
    rotator.out.connect(analyser.in);
    binDecoder.out.connect(gainControl);
    gainControl.connect(audioContext.destination);

    // // adapt common html elements to specific example
    // document.getElementById("div-decoder").outerHTML='';
    // document.getElementById("div-order").outerHTML='';
    // document.getElementById("move-map-instructions").outerHTML='Click on the map to rotate the scene:';
                  
    // update sample list for selection
    // var sampleList = {  "speech": "sounds/sample2.wav",
    //                     "drum loop": "sounds/sample1.ogg"
    // };
    // var $el = $("#sample_no");
    // $el.empty(); // remove old options
    // $.each(sampleList, function(key,value) {
    //      $el.append($("<option></option>")
    //                 .attr("value", value).text(key));
    //      });

    // Init event listeners
    document.getElementById('play').addEventListener('click', function() {
        sound = context.createBufferSource();
        sound.buffer = soundBuffer;
        sound.loop = true;
        sound.connect(convolver.in);
        sound.start(0);
        sound.isPlaying = true;
        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = false;
    });
    document.getElementById('stop').addEventListener('click', function() {
        sound.stop(0);
        sound.isPlaying = false;
        document.getElementById('play').disabled = false;
        document.getElementById('stop').disabled = true;
    });
                  
    // Mirror Buttons actions
    for (var i=0; i<4; i++) {
        var button = document.getElementById('M'+i);
        button.addEventListener('click', function() {
                                mirrorValue.innerHTML = this.innerHTML;
                                mirror.mirror(parseInt(this.value));
                                });
    }

}

//var hoa_assignFiltersOnLoad3 = function(buffer) { hoa_convolver.updateFilters(buffer); }
// var irUrl = 'IRs/ambisonicRIRs/room_2.wav';
// var hoa_loader_conv = new ambisonics.HOAloader(context, maxOrder, irUrl, hoa_assignFiltersOnLoad3);
// hoa_loader_conv.load();
// console.log(hoa_loader_conv);
