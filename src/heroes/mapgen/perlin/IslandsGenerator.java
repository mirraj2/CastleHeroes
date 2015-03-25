package heroes.mapgen.perlin;

import jasonlib.Log;

public class IslandsGenerator extends NoiseFunction {

  private double totalWeights;

  public IslandsGenerator() {
    setOctaves(8);
  }

  @Override
  public void setOctaves(int numOctaves) {
    Log.info("Setting octaves: %d", numOctaves);

    super.setOctaves(numOctaves);

    totalWeights = Math.pow(2, numOctaves) - 1;
  }

  @Override
  public double getValue(double x, double y) {
    double totalNoise = 0;
    for (int octave = 0; octave < numOctaves; octave++) {
      double scale = powersOfTwo[octave] / 128f * zoom;
      double noise = SimplexNoise.noise(x * scale, y * scale);


      noise = (noise + 1) / 2;

      double p = powersOfTwo[numOctaves - octave + 1] / totalWeights;
      if (p < .01) {
        p = .01;
      }
      noise *= p;

      totalNoise += noise;
    }
    return totalNoise;
  }

}