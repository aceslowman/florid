/* global Tone, ReactDOM, React */
const Settings = props => {
  let [expanded, setExpanded] = React.useState();
  
  let style = {
    width: '0%'
  }
  
  // SETTINGS TOGGLE
  function toggleSettings() {
    setExpanded(prev => !prev)
  }
  
        //   midiInputs={midiInputs}
        // midiOutputs={midiOutputs}
        // onMidiInputChange={handleMidiInputChange}
        // onMidiOutputChange={handleMidiOutputChange}

  console.log('hello', props.midiInputs)
  
  return (
    <div className="SETTINGS" style={{width: expanded ? '28%' : '0%'}}>
      <div className="settingsInner">
        <div>
          <label>number of bars</label>
          <input
            onChange={props.onNumBarsChange}
            className="numBarsInput"
            type="number"
            step="1"
            value="1"
          />
        </div>
        <div>
          <label>tempo</label>
          <input
            onChange={props.onChangeBPM}
            className="tempoInput"
            type="number"
            step="1"
            value="120"
          />
        </div>
        <div>
          <label>
            loop
            <input
              onChange={props.onToggleLoop}
              className="loopButton"
              type="checkbox"
            />
          </label>
        </div>
        <div>
            <button
              onChange={props.onRandomize}
              className="randomizeButton"
              type="checkbox"
              >randomize</button>
        </div>
        <div>
          <select onChange={props.handleMidiInputChange}>
            {props.midiInputs.map(e => {
              console.log(e)
              return (
                <options value={e.id}>{e.name}</options>
              )
            })}
          </select>
        </div>
      </div>
      <div className="credits">cantus firmus by aceslowman 2021</div>
      <div className="toggleSettings" onClick={toggleSettings}></div>
    </div>
  );
};
