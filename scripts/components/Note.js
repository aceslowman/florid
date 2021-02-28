const Note = props => {
  return (
    <div
      className="note"
      onClick={props.onNoteClick}
      onKeyUp={props.onKeyUp}
      tabIndex={props.tabIndex}
    >
      {props.value}
    </div>
  );
};
