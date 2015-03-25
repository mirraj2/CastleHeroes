package heroes.model;

public enum Faction {
  PURPLE, YELLOW;

  public String color() {
    return name();
  }
}
