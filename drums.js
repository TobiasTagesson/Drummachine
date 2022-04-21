const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 1, audioCtx.sampleRate);
const pads = document.querySelectorAll('.pads');
const allPadButtons = document.querySelectorAll('#tracks button');

// switch aria attribute on click
allPadButtons.forEach(el => {
  el.addEventListener('click', () => {
    if (el.getAttribute('aria-checked') === 'false') {
      el.setAttribute('aria-checked', 'true');
    } else {
      el.setAttribute('aria-checked', 'false');
    }
  }, false)
})

const channelData = buffer.getChannelData(0);
for (let i = 0; i < buffer.length; i++) {
    channelData[i] = Math.random() * 2 - 1;
};

let wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);

let tomPitch = 400;
const tomPitchControl = document.querySelector('#tompitch');

    tomPitchControl.addEventListener('input', function() {
        tomPitch = Number(this.value);
    })

function playTom() {
    const tomOscillator = audioCtx.createOscillator();
    
    tomOscillator.frequency.setValueAtTime(tomPitch, 0);
    tomOscillator.frequency.exponentialRampToValueAtTime(
        0.6,
        audioCtx.currentTime + 1
    );

    const tomGain = audioCtx.createGain();
    tomGain.gain.setValueAtTime(1, 0);
    tomGain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.4
    );

    // const delay= audioCtx.createDelay();
    // delay.delayTime.value = 0.3;
    // tomOscillator.connect(delay);
    // delay.connect(audioCtx.destination);

    tomOscillator.connect(tomGain);
    tomGain.connect(audioCtx.destination);
    tomOscillator.start();
    tomOscillator.stop(audioCtx.currentTime + 0.5)
}

const hihatFilter = audioCtx.createBiquadFilter();
    hihatFilter.type = "highpass";
    hihatFilter.frequency.value = "5000";
    hihatFilter.connect(audioCtx.destination);

    let hihatOpenLength = 0.7;
    const hihatOpenLengthControl = document.querySelector('#hihatopenlength');
    hihatOpenLengthControl.addEventListener('input', function() {
        hihatOpenLength = Number(this.value);
    })

    let hihatLength = 0.1;
    const hihatLengthControl = document.querySelector('#hihatlength');
    hihatLengthControl.addEventListener('input', function() {
        hihatLength = Number(this.value);
    })

    function playHihatOpen() {
   
        const whiteNoiseSource = audioCtx.createBufferSource();
        whiteNoiseSource.buffer = buffer;
    
        const whiteNoiseGain = audioCtx.createGain();
        whiteNoiseGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        whiteNoiseGain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + hihatOpenLength
        );
        whiteNoiseSource.connect(whiteNoiseGain);
        whiteNoiseGain.connect(hihatFilter);
    
        whiteNoiseSource.start();
        whiteNoiseSource.stop(audioCtx.currentTime + hihatOpenLength);
    }

function playHihat() {
   
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    const whiteNoiseGain = audioCtx.createGain();
    whiteNoiseGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + hihatLength
    );
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(hihatFilter);

    whiteNoiseSource.start();
    whiteNoiseSource.stop(audioCtx.currentTime + hihatLength);
}

    const snareFilter = audioCtx.createBiquadFilter();
    snareFilter.type = "highpass";
    snareFilter.frequency.value = "1500";
    snareFilter.connect(audioCtx.destination);
    
    let snarePitch = 100;
    const snarePitchControl = document.querySelector('#snarepitch');
    snarePitchControl.addEventListener('input', function() {
        snarePitch = Number(this.value);
    })

function playSnare() {
    const whiteNoiseSource = audioCtx.createBufferSource();
    whiteNoiseSource.buffer = buffer;

    const whiteNoiseGain = audioCtx.createGain();
    whiteNoiseGain.gain.setValueAtTime(1, audioCtx.currentTime);
    whiteNoiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.2
    );
    whiteNoiseSource.connect(whiteNoiseGain);
    whiteNoiseGain.connect(snareFilter);

    whiteNoiseSource.start();
    whiteNoiseSource.stop(audioCtx.currentTime + 0.2);

    const snareOscillator = audioCtx.createOscillator();
    snareOscillator.type = "triangle";
    snareOscillator.frequency.setValueAtTime(snarePitch, audioCtx.currentTime);

    const oscillatorGain = audioCtx.createGain();
    oscillatorGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
    snareOscillator.connect(oscillatorGain);
    oscillatorGain.connect(audioCtx.destination);
    snareOscillator.start();
    snareOscillator.stop(audioCtx.currentTime + 0.2);

}


let kickPitch = 150;
const kickPitchControl = document.querySelector('#kickpitch')
kickPitchControl.addEventListener('input', function() {
    kickPitch = Number(this.value);
})
function playKick() {
    const kickOscillator = audioCtx.createOscillator();
    
    kickOscillator.frequency.setValueAtTime(kickPitch, 0);
    kickOscillator.frequency.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.5
    );

    const kickGain = audioCtx.createGain();
    kickGain.gain.setValueAtTime(1, 0);
    kickGain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.5
    );
    kickOscillator.connect(kickGain);
    kickGain.connect(audioCtx.destination);
    kickOscillator.start();
    kickOscillator.stop(audioCtx.currentTime + 0.5)
}

async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

// let playbackRate = 1;
// const rateControl = document.querySelector('#rate');
// rateControl.addEventListener('input', function() {
//     playbackRate = Number(this.value);
// }, false);

function playSample(audioContext, audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);
    sampleSource.connect(audioContext.destination);
    sampleSource.start();
    return sampleSource;
}

async function setupSample() {
    const filePath = 'Linn clap.wav'; // path till sampling
    const sample = await getFile(audioCtx, filePath);
    return sample;
}


let tempo = 120.0;
const bpmControl = document.querySelector('#bpm');
bpmControl.addEventListener('input', function() {
    tempo = Number(this.value);
}, false);

let lookahead = 25.0;
let scheduleAheadTime = 0.1;

let currentNote = 0;
let nextNoteTime = 0.0;
let beatLength = 8;
function nextNote() {
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += secondsPerBeat / 2;
    currentNote++;
    if(currentNote == beatLength){ // längden på beatet
        currentNote = 0;
    }
}

const notesInQueue = [];
let sampleSound;
function scheduleNote(beatNumber, time) {
    notesInQueue.push({note: beatNumber, time: time });
    if(pads[0].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true' ) {
        playTom();
    }
    if(pads[1].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true' ) {
      playHihatOpen();
    }
    if(pads[2].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true' ) {
        playHihat();
    }
    if(pads[3].querySelectorAll('button')[currentNote].getAttribute('aria-checked') === 'true' ) {
        playSnare();
    }
    if(pads[4].querySelectorAll('button')[currentNote].getAttribute('aria-checked') ==='true'){
        playKick();
    }
}

let timerID;
function scheduler() {
    while(nextNoteTime <audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

let lastNoteDrawn = 3;

function draw() {
    let drawNote = lastNoteDrawn;
    let currentTime = audioCtx.currentTime;

    while(notesInQueue.length && notesInQueue[0].time < currentTime) {
        drawNote = notesInQueue[0].note;
        notesInQueue.splice(0, 1);
    }

    if (lastNoteDrawn != drawNote) {
        pads.forEach(function(el, i) {
            el.children[lastNoteDrawn].style.borderColor = 'hsla(0, 0%, 10%, 1)';
            el.children[drawNote].style.borderColor = 'hsla(49, 99%, 50%, 1)';
        });

        lastNoteDrawn = drawNote;
    }
    requestAnimationFrame(draw);
}

let loadingEl = document.querySelector('.loading');
const playButton = document.querySelector('[data-playing]');
let isPlaying = false;
setupSample()
    .then((sample) => {
        loadingEl.style.display = 'none';
        sampleSound = sample;
        playButton.addEventListener('click', function() {
            isPlaying = !isPlaying;

            if(isPlaying)
            {
                if(audioCtx.state === 'suspended') {

                    audioCtx.resume();
                }

                currentNote = 0;
                nextNoteTime = audioCtx.currentTime;
                scheduler();
                requestAnimationFrame(draw);
                this.dataset.playing = 'true';
            }
            else {
                window.clearTimeout(timerID);
                this.dataset.playing = 'false';
            }

        })

    })

