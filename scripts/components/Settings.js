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
          <InputGroup>
            <label>
              loop
              <input
                onChange={props.onToggleLoop}
                checked={props.loop}
                className="loopButton"
                type="checkbox"
              />
            </label>
          </InputGroup>
          <button
            onClick={props.onTogglePlay}
            className="playButton"
            style={{
              color: props.isPlaying ? "#fff" : "#602500",
              backgroundColor: props.isPlaying ? "#602500" : "#fff"
            }}
          >
            {props.isPlaying ? "stop" : "play"}
          </button>

          <InputGroup>
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

            <MIDILog device={props.activeMidiInput} />
          </InputGroup>
          <InputGroup>
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

            <MIDILog device={props.activeMidiOutput} />
          </InputGroup>
        </InputPanel>
      
      <div className="credits">
        florid by{" "}
        <a href="https://linktr.ee/aceslowman" target="_blank">
          aceslowman
        </a>{" "}
        2021
      </div>
      <div className="toggleSettings" onClick={toggleSettings}></div>
    </div>
  );
};
1;
