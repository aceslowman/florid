const MusicStaff = props => {
  let measures = [];
  
  for(let i = 0; i < props.numBars; i++) {
    measures.push(())
  }
  
  return (
    <div className="STAFF">
      <div className="LINES">
        <div>
          <div>E0</div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div>
          <div></div>
          <div></div>
          <div></div>
          <div>C0</div>
        </div>
        <div>
          <div></div>
          <div></div>
          <div>A0</div>
          <div></div>
        </div>
        <div>
          <div></div>
          <div>F0</div>
          <div></div>
          <div></div>
        </div>
        <div>
          <div>D0</div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="MEASURES">
        
      </div>
      <div className="NOTES">
        {props.melody.map((e, i) => {
          return (
            <Note value={e} />
          )
        })}
      </div>
    </div>
  );
};
