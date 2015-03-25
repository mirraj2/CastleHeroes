package heroes.web;

import heroes.model.World;
import jasonlib.Json;
import jasonlib.Log;
import java.net.InetSocketAddress;
import java.util.Arrays;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class HeroSocketServer extends WebSocketServer {

  private final World world = new World();

  public static void main(String[] args) {
    System.out.println(Arrays.toString("abc".split("")));
  }

  public HeroSocketServer(int port) {
    super(new InetSocketAddress(port));
  }

  @Override
  public void onOpen(WebSocket conn, ClientHandshake handshake) {
    Log.info("Client connected!");

    Json json = Json.object()
        .with("command", "world")
        .with("world", world.toJson());
    conn.send(json.toString());
  }

  @Override
  public void onClose(WebSocket conn, int code, String reason, boolean remote) {
  }

  @Override
  public void onMessage(WebSocket conn, String message) {
  }

  @Override
  public void onError(WebSocket conn, Exception ex) {
    ex.printStackTrace();
  }

}
