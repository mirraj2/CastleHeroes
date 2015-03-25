var canvas = $("canvas")[0];
var g = wrapContext(canvas.getContext("2d"));
var socket = connect(ip, 39141);
var world, factions;

$(function() {
  socket.message(handleMessage);
  $(window).resize(resize);
  resize();
  render();
});

function handleMessage(msg) {
  var data = JSON.parse(msg.data);
  var command = data.command;

  if (command == "world") {
    world = data.world;

    parseWorld();

    focusX = world.grid[1].length / 2 * SIZE;
    focusY = world.grid[1][0].length / 2 * SIZE;
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

var last = Date.now();
function render() {
  var now = Date.now();
  var delta = now - last;

  seconds = delta / 1000;
  update();

  g.save();
  if (world) {
    renderWorld(world, g);
  }
  g.restore();

  last = now;

  requestAnimationFrame(render);
}

function update() {
  kd.tick();
}

function parseWorld() {
  factions = world.factions;

  world.grid = new Array(world.layers.length);
  $.each(world.layers, function(index, layer) {
    var width = layer.width;
    var height = layer.height;

    var grid = new Array(width);
    for (var i = 0; i < width; i++) {
      grid[i] = new Array(height);
    }
    world.grid[index] = grid;

    var bytes = window.atob(layer.data);
    var tileIndex = 0;
    for (var i = 0; i < bytes.length; i++) {
      var tile = {};
      tile.type = bytes.charCodeAt(i);
      if (tile.type == TOWER) {
        tile.faction = factions[bytes.charCodeAt(++i)];
      }
      world.grid[index][Math.floor(tileIndex / height)][tileIndex % height] = tile;

      tileIndex++;
    }
  });
  delete world.layers;
}
