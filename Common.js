const audioContext = new AudioContext();
const gainControl = audioContext.createGain();
var space = audioContext.createPanner()

console.log(ambisonics)

var order = 2;
	
var encoder;
var mirror;
var rotator;
var binDecoder;
var convolver;


function AudioBegin(id, value) {
	document.getElementsByClassName("Begin")[0].style.visibility = "hidden";
	document.getElementsByClassName("Begin")[0].style.position = "absolute";
	document.getElementsByClassName(id)[0].style.visibility = "visible"
	document.getElementsByClassName(id)[0].style.position = "relative";

	encoder = new ambisonics.monoEncoder(audioContext, order);
	mirror = new ambisonics.sceneMirror(audioContext, order);
	rotator = new ambisonics.sceneRotator(audioContext, order);
	binDecoder = new ambisonics.binDecoder(audioContext, order);
	console.log("4");
	convolver = new ambisonics.convolver(audioContext, order);
	console.log("5");

	window["Audio"+value]();
}

function ChangeOrder(value) {
	order = parseInt(value);
}