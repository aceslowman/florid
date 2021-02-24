// https://stackoverflow.com/questions/4954252/css-textarea-that-expands-as-you-type-text

function updateSize(e) {
  let text = e.target.value + String.fromCharCode(event.keyCode);
  e.target.rows = text.split(/\r\n|\r|\n/).length;
}

function keyDownUpdateSize(e) {
  if (event.keyCode != 8 && event.keyCode != 46)
    updateSize(e);
}

function keyUpUpdateSize(e) {
  if (event.keyCode == 8 || event.keyCode == 46)
    updateSize(e);
}

document.querySelector(".MAININPUT").addEventListener("keydown", keyDownUpdateSize);
document.querySelector(".MAININPUT").addEventListener("keyup", keyUpUpdateSize)
