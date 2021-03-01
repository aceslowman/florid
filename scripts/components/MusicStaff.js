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
                  // need to calculate position here
                  let position = 0;
                  console.log('note',note)
                  // how far away is this note from B4?
                  let b4 = Tone.Frequency("B4").toMidi();  
                  
                  // strip out accidental first
                  // console.log(`${note} is accidental`, isAccidental(note))                  
                  let withoutAccidental = note.replace(/[#b]/,'');
                  // console.log('note after stripping', withoutAccidental)
                  
                  let midinote = Tone.Frequency(note).toMidi();
                  
                  
                  let diff = midinote - b4;
                  
                  if(isAccidental(note)) {
                    // diff += 1;
                  }
                                    
                  // console.log(`${withoutAccidental} is ${midinote}`)
                  console.log(`${withoutAccidental} is ${diff} lines away from b4`)
                  
                  let lineHeight = lineRef.current.getBoundingClientRect().height / 8;                
                  
                  console.log(diff * lineHeight)
                  
                  // position = diff * lineHeight;
                  
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
