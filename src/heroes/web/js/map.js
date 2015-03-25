var GRASS = 0, WATER = 1, WALL = 2, TOWER = 3, PORTAL_DOWN = 4, PORTAL_UP = 5, ROCK = 6;

var currentLayer = 1;
var focusX = 0, focusY = 0;
var SIZE = 64; //101 x 80

var waterColors = [ "#BA0000", "blue", "#646EF5" ];
var grassColors = [ "#736953", "#6DDB56", "#D4FCFF" ]

var portalUp = load("portal_up.png");
var portalDown = load("portal_down.png");
var rock = load("rock.png");
var wall = load("stone_block.png");
var grass = load("grass.png");
var tower = load("tower.png");

function renderWorld(world, g) {
  g.color(waterColors[currentLayer]).fillRect(0, 0, canvas.width, canvas.height);

  g.save();
  var transX = Math.round(canvas.width / 2 - focusX);
  var transY = Math.round(canvas.height / 2 - focusY);
  g.translate(transX, transY);

  var grid = world.grid[currentLayer];

  for (var j = 0; j < grid[0].length; j++) {
    for (var i = 0; i < grid.length; i++) {
      var tile = grid[i][j];
      var type = tile.type;
      if (type == WATER) {
        g.color(waterColors[currentLayer]);
      } else {
        g.color(grassColors[currentLayer]);
      }
      g.fillRect(i * SIZE, j * SIZE, SIZE, SIZE);
      if (type == TOWER) {
        drawImage(tower, i, j);
        // g.color(tile.faction.color).fillOval(i * SIZE, j * SIZE, SIZE, SIZE);
      } else if (type == PORTAL_UP) {
        var height = portalUp.height / portalUp.width * SIZE;
        g.drawImage(portalUp, i * SIZE, j * SIZE - height + SIZE - SIZE / 10, SIZE, height);
      } else if (type == PORTAL_DOWN) {
        var height = portalDown.height / portalDown.width * SIZE;
        g.drawImage(portalDown, i * SIZE, j * SIZE - height + SIZE - SIZE / 10, SIZE, height);
      } else if (type == ROCK) {
        drawImage(rock, i, j);
      } else if (type == WALL) {
        drawImage(wall, i, j);
      }
      // g.color("black").font(SIZE + "px serif").drawString("D", i * SIZE, j *
      // SIZE + SIZE - SIZE / 7, SIZE, SIZE);
    }
  }

  g.restore();

  drawGrid(g, transX, transY);
}

function drawImage(img, i, j) {
  var height = img.height / img.width * SIZE;
  g.drawImage(img, i * SIZE, j * SIZE - height + SIZE, SIZE, height);
}

function drawGrid(g, transX, transY) {
  var dx = transX - (Math.floor(transX / SIZE) * SIZE);
  var dy = transY - (Math.floor(transY / SIZE) * SIZE);

  g.color("rgba(0,0,0,.1)");
  for (var i = dx; i < canvas.width; i += SIZE) {
    g.drawLine(i, 0, i, canvas.height);
  }
  for (var j = dy; j < canvas.height; j += SIZE) {
    g.drawLine(0, j, canvas.width, j);
  }
}