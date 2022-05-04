
//const listener = audioContext.listener;
//const audioBuffer = audioContext.createBuffer(document.getElementById("SoundAmbi"));
//const splitter = audioContext.createChannelSplitter();

// var xhr = new XMLHttpRequest();
// console.log(document.getElementById('SoundAmbi').src)
// xhr.open('GET', document.getElementById('SoundAmbi').src, true);
// xhr.responseType = "arraybuffer";
// xhr.onload = function() {
//   var cx = new AudioContext() ;
//   cx.decodeAudioData(xhr.response, function(decodedBuffer) {
//     console.log(decodedBuffer.numberOfChannels);
//   });
// }
// xhr.send(null);


//const buffer = audioContext.createBuffer(1, audioContext.sampleRate*1, audioContext.sampleRate);

function Audio1(source) {
	console.log("Audio1");
	//listener.setPosition(0, 0, 0);


	//buffer.connect(encoder.in);
	encoder.out.connect(rotator.in);
	rotator.out.connect(binDecoder.in);
	binDecoder.out.connect(space);
	space.connect(audioContext.destination)
	// console.log(mirror)
	// console.log(encoder)
	// console.log(binDecoder)
	// console.log(rotator)
	console.log(source)
	var mediaSource = audioContext.createMediaElementSource(source);
	console.log(mediaSource.src)
	gainControl.connect(encoder.in)
	mediaSource.connect(gainControl);
	source.play()
	//splitter.numberOfOutputs = 25
	//splitter.channelCount = 25


	// getData(document.getElementById("SoundAmbi").src)



// var xhr = new XMLHttpRequest();
// console.log(document.getElementById('SoundAmbi').src)
// xhr.open('GET', document.getElementById('SoundAmbi').src, true);
// xhr.responseType = "arraybuffer";
// 	xhr.onload = function() {
//   audioContext.decodeAudioData(xhr.response, function(decodedBuffer) {
//     console.log(decodedBuffer.numberOfChannels);
//   });
// }
//   xhr.send(null)



	orientation = [0, 0, 0]
	position = [0, 0]

}


// function getData( currSource ) {

//   sourcea = audioCxt.createBufferSource();  
//   var request = new XMLHttpRequest();
//   request.open('GET', currSource , true);  //for example 'sample.ogg'
//   request.responseType = 'arraybuffer';

//   request.onload = function() {
//     var audioData = request.response;

//     audioCxt.decodeAudioData(audioData, function(buffer) {
//         sourcea.buffer = buffer;
        
//         console.log('detected '+buffer.numberOfChannels+' audio channels in the selected file');
//         }, //end succes        
      
//         function(e){
//           console.log('error: '+e); //log error
//         }
        
//         ).catch(error => {
//             console.log('failed');
//         });
          
//       }//end request loaded
//   request.send();
// }



//fonction permettant d'update la position des sources sonores

function UpdatePos(i, pos){
	position[i] = -pos
	encoder.azim = position[0];
	encoder.elev = position[1];
	encoder.updateGains();
	document.getElementById("DispSoundPlace"+i).value = pos;
}

function UpdateOr(i, or){
	//listener.setOrientation(Math.cos((or-90)*Math.PI/180), 0, Math.sin((or-90)*Math.PI/180), 0, 1, 0);
	document.getElementById("DispSoundOr"+i).value = or;
	orientation[i] = -or;
	rotator.yaw = orientation[0];
	rotator.pitch = orientation[1];
	rotator.roll = orientation[2];
	rotator.updateRotMtx();
	console.log(rotator);
}