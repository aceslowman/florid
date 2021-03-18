/* global Tone, ReactDOM, React */

/* */
const MusicStaff = props => {
  let lineRef = React.useRef();
  let [ready, setReady] = React.useState(0);

  let [staffHeight, setStaffHeight] = React.useState(0);

  function isAccidental(note) {
    return note.match(/[#b]/g) ? true : false;
  }

  React.useEffect(() => {
    setReady(true);

    window.onresize = () => {
      setStaffHeight(lineRef.current.getBoundingClientRect().height);
    };
  }, []);

  // resize with window
  React.useEffect(() => {}, []);

  let iter = 0;
  let measures =
    ready &&
    props.melody.map((measure, m_i) => {
      staffHeight = lineRef.current.getBoundingClientRect().height;

      let lineHeight = staffHeight / 8;

      let isLastMeasure = props.melody.length - 1 === m_i;
      let isFirstMeasure = m_i === 0;

      return (
        <div
          key={m_i}
          style={{
            height: staffHeight,
            borderRight: `${isLastMeasure ? "8px solid" : "1px solid"} #6e2a00`,
            margin: `${lineHeight * 3}px 0px`,
            paddingRight: isLastMeasure ? "20px" : "0px",
            display: "flex",
            flexFlow: "row",
            justifyContent: "flex-start",
            flexGrow: 2,
            position: "relative"
          }}
        >
          {isFirstMeasure && (
            <img
              alt="treble clef"
              style={{
                height: lineRef.current.getBoundingClientRect().height * 2,
                alignSelf: "center"
              }}
              src="https://cdn.glitch.com/5952eddf-3ee4-437e-93ff-001a65fa1cf4%2FTreble_clef.svg?v=1614749305855"
            />
          )}
          <div className="flex-fix">
            <div
              className="MEASURELINES"
              style={{
                height: staffHeight,
                borderRight: `${
                  isLastMeasure ? "10px double" : "1px solid"
                } #6e2a00`
              }}
            >
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          {measure.map((beats, b_i) => {
            iter++;

            return (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexFlow: "column",
                  height: "100%",
                  justifyContent: "center"
                }}
                key={b_i}
              >
                <div
                  style={{
                    width: "100%",
                    padding: "0px 40px",
                    alignItems: "center",
                    display: "flex",
                    position: "relative",
                    justifyContent: "center"
                  }}
                >
                  {beats.map((voice, v_i) => {
                    return Object.keys(voice).map((n, n_i) => {
                      let note = voice[n];

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
                        // go up (base b4)
                        remap = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6][
                          Math.abs(diff) % 12
                        ];
                      } else {
                        // go down (base b4)
                        remap = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6][
                          Math.abs(diff) % 12
                        ];
                      }

                      // scale this new mapping by the line height and reapply the sign
                      let position = lineHeight * (remap * Math.sign(diff));
                      position -= lineHeight; // nudge to middle of staff

                      return (
                        <Note
                          tabIndex={iter}
                          key={m_i + "_" + b_i + "_" + v_i + "_" + n_i}
                          onKeyDown={e => props.onNoteChange(e, m_i, b_i, n_i)}
                          value={note}
                          style={{
                            height: lineHeight * 2,
                            bottom: position,
                            border: n_i ? '2px dotted white' : '1px solid white',
                            backgroundColor:
                              props.currentStep=== iter % (props.melody.length * 4)  // NOTE: this is different than in cantus-firmus!
                                ? "#ff5454"
                                : "#602500"
                          }}
                        />
                      );
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    });

  return (
    <div
      style={{
        flexGrow: 2,
        position: "relative",
        overflow: "overlay"
      }}
    >
      <div className="flex-fix">
        {/*
            this LINES div gives me the reference height for the measures.
            these aren't visible
        */}
        <div
          className="lines"
          style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "space-between"
          }}
          ref={lineRef}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="flex-fix">
        <div
          className="measures"
          style={{
            display: "flex",
            flexFlow: "row wrap"
          }}
        >
          {measures}
        </div>
      </div>
    </div>
  );
};
