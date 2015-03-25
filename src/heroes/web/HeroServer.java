package heroes.web;

import jasonlib.Config;
import jasonlib.Log;
import bowser.WebServer;

public class HeroServer {

  private final Config config = Config.load("hero");

  private void run() {
    boolean devMode = config.getBoolean("dev_mode", false);

    String ip = devMode ? "localhost" : "heroes.jasonmirra.com";
    int httpPort = config.getInt("port", devMode ? 8080 : 80);
    int websocketPort = config.getInt("websocket_port", 39141);

    Log.info("Starting web server on port " + httpPort);

    new WebServer("Castle Heroes", httpPort, devMode)
        .shortcut("jquery", "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js")
        .shortcut("bootstrap", "//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css")
        .shortcut("bootstrap", "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.2/js/bootstrap.min.js")
        .shortcut("cookie", "//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js")
        .shortcut("buzz", "//cdnjs.cloudflare.com/ajax/libs/buzz/1.1.8/buzz.min.js")
        .controller(new HomePage(ip))
        .start();

    new HeroSocketServer(websocketPort).start();

    Log.info("Server started.");
  }

  public static void main(String[] args) {
    new HeroServer().run();
  }

}
