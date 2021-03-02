/* global Tone, ReactDOM, React */
const App = () => {
  let [melody, setMelody] = React.useState([
    ["B4", "A#4", "E4", "F4"],
    ["B4", "A#4", "E4", "F4"]
  ]);
  
  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(1);

  let [selectedNote, setSelectedNote] = React.useState(null);
  let [midiInputs, setMidiInputs] = React.useState(null);
  let [midiOutputs, setMidiOutputs] = React.useState(null);
  
  const synth = new Tone.Synth().toDestination();
  let sequence;

  React.useEffect(() => {
    const initMIDI = async () => {
      if (!midiInputs || !midiOutputs) {
        await navigator.requestMIDIAccess().then(access => {
          // Get lists of available MIDI controllers
          const inputs = access.inputs.values();
          const outputs = access.outputs.values();111

          setMidiInputs([...inputs]);
          setMidiOutputs([...outputs]);

          access.onstatechange = function(e) {
            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
          };
        });
      }
    };

    initMIDI();
  }, [midiInputs, midiOutputs]);
  
  React.useEffect(() => {
    if(sequence) {
      sequence.clear();
      sequence.cancel();
      sequence.stop();
    }
    
    console.log(melody)
    
    // set up toneJS to repeat melody in sequence
    sequence = new Tone.Sequence((time, note) => {      
      synth.triggerAttackRelease(note, 0.1, time);
    }, melody, "4n").start(0);
    
    Tone.Transport.start();
  }, [melody])

  function handleLoopToggle(e) {
    sequence.loop = !loop;
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
    let currentNote = melody[measure_id][note_id];
    let newMelody = [...melody];

    switch (e.keyCode) {
      case 37: // left
        // shift focus to prev element
        break;
      case 38: // up
        newMelody[measure_id][note_id] = Tone.Frequency(currentNote)
          .transpose(1)
          .toNote();
        break;
      case 40: // down
        newMelody[measure_id][note_id] = Tone.Frequency(currentNote)
          .transpose(-1)
          .toNote();
        break;
      case 41: // right
        // shift focus to next element
        break;
      default:
        break;
    }

    setMelody(newMelody);
  }

  const handleMidiInputChange = e => {
    console.log("input", e.target.value);
    let device_id = e.target.value;
    
    // set input/output
  }

  const handleMidiOutputChange = e => {
    console.log("output", e.target.value);
    let device_id = e.target.value;
    
    // set input/output
  }
  
  const handlePressPlay = e => {
console.log('i')
    Tone.start();
  }

  return (
    <React.Fragment>
      <Settings
        midiInputs={midiInputs}
        midiOutputs={midiOutputs}
        onPressPlay={handlePressPlay}
        onMidiInputChange={handleMidiInputChange}
        onMidiOutputChange={handleMidiOutputChange}
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
