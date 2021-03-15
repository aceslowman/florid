/* global Tone, ReactDOM, React */
const Note = props => {
  let noteRef = React.useRef();
  let [selected, setSelected] = React.useState(false);

  function checkIfSelected() {
    setSelected(
      document.activeElement === ReactDOM.findDOMNode(noteRef.current)
    );
  }
  
  return (
      <div
        onFocus={checkIfSelected}
        onBlur={checkIfSelected}
        onKeyDown={props.onKeyDown}
        tabIndex={props.tabIndex}
        style={{
          width: '50px',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#602500',
          cursor: 'grab',
          position: 'absolute',
          display: 'flex',
          flexFlow: 'row',
          fontSize: '1.4em',
          color: '#FAEBD7',
          boxSizing: 'border-box',            
          ...props.style,
          fontWeight: selected ? "bold" : "normal",
        }}
        ref={noteRef}
      >
        {props.value}
      </div>
  );
};
