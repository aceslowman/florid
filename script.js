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
  console.log("TXT", state.txtArray);
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

document.querySelector(".MAININPUT").addEventListener("keyup", e => {
  // enable audio if not already enabled
  if (Tone.Transport.state !== "started") {
    startSynth();
  }

  if (e.target.value === "") Tone.Transport.stop();

  console.log("event", e.target.value);

  state.txtArray = e.target.value.split(/\r?\n/).map(e => e.split(" "));
  // parse lines and units
  console.log("TXT", state.txtArray);
});

// setup basic synth
function startSynth() {
  // synth.triggerAttackRelease("C4", "8n");

  // Tone.Transport.bpm.value = state.bpm;

  const loopA = new Tone.Loop(time => {
    synth.triggerAttackRelease("C2", "8n", time);
  }, "4n").start(0);

  console.log("starting audio context");
  Tone.Transport.start();
}

const synth = new Tone.Synth().toDestination();

document.querySelector(".tempoInput").addEventListener("change", e => {
  console.log(e.target.value);
  Tone.Transport.bpm.value = state.bpm;
});
