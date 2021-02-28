/* global Tone, ReactDOM, React */
const App = () => {  
  let synth = new Tone.Synth().toDestination();
  let part;
  
  let [melody, setMelody] = React.useState([])

  let state = {
    melody: []
  };
  function restartSynth() {
    if (part) part.stop();

    let events = getPartFromText();

    // use an array of objects as long as the object has a "time" attribute
    part = new Tone.Part((time, value) => {
      // the value is an object which contains both the note and the velocity
      synth.triggerAttackRelease(
        value.note,
        "8n",
        // value.duration,
        time,
        value.velocity
      );
    }, events).start(0);

    part.loop = true;
    // make sure loopEnd is the full length of the parts
    // console.log('LOOP END', )
    part.loopEnd =
      events[events.length - 1].time +
      Tone.Time(events[events.length - 1].duration).toSeconds();

    Tone.Transport.start();

    console.log("loopStart", part.loopStart);
    console.log("loopEnd", part.loopEnd);
  }

  function getPartFromText() {
    console.group();
    let isLineEnd,
      isWordEnd = false;

    let partArray = [];
    let iter = 0;

    let qTime = Tone.Time("4n").toSeconds();

    // get part from text
    state.txtArray.forEach((line, l_i) => {
      line.forEach((word, w_i) => {
        word.split("").forEach((unit, u_i) => {
          let unitTime = qTime * iter;
          let duration = unit === "." ? "8n" : "4n";
          let note = unit === "." ? "C3" : "C4";
          let velocity = unit === "." ? 0.5 : 1.0;

          // scale base time
          // time 1/= 4;

          // hold for end of line
          if (isLineEnd && isWordEnd) {
            console.log("holding at end of line", unit);
            unitTime += state.pauseAfterLine * qTime;
            // duration = "1m";
          } else if (isWordEnd) {
            // hold for end of word
            console.log("holding at end of word...", unit);
            unitTime += state.pauseAfterWord * qTime;
          }

          partArray.push({
            time: unitTime,
            duration: "8n",
            // duration: duration,
            note: note,
            velocity: velocity
          });

          iter++;

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
  
  function handleLoopToggle(e) {
    
  }  

  function handleNumBarsChange(e) {
    // state.pauseAfterWord = e.target.value;
    // restartSynth();
  }
  
  function handleBPMChange(e) {
    Tone.Transport.bpm.value = parseFloat(e.target.value);
  }  

  return (
    <React.Fragment>
      <Settings 
        onToggleLoop={handleLoopToggle}  
        onNumBarsChange={handleNumBarsChange}
        onChangeBPM={handleBPMChange}
      />
      <MusicStaff />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
