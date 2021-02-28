const Note = props => {
  return (
    <div className="note" onClick={props.onNoteClick}>
      {props.value}
    </div>
  )
}