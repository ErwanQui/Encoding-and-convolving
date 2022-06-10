const audioContext = new AudioContext();

// Instanciation des différntes variables

var order = 3;
var audioChoice = "Audio1";
var source;
var soundBuffer;
var posRIRs;

// Initialisation des différentes sources liées aux RIRs

// const UrlRIR1 = 'rir-test/room_2.wav';
// const UrlRIR2 = 'rir-test/room_3.wav';
// const UrlRIR3 = 'rir-test/room_4.wav';

// const UrlRIR1 = "steliz_octamic_m01_s5a_bin.wav";
// const UrlRIR2 = "steliz_octamic_m01_s3a_bin.wav";
// const UrlRIR3 = "steliz_octamic_m01_s4a_bin.wav";

// const UrlRIR = [UrlRIR1, UrlRIR2, UrlRIR3];

// Initialisation des différents gains liés aux RIRs

// var coefRIR1 = audioContext.createGain();
// var coefRIR2 = audioContext.createGain();
// var coefRIR3 = audioContext.createGain();

// var coefRIR = [coefRIR1, coefRIR2, coefRIR3];

// Création des noeuds principaux de l'audio

var sound = audioContext.createBufferSource();
var	mirror = new ambisonics.sceneMirror(audioContext, order);
var	rotator = new ambisonics.sceneRotator(audioContext, order);
var	binDecoder = new ambisonics.binDecoder(audioContext, order);
var	encoder = new ambisonics.monoEncoder(audioContext, order);
var space = audioContext.createPanner();
var gainControl = audioContext.createGain();

// Création des convolvers et des loaders associés

var hoa_loader_conv = [];
var convolver = [];
var hoa_assignFiltersOnLoad3 = [];


// for (let i = 0; i < 3; i++) {
// 	hoa_assignFiltersOnLoad3.push(function(buffer) { convolver[i].updateFilters(buffer); });
// 	convolver.push(new ambisonics.convolver(audioContext, order));
// 	hoa_loader_conv.push(new ambisonics.HOAloader(audioContext, order, UrlRIR[i], hoa_assignFiltersOnLoad3[i]));
// }

// Instanciation de booléens liés au chargement ou non des différentes RIRs

// var loadRIR1 = true;
// var loadRIR2 = false;
// var loadRIR3 = false;

// Assignement des objets htmls récurrents dans des variables

var BeginButton = document.getElementsByClassName("BeginButton")[0];
var BeginElem = document.getElementsByClassName("Begin")[0];
var Common = document.getElementsByClassName("Common")[0];
var FileChoice = document.getElementById("File");
var Track = document.getElementById("ProvideTrack");
var Valid = document.getElementById("Valid");
var Place = document.getElementsByClassName("Place")[0];
// var Interpolation = document.getElementsByClassName("Interpolation")[0];
var Audio = document.getElementById("ProvidedAudio");

// classe pour la source audio, pas spécialement nécessaire mais crée pour le fun

class sourceObject {

    constructor(type, name) {

        this.type = type;
        this.name = name;
    }
}

// fonction de lancement du projet : affiche l'interface, lance l'audio, fait les connexions initiales et crée les objets

function Begin() {

	audioContext.resume();

	BeginButton.style.visibility = "hidden";
	BeginButton.style.position = "absolute";
	BeginElem.style.visibility = "visible";
	BeginElem.style.position = "relative";
	// Interpolation.style.visibility = "hidden";
	// Interpolation.style.position = "absolute";

	gainControl.gain.setValueAtTime(0.5, 0);

	// sound.connect(encoder.in);
	// encoder.out.connect(mirror.in);
	sound.connect(mirror.in);
	mirror.out.connect(rotator.in);
	rotator.out.connect(binDecoder.in);
	// sound.connect(binDecoder.in);
	binDecoder.out.connect(space);
	space.connect(gainControl);
	gainControl.connect(audioContext.destination);

	position = [0, 0]
	orientation = [0, 0, 0]
}

// // fonction permettant de switcher entre les deux modes, elle change les connections et les éléments afficher à l'écran

// function Choice(value) {
// 	audioChoice = "Audio"+value;

// 	if (value == 4) {
// 		Place.style.visibility = "hidden";
// 		Place.style.position = "absolute";
// 		Interpolation.style.visibility = "";
// 		Interpolation.style.position = "";

// 		document.getElementById("Demo1").disabled = false;
// 		document.getElementById("Demo4").disabled = true;

// 		// sound.disconnect(encoder.in);
// 		// encoder.out.disconnect(mirror.in);
// 		sound.disconnect(mirror.in);
// 		binDecoder.out.disconnect(space);

// 		for (let i = 0; i < 3; i++) {
// 			sound.connect(coefRIR[i]);
// 			coefRIR[i].connect(convolver[i].in);
// 			convolver[i].out.connect(mirror.in);
// 		}
// 		binDecoder.out.connect(gainControl);
// 	}
// 	else {
// 		Place.style.visibility = "";
// 		Place.style.position = "";
// 		Interpolation.style.visibility = "hidden";
// 		Interpolation.style.position = "absolute";

// 		document.getElementById("Demo1").disabled = true;
// 		document.getElementById("Demo4").disabled = false;

// 		// sound.connect(encoder.in);
// 		// encoder.out.connect(mirror.in);
// 		sound.connect(mirror.in);
// 		binDecoder.out.connect(space);

// 		for (let i = 0; i < 3; i++) {
// 			sound.disconnect(coefRIR[i]);
// 			coefRIR[i].disconnect(convolver[i].in);
// 			convolver[i].out.disconnect(mirror.in);
// 		}
// 		binDecoder.out.disconnect(gainControl);
// 	}
// }

// fonction vérifiant qu'un fichier a bien été choisi et activant le bouton pour lancer la suite

function Verify(file) {
	if (file) {
		Valid.disabled = false;
		Track.disabled = true;
		source = file;
	}
	else {
		Valid.disabled = true;
		Track.disabled = false;
		source = null;
	}
}

// fonction instanciant l'audio à partir du fichier fourni, lorsqu'activation de la checkbox

function AudioBuild(value) {
	if (value) {
		Valid.disabled = false;
		FileChoice.disabled = true;
		source = new sourceObject("audio/wav", "Audio/4 Audio Track.wav");
	}
	else {
		Valid.disabled = true;
		FileChoice.disabled = false;
		source = null;
	}
}

// fonction appelée lors de l'appui sur le bouton valider, lance le début de la simulation audio

function Validate() {
	if (source) {
		document.getElementsByClassName("Choice")[0].style.visibility = "hidden";
		document.getElementsByClassName("Choice")[0].style.position = "absolute";
		AudioBegin(source);
	}
	else {
		console.log("bah aucun fichier n'a été choisi en fait")
	}
}

// function to load samples
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    console.log(fetchSound)
    fetchSound.onload = function() {
    	console.log(fetchSound.response)
        // audioContext.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
        var HOA3loader = new ambisonics.HOAloader(audioContext, order, url, doAfterLoading);
        HOA3loader.load();

    }
    fetchSound.send();
}

function onDecodeAudioDataError()  {
	console.log("turbo échec");
}

// fonction initialisant l'audio à jouer et le premier filtre à appliquer, elle affiche aussi l'ensemble des paramètres modifiables

function AudioBegin(source) {
	Common.style.visibility = "visible"
	Common.style.position = "relative";

	var assignSample2SoundBuffer = function(decodedBuffer) {
		soundBuffer = decodedBuffer;
		Playing(1);
	}
	loadSample(("Audio/" + source.name), assignSample2SoundBuffer);

	// hoa_loader_conv[0].load();

	sound.type = source.type;
	sound.src = source.name;
}

// fonction appelée par AudioBegin, initiallisant les paramètres de la source sonore

function Playing(inc) {
	sound.loop = true;
	sound.buffer = soundBuffer;
	sound.start(0);
	audioContext.suspend();
	sound.isPlaying = false;
}

// fonction permettant de jouer et mettre en pause le son

function PlayPause(object) {
	if (object.id == "Play") {
		audioContext.resume();
		sound.isPlaying = true;
		object.disabled = true;
		document.getElementById("Pause").disabled = false;
	}
	else {
		audioContext.suspend();
		sound.isPlaying = false;
		object.disabled = true;
		document.getElementById("Play").disabled = false;

	}
}

// fonction mettant à jour le volume et l'affichant

function DispVal(value) {
	document.getElementById("DispSoundValue").value = "Volume : " + value;
	gainControl.gain.setValueAtTime(value, 0);
}

// fonction mettant à jour la position de la provenance du son sur la sphère et l'affichant

function UpdatePos(i, pos){
	position[i] = -pos
	encoder.azim = position[0];
	encoder.elev = position[1];
	encoder.updateGains();
	document.getElementById("DispSoundPlace").value = "Azimut : " + position[0] + "°; Elevation : " + position[1] + "°;";
}

// fonction mettant à jour l'orientation et l'affichant

function UpdateOr(i, or){
	orientation[i] = or;
	rotator.yaw = orientation[0];
	rotator.pitch = orientation[1];
	rotator.roll = orientation[2];
	document.getElementById("DispSoundOr").value = "Lacet : " + orientation[0] + "°; Tangage : " + orientation[1] + "°; Roulis : " + orientation[2] + "°;";
	rotator.updateRotMtx();
}

// // fonction mettant à jour les gains associées au RIRs selon les valeurs d'entrée

// function SetRIRsValues(value1, value2, value3) {
// 	coefRIR[0].gain.setValueAtTime(value1/10, 0);
// 	coefRIR[1].gain.setValueAtTime(value2/10, 0);
// 	coefRIR[2].gain.setValueAtTime(value3/10, 0);
// }

// // fonction remplaçant les RIRs à décharger

// function ResetRIRs(id) {
// 	hoa_assignFiltersOnLoad3[id] = (function(buffer) { convolver[id].updateFilters(buffer); });
// 	hoa_loader_conv[id] = new ambisonics.HOAloader(audioContext, order, UrlRIR[id], hoa_assignFiltersOnLoad3[id]);
// }

// // fonction déterminant les RIRs à appliquer et les chargeant/supprimant au besoin, elle affiche aussi les différents RIRs appliqués

// function UpdateRIRs(value) {
// 	if (value < 10) {
// 		if (!loadRIR1) {
// 			hoa_loader_conv[0].load();
// 			loadRIR1 = !loadRIR1;
// 		}
// 		if (loadRIR3) {
// 			ResetRIRs(2);
// 			loadRIR3 = !loadRIR3;
// 		}
// 		if (value == 0) {
// 			posRIRs = "RIR1;";
// 			SetRIRsValues(10-value, 0, 0);
// 			if (loadRIR2) {
// 				ResetRIRs(1);
// 				loadRIR2 = !loadRIR2;
// 			}
// 		}
// 		else {
// 			if (!loadRIR2) {
// 				hoa_loader_conv[1].load();
// 				loadRIR2 = !loadRIR2;
// 			}
// 			posRIRs = (100-value*10) + " RIR1; " + (value*10) + " RIR2;";
// 			SetRIRsValues(10-value, value,0); 
// 		}
// 	}
// 	else {
// 		if (loadRIR1) {
// 			ResetRIRs(0);
// 			loadRIR1 = !loadRIR1;
// 		}
// 		if (value > 10){
// 			if (!loadRIR3) {
// 				hoa_loader_conv[2].load();
// 				loadRIR3 = !loadRIR3;
// 			}
// 			if (value == 20) {
// 				posRIRs = "RIR3;";
// 				SetRIRsValues(0, 0, value);
// 				if (loadRIR2) {
// 					ResetRIRs(1);
// 					loadRIR2 = !loadRIR2;
// 				}
// 			}
// 			else {
// 				if (!loadRIR2) {
// 					hoa_loader_conv[1].load();
// 					loadRIR2 = !loadRIR2;

// 				}
// 				posRIRs = (200-value*10) + " RIR2; " + (value*10-100) + " RIR3;";
// 				SetRIRsValues(0, 20-value, value-10);
// 			}
// 		}
// 		else {
// 			if (!loadRIR2) {
// 				hoa_loader_conv[1].load();
// 				loadRIR2 = !loadRIR2;
// 			}
// 			if (loadRIR3) {
// 				ResetRIRs(2);
// 				loadRIR3 = !loadRIR3;
// 			}
// 			posRIRs = "RIR2;";
// 			SetRIRsValues(0, value, 0);
// 		}
// 	}
// 	document.getElementById("DispInterpolation").value = posRIRs;
// }