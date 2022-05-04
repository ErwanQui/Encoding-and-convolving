const audioContext = new AudioContext();
const gainControl = audioContext.createGain();
var space = audioContext.createPanner()

console.log(ambisonics)

var order = 3;
	
var encoder;
var mirror;
var rotator;
var binDecoder;
var convolver;

var audioChoice;
var choice;
var source;

function Choice(id, value) {
	audioChoice = "Audio"+value;
	choice = id;
	document.getElementsByClassName("Begin")[0].style.visibility = "hidden";
	document.getElementsByClassName("Begin")[0].style.position = "absolute";
	document.getElementsByClassName("FileChoice")[0].style.visibility = "visible";
	document.getElementsByClassName("FileChoice")[0].style.position = "relative";
}

function Verify() {
	source = document.getElementById("File").files[0];

	if (source) {
		AudioBegin(source);
	}
	else {
		console.log("bah aucun fichier n'a été choisi en fait")
	}
}

function AudioBegin(source) {
	document.getElementsByClassName("FileChoice")[0].style.visibility = "hidden";
	document.getElementsByClassName("FileChoice")[0].style.position = "absolute";
	document.getElementsByClassName("Common")[0].style.visibility = "visible"
	document.getElementsByClassName("Common")[0].style.position = "relative";
	document.getElementsByClassName(choice)[0].style.visibility = "visible"
	document.getElementsByClassName(choice)[0].style.position = "relative";

	encoder = new ambisonics.monoEncoder(audioContext, order);
	mirror = new ambisonics.sceneMirror(audioContext, order);
	rotator = new ambisonics.sceneRotator(audioContext, order);
	binDecoder = new ambisonics.binDecoder(audioContext, order);
	convolver = new ambisonics.convolver(audioContext, order);

	gainControl.gain.setValueAtTime(0.5, 0);

	var sound = document.createElement('audio');
	sound.id = 'audio-player';
	sound.type = source.type;
	// sound.controls = 'controls';
	sound.loop = "loop";
	sound.src = source.name;
	document.getElementById('File').appendChild(sound);


	window[audioChoice](sound);
}

// function ChangeOrder(value) {
// 	order = parseInt(value);
// }

function DispVal(value) {
	document.getElementById("DispSoundValue").value = value;
	gainControl.gain.setValueAtTime(value, 0);

}