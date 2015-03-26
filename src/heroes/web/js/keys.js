var keys = {
  'A' : 65,
  'B' : 66,
  'C' : 67,
  'D' : 68,
  'E' : 69,
  'F' : 70,
  'G' : 71,
  'H' : 72,
  'I' : 73,
  'J' : 74,
  'K' : 75,
  'L' : 76,
  'M' : 77,
  'N' : 78,
  'O' : 79,
  'P' : 80,
  'Q' : 81,
  'R' : 82,
  'S' : 83,
  'T' : 84,
  'U' : 85,
  'V' : 86,
  'W' : 87,
  'X' : 88,
  'Y' : 89,
  'Z' : 90,
  'ENTER' : 13,
  'SHIFT' : 16,
  'ESC' : 27,
  'SPACE' : 32,
  'LEFT' : 37,
  'UP' : 38,
  'RIGHT' : 39,
  'DOWN' : 40,
  'MINUS' : 45,
  'EQUALS' : 61,
  'LEFT_BRACE' : 91,
  'RIGHT_BRACE' : 93,
  'LEFT' : 37,
  'UP' : 38,
  'RIGHT' : 39,
  'DOWN' : 40
};

(function(api) {
  var keys = new Array(1024);
  for (var i = 0; i < keys.length; i++) {
    keys[i] = false;
  }

  $(window).keydown(function(e) {
    // console.log(e.which);
    keys[e.which] = true;
  });
  $(window).keyup(function(e) {
    keys[e.which] = false;
  });

  api.isDown = function() {
    for (var i = 0; i < arguments.length; i++) {
      var code = api[arguments[i]];
      if (!code) {
        throw "Unsupported key: " + s;
      }
      if (keys[code]) {
        return true;
      }
    }
    return false;
  };

}(keys));
