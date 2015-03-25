package heroes.mapgen;

import static com.google.common.base.Preconditions.checkState;
import heroes.mapgen.perlin.ContinentGenerator;
import heroes.model.Faction;
import heroes.model.Tile;
import heroes.model.Tile.Type;
import jasonlib.Log;
import java.util.Random;

public class MapGenerator {

  private static final Random rand = new Random();

  public Tile[][][] generate(int baseWidth, int baseHeight, int numLayers) {
    Tile[][][] grid = new Tile[numLayers][][];

    int w = baseWidth, h = baseHeight;
    for (int k = 0; k < numLayers; k++) {
      grid[k] = new Tile[w][h];
      w /= 2;
      h /= 2;
    }

    ContinentGenerator generator = new ContinentGenerator();
    for (int k = 0; k < numLayers; k++) {
      double panX = Math.random() * 100000;
      double panY = Math.random() * 100000;
      for (int i = 0; i < grid[k].length; i++) {
        for (int j = 0; j < grid[k][i].length; j++) {
          double val = generator.getValue((i + panX) / 4, (j + panY) / 4);
          grid[k][i][j] = new Tile(val < .45 ? Type.WATER : Type.GRASS);
        }
      }
      generator.zoom *= 2;
    }

    generateBases(grid);
    generatePortals(grid);
    generateRocks(grid);

    return grid;
  }

  private void generateRocks(Tile[][][] grid) {
    for (int layer = 0; layer <= grid.length / 2; layer++) {
      int totalTiles = grid[layer].length * grid[layer][0].length;
      int numRocks = (int) Math.ceil((.003 * (.5 + Math.random())) * totalTiles);
      for (int i = 0; i < numRocks; i++) {
        generateRock(grid[layer]);
      }
    }
  }

  private void generateRock(Tile[][] grid) {
    for (int i = 0; i < 1000; i++) {
      int x = rand.nextInt(grid.length);
      int y = rand.nextInt(grid[0].length);

      Tile t = grid[x][y];
      if (t.is(Type.GRASS)) {
        t.type = Type.ROCK;
        return;
      }
    }
    throw new RuntimeException("Problem finding a spot for a rock!");
  }

  private void generatePortals(Tile[][][] grid) {
    for (int layer = 0; layer < grid.length - 1; layer++) {
      int totalTiles = grid[layer].length * grid[layer][0].length;
      int numPortalsUp = (int) Math.ceil(.0002 * totalTiles);

      for (int i = 0; i < numPortalsUp; i++) {
        generatePortal(grid[layer], grid[layer + 1]);
      }
    }
  }

  private void generatePortal(Tile[][] lowerLevel, Tile[][] upperLevel) {
    for (int i = 0; i < 1000; i++) {
      int x = rand.nextInt(upperLevel.length);
      int y = rand.nextInt(upperLevel[0].length);

      Tile a = lowerLevel[x * 2][y * 2];
      Tile b = upperLevel[x][y];

      if (a.type == Type.GRASS && b.type == Type.GRASS) {
        a.type = Type.PORTAL_UP;
        b.type = Type.PORTAL_DOWN;
        return;
      }
    }
    throw new RuntimeException("Problem finding a spot for a portal!");
  }

  private void generateBases(Tile[][][] grid) {
    Tile[][] layer = grid[1];
    for (Faction faction : Faction.values()) {
      checkState(generateBase(layer, faction));
    }
  }

  private boolean generateBase(Tile[][] layer, Faction faction) {
    for (int i = 0; i < 1000; i++) {
      int x = rand.nextInt(layer.length);
      int y = rand.nextInt(layer[0].length);

      if (generateBase(layer, x, y, faction)) {
        return true;
      }
    }
    return false;
  }

  private boolean generateBase(Tile[][] layer, int x, int y, Faction faction) {
    // make sure there is a NxN area of grass centered on this tile.
    int size = 7;

    if (!isGrass(layer, x, y, size)) {
      // Log.debug("base blocked!");
      return false;
    }

    Log.debug(faction + "'s base is at " + x + ", " + y);

    int offset = size / 2;
    for (int i = -offset; i <= offset; i++) {
      for (int j = -offset; j <= offset; j++) {
        if (i == -offset || j == -offset || i == offset || j == offset) {
          if (i != 0 && j != 0) {
            layer[x + i][y + j].type = Type.WALL;
          }
        }
      }
    }

    layer[x - 2][y - 2].type(Type.TOWER).faction(faction);
    layer[x - 2][y + 2].type(Type.TOWER).faction(faction);
    layer[x + 2][y - 2].type(Type.TOWER).faction(faction);
    layer[x + 2][y + 2].type(Type.TOWER).faction(faction);

    return true;
  }

  private boolean isGrass(Tile[][] layer, int x, int y, int size) {
    for (int i = -size / 2; i <= size / 2; i++) {
      for (int j = -size / 2; j <= size / 2; j++) {
        Tile t = getTile(layer, x + i, y + j);
        if (t == null || t.type != Type.GRASS) {
          return false;
        }
      }
    }
    return true;
  }

  private Tile getTile(Tile[][] layer, int i, int j) {
    if (i < 0 || j < 0 || i >= layer.length || j >= layer[i].length) {
      return null;
    }
    return layer[i][j];
  }

}
