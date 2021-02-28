const MusicStaff = props => {
  return (
    <div className="STAFF">
      <div className="flex-fix">
        <div className="LINES">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="flex-fix">
        <div className="NOTES">
          {props.melody.map((measure, m_i) => {
            return (
              <div key={m_i} className="measure">
                {measure.map((note, n_i) => {
                  return (
                    <Note
                      tabIndex={n_i+1}
                      key={m_i + note}
                      onKeyUp={(e) => props.onNoteChange(e, m_i, n_i)}
                      value={note}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
