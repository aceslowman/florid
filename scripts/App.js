/* global Tone, ReactDOM, React */
const App = () => {  
  let synth = new Tone.Synth().toDestination();
  let seq;
  
  let [melody, setMelody] = React.useState([["F4","A4","C4","E4"]]);
  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(1);
  
  function restartSynth() {
    if (seq) seq.stop();

    let events = getPartFromText();

    // use an array of objects as long as the object has a "time" attribute
    seq = new Tone.Part((time, value) => {
      // the value is an object which contains both the note and the velocity
      synth.triggerAttackRelease(
        value.note,
        "8n",
        // value.duration,
        time,
        value.velocity
      );
    }, events).start(0);

    seq.loop = true;
    // make sure loopEnd is the full length of the parts
    // console.log('LOOP END', )
    seq.loopEnd =
      events[events.length - 1].time +
      Tone.Time(events[events.length - 1].duration).toSeconds();

    Tone.Transport.start();

    console.log("loopStart", seq.loopStart);
    console.log("loopEnd", seq.loopEnd);
  }
  
  function handleLoopToggle(e) {
    seq.loop = !loop;
    setLoop(prev => !prev);
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
      <MusicStaff 
        melody={melody}
      />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
