/* global Tone, ReactDOM, React */
const App = () => {
  let synth = new Tone.Synth().toDestination();
  let seq;

  let [melody, setMelody] = React.useState([["B4", "A#4", "E4", "F4"], ["B4", "A#4", "E4", "F4"]]);
  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(1);

  let [selectedNote, setSelectedNote] = React.useState(null);

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
    let currentNote = melody[measure_id][note_id];
    let newMelody = [...melody];

    switch (e.keyCode) {
      case 37: // left
        // shift focus to prevp element
        break;
      case 38: // up
        newMelody[measure_id][note_id] = Tone.Frequency(currentNote)
          .transpose(1)
          .toNote();
        console.log(
          `shift ${currentNote} note up to ${newMelody[measure_id][note_id]}`
        );
        // let
        break;
      case 40: // down
        newMelody[measure_id][note_id] = Tone.Frequency(currentNote)
          .transpose(-1)
          .toNote();
        console.log(
          `shift ${currentNote} note down to ${newMelody[measure_id][note_id]}`
        );
        break;
      case 41: // right
        // shift focus to next element
        break;
      default:
        break;
    }

    setMelody(newMelody);
  }

  return (
    <React.Fragment>
      <Settings
        onToggleLoop={handleLoopToggle}
        onNumBarsChange={handleNumBarsChange}
        onChangeBPM={handleBPMChange}
      />
      <MusicStaff melody={melody} onNoteChange={handleNoteChange} />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
