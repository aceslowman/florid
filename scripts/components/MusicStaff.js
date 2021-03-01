/* global Tone, ReactDOM, React */
const MusicStaff = props => {
  let lineRef = React.useRef();
  let [ready, setReady] = React.useState(0);

  function isAccidental(note) {
    return note.match(/[#b]/g) ? true : false;
  }

  React.useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="STAFF">
      <div className="flex-fix">
        {/*ready && (
          <img
            className="CLEF"
            style={{height: lineRef.current.getBoundingClientRect().height * 2}}
            src="https://cdn.glitch.com/5952eddf-3ee4-437e-93ff-001a65fa1cf4%2FTreble_clef.svg?v=1614616900606"
          ></img>
        )*/}
        {
          <div className="LINES" ref={lineRef}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
      </div>
      <div className="flex-fix">
        <div className="NOTES">
          {ready &&
            props.melody.map((measure, m_i) => {
              let staffHeight = lineRef.current.getBoundingClientRect().height;
              let lineHeight = staffHeight / 8;

              let isLastMeasure = props.melody.length - 1 === m_i;

              return (
                <div
                  key={m_i}
                  className="measure"
                  style={{
                    height: staffHeight,
                    borderRight: `${
                      isLastMeasure ? "10px solid" : "1px solid"
                    } #6e2a00`,
                      
                      paddingRight: isLastMeasure ? '10px' : '0px'
                  }}
                >
                  <div className="flex-fix">
                    <div
                      className="MEASURELINES"
                      style={{
                        height: staffHeight,
                        borderRight: `${
                          isLastMeasure ? "2px solid" : "1px solid"
                        } #6e2a00`,
                          
                      }}
                    >
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                  {measure.map((note, n_i) => {
                    let centernote = Tone.Frequency("B4").toMidi();

                    let withoutAccidental = note.replace(/[#b]/, "");
                    let midinote = Tone.Frequency(withoutAccidental).toMidi();

                    let diff = midinote - centernote;
                    let remap;

                    /*
                      these maps are worth some explaining

                      I mapped the distance between b4 and the given note,
                      and since notation includes specific half steps 
                      (b - c, e -f), (w w h w w w h)

                      ITER    REMAP
                      +6   F   +4
                      +5   E   +3
                      +4   D#  +2
                      +3   D   +2
                      +2   C#  +1
                      +1   C   +1
                       0   B4   0 <-------- center of staff
                      -1   A#  -1
                      -2   A   -1
                      -3   G#  -2
                      -4   G   -2 
                      -5   F#  -3
                      -6   F   -3
                    */
                    if (Math.sign(diff) > 0) {
                      // go up
                      remap = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6][
                        Math.abs(diff) % 12
                      ];
                    } else {
                      // go down
                      remap = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6][
                        Math.abs(diff) % 12
                      ];
                    }

                    // scale this new mapping by the line height and reapply the sign
                    let position = lineHeight * (remap * Math.sign(diff));

                    return (
                      <Note
                        tabIndex={n_i + 1}
                        key={m_i + "_" + n_i}
                        onKeyDown={e => props.onNoteChange(e, m_i, n_i)}
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
