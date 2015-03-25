$(function() {
  var scrollSpeed = SIZE * 20;
  kd.W.down(function() {
    focusY -= scrollSpeed * seconds;
  });
  kd.A.down(function() {
    focusX -= scrollSpeed * seconds;
  });
  kd.S.down(function() {
    focusY += scrollSpeed * seconds;
  });
  kd.D.down(function() {
    focusX += scrollSpeed * seconds;
  });
});

$(window).keypress(function(e) {
  var char = String.fromCharCode(e.keyCode);
  // console.log(e.keyCode);
  // console.log(char);
  if (char == '-') {
    if (SIZE > 1) {
      SIZE /= 2;
      focusX /= 2;
      focusY /= 2;
    }
  } else if (char == '=') {
    SIZE *= 2;
    focusX *= 2;
    focusY *= 2;
  } else if (char == '[') {
    if (currentLayer > 0) {
      currentLayer--;
      focusX *= 2;
      focusY *= 2;
    }
  } else if (char == ']') {
    if (currentLayer < world.grid.length - 1) {
      currentLayer++;
      focusX /= 2;
      focusY /= 2;
    }
  }
});
