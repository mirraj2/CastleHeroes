package heroes.mapgen.perlin;

import jasonlib.swing.component.GFrame;
import jasonlib.swing.global.GFocus;
import jasonlib.swing.global.GKeyboard;
import java.awt.Graphics;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseWheelEvent;
import java.awt.event.MouseWheelListener;
import java.awt.image.BufferedImage;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import javax.swing.JComponent;
import com.google.common.base.Stopwatch;
import com.google.common.util.concurrent.Uninterruptibles;

public class PerlinExplorer extends JComponent {

  private static final double SCROLL_SPEED = 10;

  private BufferedImage buffer = new BufferedImage(1, 1, BufferedImage.TYPE_INT_RGB);
  private int maxWidth, maxHeight;

  private double panX = Math.random() * 100000, panY = Math.random() * 100000;
  private final NoiseFunction function = new ContinentGenerator();
  private final ColoringFunction coloring = new GrassWaterColoring();

  public PerlinExplorer() {
    listen();
  }

  @Override
  public void paintComponent(Graphics g) {
    Stopwatch watch = Stopwatch.createStarted();

    if (buffer.getWidth() < getWidth() || buffer.getHeight() < getHeight()) {
      maxWidth = Math.max(maxWidth, getWidth());
      maxHeight = Math.max(maxHeight, getHeight());
      buffer = new BufferedImage(maxWidth + 100, maxHeight + 100, BufferedImage.TYPE_INT_RGB);
    }

    renderToBuffer(g);

    g.drawImage(buffer, 0, 0, null);
    System.out.println(watch);
  }

  private void renderToBuffer(Graphics g) {
    int w = getWidth(), h = getHeight();
    int[] rgbArray = new int[w * h];

    final double panX = this.panX;
    final double panY = this.panY;

    int c = 0;
    for (int y = 0; y < h; y++) {
      for (int x = 0; x < w; x++) {
        double totalNoise = function.getValue((x + panX) / 4, (y + panY) / 4);
        rgbArray[c++] = coloring.getColor(totalNoise);
      }
    }

    buffer.setRGB(0, 0, w, h, rgbArray, 0, w);
  }

  private void listen() {
    Executors.newSingleThreadExecutor().execute(listener);

    addKeyListener(new KeyAdapter() {
      @Override
      public void keyPressed(KeyEvent e) {
        int code = e.getKeyCode();
        if (code == KeyEvent.VK_MINUS) {
          function.setOctaves(Math.max(function.getNumOctaves() - 1, 1));
          repaint();
        } else if (code == KeyEvent.VK_EQUALS) {
          function.setOctaves(Math.min(function.getNumOctaves() + 1, 15));
          repaint();
        }
      }
    });

    addMouseListener(new MouseAdapter() {
      @Override
      public void mousePressed(MouseEvent e) {
        if (!hasFocus()) {
          requestFocus();
        }
      }
    });

    addMouseWheelListener(new MouseWheelListener() {
      @Override
      public void mouseWheelMoved(MouseWheelEvent e) {
        int n = e.getWheelRotation();
        function.zoom += n / 100.0;
        repaint();
      }
    });
  }

  private final Runnable listener = () -> {
    while (true) {
      if (GKeyboard.isKeyDown(KeyEvent.VK_UP) || GKeyboard.isKeyDown(KeyEvent.VK_W)) {
        panY -= SCROLL_SPEED * function.zoom;
        repaint();
      }
      if (GKeyboard.isKeyDown(KeyEvent.VK_RIGHT) || GKeyboard.isKeyDown(KeyEvent.VK_D)) {
        panX += SCROLL_SPEED * function.zoom;
        repaint();
      }
      if (GKeyboard.isKeyDown(KeyEvent.VK_DOWN) || GKeyboard.isKeyDown(KeyEvent.VK_S)) {
        panY += SCROLL_SPEED * function.zoom;
        repaint();
      }
      if (GKeyboard.isKeyDown(KeyEvent.VK_LEFT) || GKeyboard.isKeyDown(KeyEvent.VK_A)) {
        panX -= SCROLL_SPEED * function.zoom;
        repaint();
      }

      Uninterruptibles.sleepUninterruptibly(30, TimeUnit.MILLISECONDS);
    }
  };

  public static void main(String[] args) {
    PerlinExplorer content = new PerlinExplorer();
    GFrame.create().content(content).size(128, 100).start();
    GFocus.focus(content);
  }
}