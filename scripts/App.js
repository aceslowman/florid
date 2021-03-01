/* global Tone, ReactDOM, React */
const App = () => {  
  let synth = new Tone.Synth().toDestination();
  let seq;
  
  let [melody, setMelody] = React.useState([["F4","A4","C4","E4"]]);
  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(1);
  
  let [selectedNote, setSelectedNote] = React.useState(null);
  
  function getNoteInMelody(measure_id) {
    return "A0"
  }
  
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
    let currentNote = getNoteInMelody(measure_id, note_id);
    let newNote;
    
    switch(e.keyCode) {
      case 37: // left
        // shift focus to prevp element
        break;
      case 38: // up
        newNote = Tone.Frequency(currentNote).transpose(1).toNote();
        console.log(`shift ${currentNote} note up to ${newNote}`)
        // let 
        break;
      case 40: // down
        newNote = Tone.Frequency(currentNote).transpose(-1).toNote();
        console.log(`shift ${currentNote} note down to ${newNote}`)
        break;
      case 41: // right
        // shift focus to next element
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
