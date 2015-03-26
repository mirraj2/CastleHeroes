package heroes.model;

public class Tile {

  public final int k, i, j;
  public Type type;
  public Faction faction;

  public Tile(int k, int i, int j, Type type) {
    this.type = type;
    this.k = k;
    this.i = i;
    this.j = j;
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

  public boolean canHaveObject() {
    return type == Type.GRASS || type == Type.DIRT || type == Type.CLOUD;
  }

  public static enum Type {
    GRASS, WATER, WALL, TOWER, PORTAL_DOWN, PORTAL_UP, ROCK, DIRT, LAVA, CLOUD, SKY, SPAWN;
  }

}
