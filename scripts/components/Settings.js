/* global Tone, ReactDOM, React */
const InputPanel = props => (
  <div
    style={{
      display: "flex",
      margin: "5px 0px",
      width: "100%",
      flexFlow: "column",
      border: "1px groove #602500",
      padding: "10px"
    }}
  >
    <h3 style={{ margin: "0px 0px 8px 0px" }}>{props.title}</h3>
    {props.children}
  </div>
);

const InputGroup = props => (
  <div
    style={{
      display: "flex",
      flexFlow: "column",
      alignSelf: "flex-end",
      width: "48%"
    }}
  >
    {props.children}
  </div>
);

const InputRow = props => (
  <div
    style={{
      display: "flex",
      flexFlow: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: "5px"
    }}
  >
    {props.children}
  </div>
);

const Settings = props => {
  let [expanded, setExpanded] = React.useState();

  let style = {
    width: "0%"
  };

  // SETTINGS TOGGLE
  function toggleSettings() {
    setExpanded(prev => !prev);
  }

  return (
    <div className="SETTINGS" style={{ width: expanded ? "300px" : "0%" }}>
      <div className="settingsInner">
        <InputPanel title="basic">
          <InputRow>
            <InputGroup>
              <label>number of bars</label>
              <input
                onChange={props.onNumBarsChange}
                className="numBarsInput"
                type="number"
                step="1"
                value={props.numBars}
              />
            </InputGroup>
            <InputGroup>
              <label>tempo</label>
              <input
                onChange={props.onBPMChange}
                className="tempoInput"
                type="number"
                step="1"
                value={props.bpm}
              />
            </InputGroup>
          </InputRow>
        </InputPanel>

        <InputPanel title="voicing">
          <InputRow>
            <InputGroup>
              <label htmlFor="keyselect">key</label>
              <select
                id="keyselect"
                onChange={props.onChangeVoicingKey}
                value={props.voicingKey}
              >
                <option value="C">C</option>
                <option value="C#">C#</option>
                <option value="D">D</option>
                <option value="D#">D#</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F#</option>
                <option value="G">G</option>
                <option value="G#">G#</option>
                <option value="A">A</option>
                <option value="A#">A#</option>
                <option value="B">B</option>
              </select>
            </InputGroup>
            <InputGroup>
              <label htmlFor="modeselect">mode</label>
              <select
                id="modeselect"
                onChange={props.onChangeVoicingMode}
                value={props.voicingMode}
              >
                <option value="0">Ionian (major)</option>
                <option value="1">Dorian</option>
                <option value="2">Phrygian</option>
                <option value="3">Lydian</option>
                <option value="4">Mixolydian</option>
                <option value="5">Aeolian (natural minor)</option>
                <option value="6">Locrian</option>
              </select>
            </InputGroup>
          </InputRow>
          <InputPanel title="rules">
            <InputPanel title="sequence">
            <InputRow>
              <InputGroup>
                <label>
                  no tritone
                  <input
                    onChange={()=>props.onToggleRules('sequence','noTritone')}
                    checked={props.rules.sequence.noTritone}
                    type="checkbox"
                  />
                </label>
              </InputGroup>
              <InputGroup>
                <label>
                  no seconds
                  <input
                    onChange={()=>props.onToggleRules('sequence','noSeconds')}
                    checked={props.rules.sequence.noSeconds}
                    type="checkbox"
                  />
                </label>
              </InputGroup>
            </InputRow>
            </InputPanel>
            <InputPanel title="harmony">
            <InputRow>
              <InputGroup>
                <label>
                  no tritone
                  <input
                    onChange={()=>props.onToggleRules('harmony','noTritone')}
                    checked={props.rules.harmony.noTritone}
                    type="checkbox"
                  />
                </label>
              </InputGroup>
              <InputGroup>
                <label>
                  no seconds
                  <input
                    onChange={()=>props.onToggleRules('harmony','noSeconds')}
                    checked={props.rules.harmony.noSeconds}
                    type="checkbox"
                  />
                </label>
              </InputGroup>
              <InputGroup>
                <label>
                  no unison
                  <input
                    onChange={()=>props.onToggleRules('harmony','noUnison')}
                    checked={props.rules.harmony.noUnison}
                    type="checkbox"
                  />
                </label>
              </InputGroup>
            </InputRow>
            </InputPanel>
          </InputPanel>
          
          
        </InputPanel>

        <InputPanel title="MIDI">
          <InputRow>
            <label htmlFor="midiinputs">Midi Input</label>
            <select
              name="midiinputs"
              value={props.activeMidiInput ? props.activeMidiInput.id : ""}
              onChange={props.onMidiInputChange}
            >
              <option>select an input</option>
              {props.midiInputs &&
                Object.keys(props.midiInputs).map(e => {
                  return (
                    <option key={e} value={props.midiInputs[e].id}>
                      {props.midiInputs[e].name}
                    </option>
                  );
                })}
            </select>
          </InputRow>

          <MIDILog device={props.activeMidiInput} />
          <InputRow>
            <label htmlFor="midioutputs">Midi Output</label>
            <select
              name="midioutputs"
              value={props.activeMidiOutput ? props.activeMidiOutput.id : ""}
              onChange={props.onMidiOutputChange}
            >
              <option>select an output</option>
              {props.midiOutputs &&
                Object.keys(props.midiOutputs).map(e => {
                  return (
                    <option key={e} value={props.midiOutputs[e].id}>
                      {props.midiOutputs[e].name}
                    </option>
                  );
                })}
            </select>
          </InputRow>
          <MIDILog device={props.activeMidiOutput} />
        </InputPanel>

        <InputPanel title="playback">
          <InputRow>
            <InputGroup>
              <label>
                loop
                <input
                  onChange={props.onToggleLoop}
                  checked={props.loop}
                  type="checkbox"
                />
              </label>
            </InputGroup>
            <InputGroup>
              <label>
                sound
                <input
                  onChange={props.onToggleSoundOn}
                  checked={props.soundOn}
                  type="checkbox"
                />
              </label>
            </InputGroup>
          </InputRow>
          <button
            onClick={props.onTogglePlay}
            style={{
              color: props.isPlaying ? "#fff" : "#602500",
              backgroundColor: props.isPlaying ? "#602500" : "#fff"
            }}
          >
            {props.isPlaying ? "stop" : "play"}
          </button>
        </InputPanel>
        <div className="credits">
          florid by{" "}
          <a href="https://linktr.ee/aceslowman" target="_blank">
            aceslowman
          </a>{" "}
          &nbsp; 2021
        </div>
      </div>
      <div className="toggleSettings" onClick={toggleSettings}></div>
    </div>
  );
};
1;
