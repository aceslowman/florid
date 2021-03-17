/* global Tone, ReactDOM, React */
const App = () => {
  let [melody, setMelody] = React.useState([[]]);

  let [numBars, setNumBars] = React.useState(1);
  let [loop, setLoop] = React.useState(false);
  let [bpm, setBPM] = React.useState(120);
  let [voicingKey, setVoicingKey] = React.useState("G");
  let [voicingMode, setVoicingMode] = React.useState(0);

  let [soundOn, setSoundOn] = React.useState(false);
  let [sequence, setSequence] = React.useState();
  let [synth, setSynth] = React.useState();

  let [midiInputs, setMidiInputs] = React.useState(null);
  let [midiOutputs, setMidiOutputs] = React.useState(null);
  let [activeMidiInput, setActiveMidiInput] = React.useState(null);
  let [activeMidiOutput, setActiveMidiOutput] = React.useState(null);

  let [selectedNote, setSelectedNote] = React.useState(null);
  let [currentStep, setCurrentStep] = React.useState(0);
  let [isPlaying, setIsPlaying] = React.useState(false);

  let [subdivisions, setSubdivisions] = React.useState(4);
  let [ready, setReady] = React.useState(false);

  let [rules, setRules] = React.useState({
    sequence: {
      noSeconds: true,
      noTritone: true
    },
    harmony: {
      noSeconds: true,
      noTritone: true
    }
  });

  /*
    set up keybindings
  */
  React.useEffect(() => {
    const keybindings = e => {
      switch (e.keyCode) {
        case 32: // space bar
          handleTogglePlay();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", keybindings, false);
    return () => document.removeEventListener("keydown", keybindings, false);
  }, [handleTogglePlay, sequence, setIsPlaying, isPlaying]);

  /*
    startup audio context
  */
  React.useEffect(() => {
    const startAudioContext = async () => {
      await Tone.start();
      console.log("audio context has started");
      Tone.Transport.bpm.value = parseFloat(bpm);
      setSynth(new Tone.PolySynth().toDestination());
      setReady(true);
    };

    if (!ready) {
      document.addEventListener("click", startAudioContext);
    } else {
      document.removeEventListener("click", startAudioContext);
    }

    return () => {
      document.removeEventListener("click", startAudioContext);
    };
  }, [ready, synth, setSynth]);

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

  React.useEffect(() => {
    if (ready) Tone.Transport.bpm.value = parseFloat(bpm);
  }, [bpm]);

  /*
    GENERATE VOICES
    set up and remove listener for activeMidiInput
  */
  React.useLayoutEffect(() => {
    const handleMidiIn = m => {
      if (currentStep > 0 && currentStep % 4 === 0 && melody.length < numBars) {
        melody.push([]);
      }

      let [noteon, currentNote, velocity] = m.data;
      currentNote = Tone.Frequency(currentNote, "midi").toNote();

      /*
      this is where the bulk of the note generation happens
      
      these checks require comparing both harmony and melody
      
      each counter melody is stored in a separate array
      and as each new note is assigned it has to pass a number
      of tests
      
      1. interval should be consonant, either
        a. major/minor 3rd
        b. major/minor 6th
        c. perfect fifth
        c. unison
      2. do not repeat intervals of a fifth
      3. do not repeat intervals of an octave
      4. voices moving in the same direction should not 
         leap by a fifth  or octave
      5. avoid the augmented fourth
      6. avoid augmented 2nds, harmonic and melodic
      
      ugh and many more
      
      http://openmusictheory.com/firstSpecies.html
        
      intervals:      
      0 | unison
      1 | minor second
      2 | major second
      3 | minor third
      4 | major third
      5 | perfect fourth
      6 | tritone
      7 | perfect fifth
      8 | minor sixth
      9 | major sixth
      10| minor seventh
      11| major seventh
      12| octave
    */
      let base_mode = [2, 2, 1, 2, 2, 2, 1];

      for (let i = 0; i < voicingMode; i++) {
        base_mode = arrayRotate(base_mode);
      }

      let base_octave = 4;

      let acc = 0;
      let keyScale = base_mode.map(e => {
        let next_note = Tone.Frequency(`${voicingKey}${base_octave}`)
          .transpose(acc)
          .toNote();

        acc = acc + e;

        return next_note;
      });

      let measure = Math.floor(currentStep / 4) % numBars;
      let beat = currentStep % 4;

      let counterNote = null; // the eventual note
      let previousNote = melody[measure][(currentStep-1) % 4];       // the note preceding it

      
        console.group();
      console.log('currentNote', currentNote)
      console.log('previousNote', previousNote)
      
      // get random note in scale
      let newNote = keyScale[Math.floor(Math.random() * keyScale.length)];

      // HERE while new_note is a certain distance from currentNote, pick a new one
      let failsafe = 0;
      let passing = false;
      while (!passing && failsafe < 10) {
        newNote = keyScale[Math.floor(Math.random() * keyScale.length)];

        console.log(
          `comparing current: ${currentNote} to voicing: ${newNote}`
        );

        /* 
          disallowed harmony: 
        */
        let harmonicInterval = getNoteDistance(currentNote, newNote);
        let harmIsTritone = harmonicInterval === 6;
        let harmIsSecond = harmonicInterval === 1 || harmonicInterval === 2;

        /*
          disallowed sequence
        */
        let sequenceInterval = getNoteDistance(currentNote, previousNote);
        let seqIsTritone = sequenceInterval === 6;
        let seqIsSecond = sequenceInterval === 1 || sequenceInterval === 2;

        // console.log("the distance is", voiceInterval);
        // console.log("isTritone", isTritone);
        // console.log("isSecond", isSecond);
        

        passing =
          (rules.harmony.isTritone && !harmIsTritone) &&
          (rules.harmony.isSecond && !harmIsSecond) && 
          (rules.sequence.isTritone && !seqIsTritone) &&
          (rules.sequence.isSecond && !seqIsSecond);
        failsafe++;
      }
      
      console.groupEnd();

      // apply
      counterNote = newNote;

      let newEvent = [
        {
          0: currentNote,
          1: counterNote
        }
      ];

      if (melody[measure].length === 4) {
        melody[measure][beat] = newEvent;
      } else {
        melody[measure].push(newEvent);
      }

      setMelody([...melody]);
      setCurrentStep(prev => (prev = (prev + 1) % (numBars * 4)));
      synth.triggerAttackRelease([currentNote, counterNote], "4n");
    };

    if (activeMidiInput) {
      activeMidiInput.addEventListener("midimessage", handleMidiIn);
      return () =>
        activeMidiInput.removeEventListener("midimessage", handleMidiIn);
    }
  }, [melody, synth, currentStep, numBars, setMelody, setCurrentStep]);

  /* insert new measures */
  React.useLayoutEffect(() => {
    if (numBars > melody.length) {
      let newMeasure = [];

      for (let i = 0; i < subdivisions; i++) {
        newMeasure.push([{ 0: "B4" }]); // TEMP: TODO: should initialize as REST
      }

      setMelody(prev => [...prev, newMeasure]);
    } else if (numBars < melody.length && numBars > 0) {
      setMelody(prev => {
        prev.pop();
        return [...prev];
      });
    }
  }, [numBars, melody, setMelody, subdivisions]);

  const handleLoopToggle = e => {
    if (sequence) sequence.loop.value = !loop;
    setLoop(prev => !prev);
  };

  const handleNoteChange = (e, measure_id, beat_id, voice_id) => {
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
  };

  const getNoteDistance = (a, b) => {
    /*
      this method gets the 'absolute' difference
      between two notes. This means that an interval
      of an octave is 0, this is essentially:
    
      distance from either 0 or 12
    */
    a = Tone.Frequency(a).toMidi();
    b = Tone.Frequency(b).toMidi();

    let result = b - a;
    if (result % 12 === 0) a = 0;

    if (Math.abs(result) >= 6) result = (12 - result) * -1;

    return result;
  };

  // https://stackoverflow.com/questions/1985260/rotate-the-elements-in-an-array-in-javascript
  const arrayRotate = (arr, reverse) => {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  };

  const handleNumBarsChange = e => setNumBars(e.target.value);
  const handleBPMChange = e => setBPM(parseFloat(e.target.value));

  const handleMidiInputChange = input_id =>
    setActiveMidiInput(midiInputs[input_id]);

  const handleMidiOutputChange = output_id =>
    setActiveMidiOutput(midiOutputs[output_id]);

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

  const handleChangeVoicingKey = e => setVoicingKey(e.target.value);

  const handleChangeVoicingMode = e => setVoicingMode(e.target.value);

  const handleToggleRules = (mode, rule) =>
    setRules(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        [rule]: !prev[mode][rule]
      }
    }));

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
        numBars={numBars}
        midiInputs={midiInputs}
        midiOutputs={midiOutputs}
        activeMidiInput={activeMidiInput}
        activeMidiOutput={activeMidiOutput}
        currentStep={currentStep}
        onChangeVoicingKey={handleChangeVoicingKey}
        voicingKey={voicingKey}
        onChangeVoicingMode={handleChangeVoicingMode}
        voicingMode={voicingMode}
        rules={rules}
        onToggleRules={handleToggleRules}
      />
      <MusicStaff
        melody={melody}
        onNoteChange={handleNoteChange}
        currentStep={currentStep}
      />
    </React.Fragment>
  );
};

const domContainer = document.getElementById("APP");
ReactDOM.render(React.createElement(App), domContainer);
