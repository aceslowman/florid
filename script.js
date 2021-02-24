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
  document.querySelector(".tickIndicator").textContent = `tick: ${state.tick}`;
}, state.tempo);

// MAIN TEXT INPUT PARSING
function handleMainTextChange(e) {
  console.log("change", e.keyCode);
  // disallow anything that isn't a dot, slash, new line, or space
  if (
    e.keyCode !== 190 &&
    e.keyCode !== 191 &&
    e.keyCode !== 13 &&
    e.keyCode !== 32
  ) {
    e.preventDefault();
  } else {
    state.txtArray = e.target.value.split(/\r?\n/).map(e => e.split(" "));
    // parse lines and units
    console.log("TXT", state.txtArray);
  }
}

document
  .querySelector(".MAININPUT")
  .addEventListener("keyup", handleMainTextChange);
