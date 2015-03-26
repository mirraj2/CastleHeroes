function tickPlayer(seconds) {
  if (chatting) {
    return;
  }

  var dx = 0, dy = 0;
  if (keys.isDown("W", "UP")) {
    dy--;
  }
  if (keys.isDown("A", "LEFT")) {
    dx--;
  }
  if (keys.isDown("S", "DOWN")) {
    dy++;
  }
  if (keys.isDown("D", "RIGHT")) {
    dx++;
  }

  var moveSpeed = TW * 2;
  if (dx * dy != 0) {
    // they are moving diagonally
    moveSpeed *= Math.SQRT1_2;
  }

  if (dx != 0 || dy != 0) {
    if (!attemptMove(myX + dx * moveSpeed * seconds, myY + dy * moveSpeed * seconds)) {
      moveSpeed = TW * 2;
      attemptMove(myX + dx * moveSpeed * seconds, myY);
      attemptMove(myX, myY + dy * moveSpeed * seconds);
    }
  }
}

function attemptMove(toX, toY) {
  var rx = 35;
  var ry = 10;

  var tiles = [];
  tiles.push(getTileAt(toX - rx, toY - ry));
  tiles.push(getTileAt(toX - rx, toY + ry));
  tiles.push(getTileAt(toX + rx, toY - ry));
  tiles.push(getTileAt(toX + rx, toY + ry));

  for (var i = 0; i < tiles.length; i++) {
    if (isCollision(tiles[i])) {
      return false;
    }
  }

  myX = toX;
  myY = toY;

  return true;
}

function isCollision(tile) {
  if (!tile) {
    return true;
  }
  return COLLISIONS[tile.type];
}

function getTileAt(x, y) {
  x = Math.floor(x / TW);
  y = Math.floor(y / TH);
  var ret = world[currentLayer][x];
  if (ret) {
    ret = ret[y];
  }
  return ret;
}

function teleportUp() {
  if (currentLayer == world.length - 1) {
    return;
  }

  var i = Math.floor(Math.floor(myX / TW) / 2);
  var j = Math.floor(Math.floor(myY / TH) / 2);

  myX = i * TW + TW / 2;
  myY = j * TH + TH / 2;
  currentLayer++;
}

function teleportDown() {
  if (currentLayer == 0) {
    return;
  }

  var i = Math.floor(myX / TW) * 2;
  var j = Math.floor(myY / TH) * 2;

  myX = i * TW + TW / 2;
  myY = j * TH + TH / 2;
  currentLayer--;
}

function takeAction() {
  var tile = getTileAt(myX, myY);
  var type = tile.type;
  if (type == PORTAL_UP) {
    teleportUp();
  } else if (type == PORTAL_DOWN) {
    teleportDown();
  }
}
