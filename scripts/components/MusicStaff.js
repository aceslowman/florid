const MusicStaff = props => {
  function handleNoteClick(e) {
    console.log(e.target.value);
  }

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
              <div className="measure">
                {measure.map((note, n_i) => {
                  return <Note onNoteClick={handleNoteClick} value={note} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
