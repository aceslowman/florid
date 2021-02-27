/* global Tone */

let part;
let synth = new Tone.Synth().toDestination();

// DISPLAY TICKS AS THEY CHANGE
let state = {
  pauseAfterLine: 0.5,
  txtArray: ""
};

document.querySelector(".tickIndicator").textContent = state.tick++;
document.querySelector(".tempoInput").value = 120;
document.querySelector(".pauseInput").value = state.pauseAfterLine;

async function handleMainTextChange(e) {
  // parse lines and units
  state.txtArray = e.target.value.split(/\r?\n/).map(e => e.split(" "));

  // enable audio if not already enabled
  if (Tone.Transport.state !== "started") {
    await Tone.start();
    restartSynth();
  } else {
    part.clear();

    getPartFromText().forEach(e => {
      part.add(e);
    });

    part.loop = true;
  }

  if (e.target.value === "") Tone.Transport.stop();
}

function filterUserInput(e) {
  // disallow anything that isn't a dot, slash, new line, space, or backspace
  if (
    e.keyCode !== 190 &&
    e.keyCode !== 191 &&
    e.keyCode !== 13 &&
    e.keyCode !== 32 &&
    e.keyCode !== 8
  ) {
    e.preventDefault();
  }
}

// setup basic synth
function restartSynth() {
  console.log("restarting audio context");
  // use an array of objects as long as the object has a "time" attribute
  part = new Tone.Part((time, value) => {
    // the value is an object which contains both the note and the velocity
    synth.triggerAttackRelease(
      value.note,
      value.duration,
      time,
      value.velocity
    );
  }, getPartFromText()).start(0);

  part.loop = true;

  Tone.Transport.start();
}

function getPartFromText() {
  let partArray = [];
  let baseTime = Tone.now();
  // get part from text
  state.txtArray.forEach((line, l_i) => {
    line.forEach((word, w_i) => {
      word.split("").forEach((unit, u_i) => {
        let unitTime = baseTime / 4;
        let duration = unit === "." ? "8n" : "4n";
        let note = unit === "." ? "C3" : "C4";
        let velocity = unit === "." ? 0.5 : 1.0;

        // scale base time
        // time 1/= 4;

        let isLineEnd = w_i === line.length - 1;
        let isWordEnd = u_i === word.split("").length - 1;

        // hold for end of line
        if (isLineEnd && isWordEnd) {
          console.log("holding at end of line", unit);
          // unitTime += 1;
        } else if (isWordEnd) {
          // hold for end of word
          console.log("holding at end of word...", unit);
          // unitTime += 0.25;
        }

        partArray.push({
          time: unitTime,
          duration: duration,
          note: note,
          velocity: velocity
        });

        baseTime++;
      });
    });
  });

  console.log("partarray", partArray);

  return partArray;
}

function onBPMChange(e) {
  Tone.Transport.bpm.value = parseFloat(e.target.value);
}

document
  .querySelector(".MAININPUT")
  .addEventListener("keydown", filterUserInput);

document
  .querySelector(".MAININPUT")
  .addEventListener("keyup", handleMainTextChange);

document.querySelector(".tempoInput")
  .addEventListener("change", onBPMChange);
