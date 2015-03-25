package heroes.model;

public class Tile {

  public Type type;
  public Faction faction;

  public Tile(Type type) {
    this.type = type;
  }

  public Tile type(Type type) {
    this.type = type;
    return this;
  }

  public Tile faction(Faction faction) {
    this.faction = faction;
    return this;
  }

  public boolean is(Type type) {
    return this.type == type;
  }

  public static enum Type {
    GRASS, WATER, WALL, TOWER, PORTAL_DOWN, PORTAL_UP, ROCK;
  }

}
