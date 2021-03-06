/* global Tone, ReactDOM, React */
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
    <div className="SETTINGS" style={{ width: expanded ? "28%" : "0%" }}>
      <div className="settingsInner">
        <div className="inputGroup">
          <label>number of bars</label>
          <input
            onChange={props.onNumBarsChange}
            className="numBarsInput"
            type="number"
            step="1"
            value="1"
          />
        </div>
        <div className="inputGroup">
          <label>tempo</label>
          <input
            onChange={props.onBPMChange}
            className="tempoInput"
            type="number"
            step="1"
            value={props.bpm}
          />
        </div>
        <div className="inputGroup">
          <label>
            loop
            <input
              onChange={props.onToggleLoop}
              checked={props.loop}
              className="loopButton"
              type="checkbox"
            />
          </label>
        </div>
        <div className="buttonGroup">
          <button onClick={props.onRandomize} className="randomizeButton">
            randomize
          </button>
        </div>
        <div className="buttonGroup">
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
        </div>
        <div className="inputGroup">
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
        </div>
        <div className="inputGroup">
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
        </div>
      </div>
      <div className="credits">florid by aceslowman 2021</div>
      <div className="toggleSettings" onClick={toggleSettings}></div>
    </div>
  );
};
