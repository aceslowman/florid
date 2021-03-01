/* global Tone, ReactDOM, React */
const Note = props => {
  let noteRef = React.useRef();
  let [selected, setSelected] = React.useState(false);
  
  function checkIfSelected() {
    setSelected(document.activeElement === ReactDOM.findDOMNode(noteRef.current));
  }
  
  return (
    <div
      className="note"
      onFocus={checkIfSelected}
      onBlur={checkIfSelected}
      onKeyUp={props.onKeyUp}
      tabIndex={props.tabIndex}
      style={{ 
        ...props.style,
        fontWeight: selected ? "bold" : "normal" 
      }}
      ref={noteRef}
    >
      {props.value}
    </div>
  );
};
