/* global Tone */
let synth = new Tone.Synth().toDestination();
let part;

let state = {
  pauseAfterLine: 0.5,
  pauseAfterWord: 0.25,
  txtArray: ""
};

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
  if (                   // allowed keys:
    e.keyCode !== 190 && // dot
    e.keyCode !== 191 && // slash
    e.keyCode !== 13 &&  // new line
    e.keyCode !== 32 &&  // space
    e.keyCode !== 8 &&   // backspace
    e.keyCode !== 37 &&  // left arrow
    e.keyCode !== 38 &&  // up arrow
    e.keyCode !== 39 &&  // right arrow
    e.keyCode !== 40 &&  // down arrow
    e.keyCode !== 16     // shift
  ) {
    e.preventDefault();
  }
}

function restartSynth() {
  if(part) part.stop();
  
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
  console.group()
  let isLineEnd, isWordEnd;
  
  let partArray = [];
  let baseTime = 0;
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


        // hold for end of line
        if (isLineEnd && isWordEnd) {
          console.log("holding at end of line", unit);
          unitTime += 0.25;
        } else if (isWordEnd) {
          // hold for end of word
          console.log("holding at end of word...", unit);
          unitTime += 0.15;
        }

        partArray.push({
          time: unitTime,
          duration: duration,
          note: note,
          velocity: velocity
        });

        baseTime++;
        
        // pause needs to apply to the NEXT note after the line or word
        isLineEnd = w_i === line.length - 1;
        isWordEnd = u_i === word.split("").length - 1;
      });
    });
  });

  console.log("partarray", partArray);
  console.groupEnd();

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

document.querySelector(".pauseLineInput")
  .addEventListener("change", handlePauseAfterLine);

document.querySelector(".pauseWordInput")
  .addEventListener("change", handlePauseAfterWord);

function handlePauseAfterLine(e) {
  state.pauseAfterLine = e.target.value;
}

function handlePauseAfterWord(e) {
  state.pauseAfterWord = e.target.value;
}




