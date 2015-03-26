var canvas = $("canvas")[0];
var g = wrapContext(canvas.getContext("2d"));
var socket = connect(ip, 39141);
var world, factions;
var width, height;
var myX, myY;
var seconds;

$(function() {
  socket.message(handleMessage);
  $(window).resize(resize);
  resize();
  loop();
});

function handleMessage(msg) {
  var data = JSON.parse(msg.data);
  var command = data.command;

  if (command == "world") {
    parseWorld(data.world);

    focusX = world[1].length / 2 * TW;
    focusY = world[1][0].length / 2 * TH;
  } else if (command == "spawn") {
    currentLayer = data.layer;
    myX = data.x * TW + TW / 2;
    myY = data.y * TH + TH / 2;
  } else if (command == "chat") {
    handleChat(data);
  } else {
    console.log("Unknown command: " + command);
  }
}

function render() {
  g.save();
  if (world) {
    renderWorld(g);
  }
  g.restore();
  renderFPS();
}

function resize() {
  canvas.width = width = window.innerWidth;
  canvas.height = height = window.innerHeight;
}

var last = lastFPSUpdate = Date.now();
var frame, fps;
function loop() {
  var now = Date.now();
  var delta = now - last;

  frame++;
  if (now - lastFPSUpdate >= 1000) {
    fps = frame * 1000.0 / (now - lastFPSUpdate);
    lastFPSUpdate = now;
    frame = 0;
  }

  seconds = delta / 1000;
  update(seconds);
  render();
  last = now;

  requestAnimationFrame(loop);
}

function renderFPS() {
  var text = "FPS: " + Math.round(fps);
  g.font("16px Arial").color("white").drawString(text, width - g.getWidth(text) - 10, 16 * 1.5);
}

function update(seconds) {
  tickPlayer(seconds);
}

function parseWorld(worldData) {
  factions = worldData.factions;

  world = new Array(worldData.layers.length);
  $.each(worldData.layers, function(index, layer) {
    var width = layer.width;
    var height = layer.height;

    var layerGrid = new Array(width);
    for (var i = 0; i < width; i++) {
      layerGrid[i] = new Array(height);
    }
    world[index] = layerGrid;

    var bytes = window.atob(layer.data);
    var tileIndex = 0;
    for (var i = 0; i < bytes.length; i++) {
      var tile = {};
      tile.type = bytes.charCodeAt(i);
      if (tile.type == TOWER || tile.type == SPAWN) {
        tile.faction = factions[bytes.charCodeAt(++i)];
      }
      world[index][Math.floor(tileIndex / height)][tileIndex % height] = tile;

      tileIndex++;
    }
  });
}
