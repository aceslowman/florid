/* global Tone, ReactDOM, React */
const App = () => {
  let [melody, setMelody] = React.useState([[]]);

  let [loop, setLoop] = React.useState(false);
  let [numBars, setNumBars] = React.useState(2);
  let [bpm, setBPM] = React.useState(120);
  let [selectedNote, setSelectedNote] = React.useState(null);
  let [midiInputs, setMidiInputs] = React.useState(null);
  let [midiOutputs, setMidiOutputs] = React.useState(null);
  let [activeMidiInput, setActiveMidiInput] = React.useState(null);
  let [activeMidiOutput, setActiveMidiOutput] = React.useState(null);
  let [currentStep, setCurrentStep] = React.useState(0);
  let [isPlaying, setIsPlaying] = React.useState(false);

  const synth = new Tone.Synth().toDestination();
  let sequence;

  /*
    set up keybindings
  */
  React.useEffect(() => {
    const keybindings = function(e) {
      switch (e.keyCode) {
        case 32: // space bar
          if (Tone.Transport.state === "started") {
            Tone.Transport.stop();
            setIsPlaying(false);
          } else {
            Tone.start();
            Tone.Transport.start();
            setIsPlaying(true);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", keybindings, false);
    return () => document.removeEventListener("keydown", keybindings, false);
  }, []);

  /*
    set up midi
  */
  React.useEffect(() => {
    const initMIDI = async () => {
      if (!midiInputs || !midiOutputs) {
        await navigator.requestMIDIAccess().then(access => {
          // Get lists of available MIDI controllers
          let inputs,
            outputs = {};

          for (const input of access.inputs.values()) {
            inputs = {
              ...inputs,
              [input.id]: input
            };
          }

          for (const output of access.outputs.values()) {
            outputs = {
              ...outputs,
              [output.id]: output
            };
          }

          // set midi inputs and outputs for selection
          setMidiInputs(inputs);
          setMidiOutputs(outputs);

          // set first midi input/output as default
          setActiveMidiInput(inputs[Object.keys(inputs)[0]]);
          setActiveMidiOutput(outputs[Object.keys(outputs)[0]]);

          // setting up midi in
          inputs[Object.keys(inputs)[0]];

          access.onstatechange = function(e) {
            // Print information about the (dis)connected MIDI controller
            console.log(e.port.name, e.port.manufacturer, e.port.state);
          };
        });
      }
    };

    initMIDI();
  }, [midiInputs, midiOutputs]);

  /*
    set up and remove listener for activeMidiInput
  */
  React.useEffect(() => {
    if (activeMidiInput) {
      activeMidiInput.addEventListener("midimessage", handleMidiIn);
      return () =>
        activeMidiInput.removeEventListener("midimessage", handleMidiIn);
    }
  }, [activeMidiInput]);

  function handleMidiIn(m) {
    if (currentStep > 0 && currentStep % 4 === 0 && melody.length < numBars) {
      melody.push([]);
    }
    
    let [noteon, note, velocity] = m.data;
    note = Tone.Frequency(note, "midi").toNote();
    
    /*
      this is where the bulk of the note generation happens
      
      each voice is stored in a separate array
      and as each new voice is assigned it has to pass a number
      of tests
      
      1. interval should be consonant, either
              (major/minor 3rd)
    */
    let interval = Tone.Frequency(note).transpose(6).toNote();
    console.log('interval',interval)

    let measure = Math.floor(currentStep / 4) % numBars;
    let beat = currentStep % 4;

    if (melody[measure].length === 4) {
      melody[measure][currentStep % 4] = [{ 
        0: note,
        1: interval
      }];
    } else {
      melody[measure].push([{ 
        0: note,
        1: interval
      }]);
    }

    setMelody([...melody]);
    setCurrentStep(currentStep++);
  }

  function handleLoopToggle(e) {
    if (sequence) sequence.loop.value = !loop;
    setLoop(prev => !prev);
  }

  function handleNumBarsChange(e) {
    setNumBars(e.target.value);
  }

  function handleBPMChange(e) {
    setBPM(parseFloat(e.target.value));
    Tone.Transport.bpm.value = parseFloat(e.target.value);
  }

  function handleNoteChange(e, measure_id, beat_id, voice_id) {
    let currentNote = melody[measure_id][beat_id][0][voice_id];
    let newMelody = [...melody];

    switch (e.keyCode) {
      case 37: // prev note
        break;
      case 38: // note up
        newMelody[measure_id][beat_id][0][voice_id] = Tone.Frequency(
          currentNote
        )
          .transpose(1)
          .toNote();
        break;
      case 40: // note down
        newMelody[measure_id][beat_id][0][voice_id] = Tone.Frequency(
          currentNote
        )
          .transpose(-1)
          .toNote();
        break;
      case 41: // next note
        break;
      default:
        break;
    }

    setMelody(newMelody);
  }

  const handleMidiInputChange = input_id => {
    setActiveMidiInput(midiInputs[input_id]);
  };

  const handleMidiOutputChange = output_id => {
    setActiveMidiOutput(midiOutputs[output_id]);
  };

  const handleTogglePlay = e => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setIsPlaying(stop);
    } else {
      Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  return (
    <React.Fragment>
      <Settings
        onTogglePlay={handleTogglePlay}
        onMidiInputChange={e => handleMidiInputChange(e.target.value)}
        onMidiOutputChange={e => handleMidiOutputChange(e.target.value)}
        onToggleLoop={handleLoopToggle}
        onNumBarsChange={handleNumBarsChange}
        onBPMChange={handleBPMChange}
        bpm={bpm}
        loop={loop}
        isPlaying={isPlaying}
        midiInputs={midiInputs}
        midiOutputs={midiOutputs}
        activeMidiInput={activeMidiInput}
        activeMidiOutput={activeMidiOutput}
        currentStep={currentStep}
      />
      <MusicStaff
        melody={melody}
        onNoteChange={handleNoteChange}
        currentStep={currentStep % (4 * numBars)}
      />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
