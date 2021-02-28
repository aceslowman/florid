const Settings = props => {
  return (
    <div className="SETTINGS" style={{ width: "0%" }}>
      <div className="settingsInner">
        <div>
          <label>number of bars</label>
          <input className="numBarsInput" type="number" step="1" value="1" />
        </div>
        <div>
          <label>tempo</label>
          <input className="tempoInput" type="number" step="1" value="120" />
        </div>
        <div>
          <label>
            loop
            <input className="loopButton" type="checkbox" />
          </label>
        </div>
      </div>
      <div className="credits">cantus firmus by aceslowman 2021</div>
      <div className="toggleSettings"></div>
    </div>
  );
};
