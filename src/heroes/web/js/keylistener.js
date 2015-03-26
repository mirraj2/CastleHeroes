var zoom = 1;

function zoomOut() {
  zoom /= 2;
  TW = Math.round(originalTW * zoom);
  TH = Math.round(originalTH * zoom);
  myX /= 2;
  myY /= 2;
}

function zoomIn() {
  zoom *= 2;
  TW = Math.round(originalTW * zoom);
  TH = Math.round(originalTH * zoom);
  myX *= 2;
  myY *= 2;
}

$(window).keypress(function(e) {
  if (chatting) {
    return;
  }

  var char = String.fromCharCode(e.keyCode);
  // console.log(e.keyCode);
  // console.log(char);

  if (char == '-') {
    zoomOut();
  } else if (char == '=') {
    zoomIn();
  } else if (char == '[') {
    teleportDown();
  } else if (char == ']') {
    teleportUp();
  } else if (char == ' ') {
    takeAction();
  }
});
