/* global Tone, ReactDOM, React */
const MusicStaff = props => {
  let lineRef = React.useRef();
  let [ready, setReady] = React.useState(0);
  
  function isAccidental(note) {
    return note.match(/[#b]/g) ? true : false;
  }
  
  React.useEffect(() => {
    setReady(true);
  }, [])
  
  return (
    <div className="STAFF">
      <div className="flex-fix">
        <div className="LINES" ref={lineRef}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="flex-fix">
        <div className="NOTES">
          {ready && props.melody.map((measure, m_i) => {
            return (
              <div key={m_i} className="measure">
                {measure.map((note, n_i) => {
                  let lineHeight = lineRef.current.getBoundingClientRect().height / 8;                                       
                  // need to calculate position here
                  let position = 0;
                  console.log('note',note)
                  // how far away is this note from B4?
                  let b4 = Tone.Frequency("B4").toMidi();  
                  
                  let withoutAccidental = note.replace(/[#b]/,'');
                  
                  let midinote = Tone.Frequency(withoutAccidental).toMidi();
                  
                  let diff = midinote - b4;
                  
                  let remap;
                  
                  /*
                    these maps are worth some explaining
                    
                    I mapped the distance between b4 and the given note,
                    and since notation includes specific half steps (b - c, e -f)
                    
                    i.e
                    ITER    REMAP
                     0   B4  0 <--------
                    -1   A# -1
                    -2   A  -1
                    -3   G# -2
                    -4   G  -2 
                    -5   F# -3
                    -6   F  -3
                  */
                  if(Math.sign(diff) > 0) {
                    // go up
                    remap = [0,1,1,2,2,3,4,4,5,5,6,6][Math.abs(diff) % 12];
                  } else {
                    // go down
                    remap = [0,1,1,2,2,3,3,4,5,5,6,6][Math.abs(diff) % 12];
                  }
                  
                  // scale this new mapping by the line height and reapply the sign
                  position = lineHeight * (remap * Math.sign(diff));
                  
                  return (
                    <Note
                      tabIndex={n_i+1}
                      key={m_i + '_' + n_i}
                      onKeyUp={(e) => props.onNoteChange(e, m_i, n_i)}
                      value={note}
                      style={{
                        bottom: position
                      }}
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
