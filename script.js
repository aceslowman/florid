// CENTERS MAININPUT TEXT
// https://stackoverflow.com/questions/4954252/css-textarea-that-expands-as-you-type-text
function updateSize(e) {
  let text = e.target.value + String.fromCharCode(event.keyCode);
  e.target.rows = text.split(/\r\n|\r|\n/).length;
}

function keyDownUpdateSize(e) {
  if (event.keyCode != 8 && event.keyCode != 46) updateSize(e);
}

function keyUpUpdateSize(e) {
  if (event.keyCode == 8 || event.keyCode == 46) updateSize(e);
}

document
  .querySelector(".MAININPUT")
  .addEventListener("keydown", keyDownUpdateSize);
document.querySelector(".MAININPUT").addEventListener("keyup", keyUpUpdateSize);

// SETTINGS TOGGLE
function toggleSettings() {
  let settingsPanel = document.querySelector(".SETTINGS");
  settingsPanel.style.width = settingsPanel.style.width === "0%" ? "28%" : "0%";
}

document
  .querySelector(".toggleSettings")
  .addEventListener("click", toggleSettings);

// DISPLAY TICKS AS THEY CHANGE
let state = {
  tick: 0,
  tempo: 120,
  pauseAfterLine: 0.5,
  txtArray: ""
};

document.querySelector(".tickIndicator").textContent = state.tick++;
document.querySelector(".tempoInput").value = state.tempo;
document.querySelector(".pauseInput").value = state.pauseAfterLine;

// MAIN TICK LOOP
setInterval(() => {
  state.tick += 1;
  const indicator = document.querySelector(".tickIndicator");
  indicator.textContent = `tick: ${state.tick}`;
}, state.tempo);

// MAIN TEXT INPUT PARSING
function handleMainTextChange(e) {
  state.txtArray = e.target.value.split(/\r?\n/).map(e => e.split(" "));

  // parse lines and units
  // console.log("TXT", state.txtArray);
}

document.querySelector(".MAININPUT").addEventListener("keydown", e => {
  // disallow anything that isn't a dot, slash, new line, space, or backspace
  console.log(e.keyCode);
  if (
    e.keyCode !== 190 &&
    e.keyCode !== 191 &&
    e.keyCode !== 13 &&
    e.keyCode !== 32 &&
    e.keyCode !== 8
  ) {
    e.preventDefault();
  }
});

let synth, part;

document.querySelector(".MAININPUT").addEventListener("keyup", async e => {
  // parse lines and units
  state.txtArray = e.target.value.split(/\r?\n/).map(e => e.split(" "));

  // enable audio if not already enabled
  if (Tone.Transport.state !== "started") {
    await Tone.start();
    restartSynth();
  } else {
    // update part with new text!
    console.log(part)
    part.remove();
    getPartFromText().forEach(e => {
      part.add(e);
    });
  }

  if (e.target.value === "") Tone.Transport.stop();
});

// setup basic synth
function restartSynth() {
  synth = new Tone.Synth().toDestination();

  // use an array of objects as long as the object has a "time" attribute
  part = new Tone.Part((time, value) => {
    // the value is an object which contains both the note and the velocity
    synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
  }, getPartFromText()).start(0);

  part.loop = true;

  console.log("restarting audio context");
  Tone.Transport.stop();
  Tone.Transport.start();
  Tone.Transport.bpm.value = parseFloat(state.tempo);
}

function getPartFromText() {
  let partArray = [];
  let iter = 0;
  // get part from text
  state.txtArray.forEach((line, l_i) => {
    line.forEach((word, w_i) => {
      console.log("word", word);   
      word.split('').forEach((unit, u_i) => {
        partArray.push({
          time: 0 + iter / 4.0,
          note: unit === "." ? "C3" : "C4",
          velocity: unit === "." ? 0.5 : 1.0
        });
        iter++;
      })      
    });
  });
  
  console.log('partarray', partArray)

  return partArray;
}

document.querySelector(".tempoInput").addEventListener("change", e => {
  state.tempo = e.target.value;
  Tone.Transport.bpm.value = parseFloat(state.tempo);
});
