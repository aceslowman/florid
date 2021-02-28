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
            onChange={props.onToggleLoop}
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
      </div>
      <div className="credits">cantus firmus by aceslowman 2021</div>
      <div className="toggleSettings" onClick={toggleSettings}></div>
    </div>
  );
};