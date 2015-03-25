package heroes.mapgen.perlin;

public abstract class NoiseFunction {

  public static final double[] powersOfTwo = new double[100];

  static {
    for (int i = 0; i < powersOfTwo.length; i++) {
      powersOfTwo[i] = Math.pow(2, i - 2);
    }
  }
  
  public double zoom = 1.0;
  protected int numOctaves = 1;

  public abstract double getValue(double x, double y);

  public int getNumOctaves() {
    return numOctaves;
  }

  public void setOctaves(int octaves) {
    this.numOctaves = octaves;
  }

}