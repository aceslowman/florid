/* global Tone, ReactDOM, React */
const App = () => {  
  let synth = new Tone.Synth().toDestination();
  let seq;
  
  let [melody, setMelody] = React.useState([["F4","A4","C4","E4"]]);
  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(1);
  
  let [selectedNote, setSelectedNote] = React.useState(null);
  
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
  
  function handleNoteChange(e, measure_id, note_id) {    
    console.log([e.keyCode, measure_id, note_id]);
    
    switch(e.keycode) {
      case 37: // left
        break;
      case 38: // up
        console.log('shift note up to')
        break;
      case 40: // down
        console.log('shift note down to')
        break;
      case 41: // right
        break;
      default:
        break
    }
    
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
        onNoteChange={handleNoteChange}
      />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
