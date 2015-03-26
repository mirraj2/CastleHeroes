var GRASS = 0, WATER = 1, WALL = 2, TOWER = 3, PORTAL_DOWN = 4, PORTAL_UP = 5, ROCK = 6
var DIRT = 7, LAVA = 8, CLOUD = 9, SKY = 10, SPAWN = 11;

var COLLISIONS = [ 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0 ];

var HELL = 0;

var originalTW = 101, originalTH = 82;

var currentLayer = 1;
var TW = originalTW, TH = originalTH;
var clip = {};

var portalUp = load("portal_up.png");
var portalDown = load("portal_down.png");
var rock = load("rock.png");
var wall = load("stone_block.png");
var grass = load("grass.png");
var tower = load("tower.png");
var water = load("water.png");
var lava = load("lava.png");
var dirt = load("dirt.png");
var cloud = load("cloud.png");
var sky = load("sky.png");
var bow = load("bow_arrow.png");
var boy = load("boy.png");

function renderWorld(g) {
  g.color("black").fillRect(0, 0, width, height);

  var transX = Math.round(width / 2 - myX);
  var transY = Math.round(height / 2 - myY);
  clip.x = -transX;
  clip.y = -transY;
  clip.w = width;
  clip.h = height;
  g.clip(clip);

  g.save();
  g.translate(transX, transY);
  drawGround(g);
  g.restore();
  // drawGrid(g, transX, transY);
  g.save();
  g.translate(transX, transY);
  drawObjects(g);
  g.restore();

  g.clip(null);
}

function drawObjects(g) {
  var grid = world[currentLayer];
  var drawnMe = false;
  for (var j = 0; j < grid[0].length; j++) {
    if (!drawnMe && myY < j * TH) {
      g.drawImage(boy, myX - boy.width / 2, myY - boy.height * .75);
      drawnMe = true;
    }
    for (var i = 0; i < grid.length; i++) {
      var tile = grid[i][j];
      var type = tile.type;

      if (type == TOWER) {
        drawImage(tower, i, j);
        g.drawImage(bow, i * TW + TW * .3, j * TH + TH * .3, TH / 2 * bow.width / bow.height, TH / 2);
      } else if (type == PORTAL_UP) {
        var height = portalUp.height / portalUp.width * TW;
        drawImage(portalUp, i, j);
      } else if (type == PORTAL_DOWN) {
        drawImage(portalDown, i, j);
      } else if (type == ROCK) {
        drawImage(rock, i, j);
      } else if (type == WALL) {
        drawImage(wall, i, j);
      }
    }
  }

  if (!drawnMe) {
    g.drawImage(boy, myX - boy.width / 2, myY - boy.height * .75);
  }
}

function drawGround(g) {
  var grid = world[currentLayer];
  var HEAVEN = world.length - 1;

  for (var j = 0; j < grid[0].length; j++) {
    for (var i = 0; i < grid.length; i++) {
      var tile = grid[i][j];
      var type = tile.type;

      if (type == ROCK || type == PORTAL_UP || type == PORTAL_DOWN) {
        if (currentLayer == HELL) {
          type = DIRT;
        } else if (currentLayer == HEAVEN) {
          type = CLOUD;
        } else {
          type = GRASS;
        }
      }

      if (type == WATER) {
        drawImage(water, i, j + .5);
      } else if (type == LAVA) {
        drawImage(lava, i, j + .5);
      } else if (type == DIRT) {
        drawImage(dirt, i, j + .5);
      } else if (type == CLOUD) {
        drawImage(cloud, i, j + .5);
      } else if (type == SKY) {
        drawImage(sky, i, j + .5);
      } else {
        drawImage(grass, i, j + .5);
      }
    }
  }
}

function drawImage(img, i, j) {
  var height = img.height / img.width * TW;
  g.drawImage(img, i * TW, j * TH - height + TH, TW, height);
}

function drawGrid(g, transX, transY) {
  var dx = transX - (Math.floor(transX / TW) * TW);
  var dy = transY - (Math.floor(transY / TH) * TH);

  g.color("rgba(0,0,0,.1)");
  for (var i = dx; i < canvas.width; i += TW) {
    g.drawLine(i, 0, i, canvas.height);
  }
  for (var j = dy; j < canvas.height; j += TH) {
    g.drawLine(0, j, canvas.width, j);
  }
}