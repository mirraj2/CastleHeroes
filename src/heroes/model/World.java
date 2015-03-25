package heroes.model;

import heroes.mapgen.MapGenerator;
import jasonlib.Json;
import jasonlib.Log;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import com.google.common.base.Stopwatch;

public class World {

  private final Tile[][][] grid;

  public World() {
    this(256, 128, 3);
    // this(32, 32, 1);
  }

  public World(int baseWidth, int baseHeight, int numLayers) {
    Stopwatch watch = Stopwatch.createStarted();
    grid = new MapGenerator().generate(baseWidth, baseHeight, numLayers);
    Log.info("Generated world in " + watch);
  }

  public Json toJson() {
    Json ret = Json.object();

    Json layers = Json.array();
    for (int k = 0; k < grid.length; k++) {
      Tile[][] layer = grid[k];
      Json layerJson = Json.object()
          .with("width", layer.length)
          .with("height", layer[0].length)
          .with("data", serialize(layer));
      layers.add(layerJson);
    }
    ret.with("layers", layers);
    ret.with("factions", serializeFactions());

    return ret;
  }

  private String serialize(Tile[][] layer) {
    ByteArrayOutputStream baos = new ByteArrayOutputStream(layer.length * layer[0].length * 2);
    for (int i = 0; i < layer.length; i++) {
      for (int j = 0; j < layer[i].length; j++) {
        Tile t = layer[i][j];
        baos.write(t.type.ordinal());
        if (t.faction != null) {
          baos.write(t.faction.ordinal());
        }
      }
    }
    return Base64.getEncoder().encodeToString(baos.toByteArray());
  }

  private Json serializeFactions() {
    Json ret = Json.array();
    for (Faction faction : Faction.values()) {
      ret.add(Json.object().with("name", faction.name()).with("color", faction.color()));
    }
    return ret;
  }

}
