/* global Tone, ReactDOM, React */
const Note = props => {
  let noteRef = React.useRef();
  let [selected, setSelected] = React.useState(false);

  React.useLayoutEffect(() => {
      setSelected(document.activeElement === ReactDOM.findDOMNode(noteRef.current));
  });
  
  return (
    <div
      className="note"
      
      onKeyUp={props.onKeyUp}
      tabIndex={props.tabIndex}
      style={{ 
        fontWeight: selected ? "bold" : "normal" 
      }}
      ref={noteRef}
    >
      {props.value}
    </div>
  );
};
