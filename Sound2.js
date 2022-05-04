
var audioFile = new FileReader();
audioFile.onload = function(ev) {
	console.log(ev);
	audioContext.decodeAudioData(ev.target.result).then(function(buffer) {

		var sound = audioContext.createBufferSource();
		sound.buffer = buffer;
		console.log(typeof(buffer));
		console.log(buffer);
		Suite(sound);
	});
}

function Audio2(source) {
	console.log("Audio2");

	//var mediaSource = audioContext.createBuffer(order, source);

	console.log(document.getElementById("File").files[0])
  	audioFile.readAsArrayBuffer(document.getElementById("File").files[0]);
}

function Suite(sound) {
	// var arraybuf = new ArrayBuffer(buffer);
	audioContext.decodeAudioData(sound.buffer, dispload, disperror)
	// mediaSource.connect(gainControl);
	// buffer.connect(convolver.in);
	gainControl.connect(mirror.in);
	mirror.out.connect(rotator.in);
	rotator.out.connect(binDecoder.in);
	binDecoder.out.connect(space);
	space.connect(audioContext.destination);
	// console.log(mediaSource)
	// console.log(mediaSource.length)
	// console.log(mediaSource.sampleRate)
	console.log(convolver.nCh)	
	// convolver.updateFilters(mediaSource)

	// console.log(mirror)
	// // console.log(encoder)
	// console.log(binDecoder)
	// console.log(rotator)
	// console.log(convolver)
	// console.log(mediaSource)
	// console.log(source)
	source.play()

}

// var nbRay = 4;
// var orientation = [0, 0, 0];
// for (let i=0; i<nbRay; i++) {

// }

var dispload = function() {
	console.log("file open");
}

var disperror = function() {
	console.log("échec");
}

//fonction permettant d'update l'orientation de l'utilisateur

function UpdateConvolvOr(i, or){
	//listener.setOrientation(Math.cos((or-90)*Math.PI/180), 0, Math.sin((or-90)*Math.PI/180), 0, 1, 0);
	document.getElementById("DispSoundConvolvOr"+i).value = or;
	orientation[i] = -or
	rotator.yaw = orientation[0];
	rotator.pitch = orientation[1];
	rotator.roll = orientation[2];
	rotator.updateRotMtx();
}