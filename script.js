// https://stackoverflow.com/questions/4954252/css-textarea-that-expands-as-you-type-text

function updateSize(e) {
  let text = e.target.value + String.fromCharCode(event.keyCode);
  e.target.rows = text.split(/\r\n|\r|\n/).length;
}

function keyDownUpdateSize(e) {
  if (event.keyCode != 8 && event.keyCode != 46) updateSize(e);
}

function keyUpUpdateSize(e) {
  if (event.keyCode == 8 || event.keyCode == 46) updateSize(e);
}

document
  .querySelector(".MAININPUT")
  .addEventListener("keydown", keyDownUpdateSize);
document.querySelector(".MAININPUT").addEventListener("keyup", keyUpUpdateSize);

function toggleSettings() {
  console.log("settings");
  let settingsPanel = document.querySelector(".SETTINGS");
  settingsPanel.style.width = settingsPanel.style.width === "0%" ? "28%" : "0%";
}

document
  .querySelector(".toggleSettings")
  .addEventListener("click", toggleSettings);

// let state = {
//   testValue: 2
// };

// // GUI
// let gui = new dat.GUI({
//   autoPlace: false,
//   closeOnTop: false
// });

// document.querySelector(".settingsInner").append(gui.domElement);

// gui.remember(state);

// gui.add(state, 'testValue');
