class TonePlayer {
  constructor() {
    const bpm = 220;
    Tone.Transport.bpm.value = bpm;
    // this.synth = new Tone.PluckSynth().toMaster();
    this.synth = new Tone.Synth().toMaster();
    this.polySynth = new Tone.PolySynth(60, Tone.Synth).toMaster();

    //set the transport to repeat
    // Tone.Transport.loopEnd = '1m'
    // Tone.Transport.loop = true

    // Tone.Transport.start('+0.1');
  }

  playNote(note = "C4", duration = "8n") {
    // Tone.Transport.schedule(this.noteFnFactory('C1'), 0);
    //play a middle 'C' for the duration of an 8th note
    this.synth.triggerAttackRelease(note, duration);
  }

  playPoly(arrOfNotes, duration = "8n") {
    this.polySynth.triggerAttackRelease(arrOfNotes);
  }

  noteFnFactory(noteStr, duration = '8n') {
    return function (time) {
      this.synth.triggerAttackRelease(noteStr, duration, time);
    }
  }

  convertNumToDuration(num, maxNum) {
    const maxDuration = 2;  // max time to hold a note
    const durationPerNum = maxDuration / maxNum;
    return Math.round(durationPerNum * num * 100) / 100;
  }

  convertNumToNote(num) {
    let numNotes = 3;
    let dividend = num / 3; // This is the octave?
    dividend = Math.round(dividend);
    dividend += 2;  // Start at the second octave
    let mod = num % 3;  // This is the note

    let note;
    if (mod === 0) {
      note = 'A' + dividend;
    } else if (mod === 1) {
      note = 'B' + dividend;
    } else if (mod === 2) {
      note = 'C' + dividend;
    }
    return note;
  }

  oscillatorTest(freqVal = "C4", duration = "+8n") {
    var osc = new Tone.OmniOscillator();
    osc.frequency.value = freqVal;
    // osc.phase = 200;
    osc.start().stop(duration);

    var env = new Tone.AmplitudeEnvelope();
    osc.connect(env);
    env.toMaster();

    osc.start();
    env.triggerAttackRelease();
  }
}


// doStuff();

function doStuff() {
  // helloTone();
  oscillatorTest();

  // setInterval(helloTone, 125);

  // checkCs(220);
}

function helloTone() {
  //create a synth and connect it to the master output (your speakers)
  var synth = new Tone.Synth().toMaster();

  //play a middle 'C' for the duration of an 8th note
  synth.triggerAttackRelease("C4", "8n");
  // synth.triggerAttackRelease("C4", "8n");
}

function checkCs(bpm) {
  var synth = new Tone.PluckSynth().toMaster()

  //this function is called right before the scheduled time
  // function triggerSynth(time) {
  //   //the time is the sample-accurate time of the event
  //   synth.triggerAttackRelease('C2', '8n', time)
  // }

  function noteFnFactory(noteStr, duration = '8n') {
    return function (time) {
      synth.triggerAttackRelease(noteStr, duration, time);
    }
  }

  // Set bpm
  Tone.Transport.bpm.value = bpm;

  //schedule a few notes
  Tone.Transport.schedule(noteFnFactory('C1'), 0)
  Tone.Transport.schedule(noteFnFactory('C2'), '0:2')
  // Tone.Transport.schedule(triggerSynth, '0:2:2.5')
  Tone.Transport.schedule(noteFnFactory('C3'), '0:4')

  //set the transport to repeat
  Tone.Transport.loopEnd = '1m'
  Tone.Transport.loop = true

  Tone.Transport.start('+0.1');

  // //start/stop the transport
  // document.querySelector('.playToggle').addEventListener('change', function (e) {
  //   if (e.target.checked) {
  //     Tone.Transport.start('+0.1')
  //   } else {
  //     Tone.Transport.stop()
  //   }
  // })
}

function oscillatorTest() {
  var osc = new Tone.OmniOscillator();
  osc.frequency.value = "C4";
  osc.phase = 200;
  osc.start().stop("+8n");

  var env = new Tone.AmplitudeEnvelope();
  osc.connect(env);
  env.toMaster();

  osc.start();
  env.triggerAttack();  // Keeps going
}

function playNotes(noteStr) {

}

function keyboard() {
  var synth = new Tone.Synth({
    "oscillator": {
      "type": "amtriangle",
      "harmonicity": 0.5,
      "modulationType": "sine"
    },
    "envelope": {
      "attackCurve": 'exponential',
      "attack": 0.05,
      "decay": 0.2,
      "sustain": 0.2,
      "release": 1.5,
    },
    "portamento": 0.05
  }).toMaster();

  var keyboard = Interface.Keyboard();
  keyboard.keyDown = function (note) {
    synth.triggerAttack(note);
  };
  keyboard.keyUp = function () {
    synth.triggerRelease();
  };
}
