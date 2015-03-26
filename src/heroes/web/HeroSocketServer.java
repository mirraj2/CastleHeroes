package heroes.web;

import heroes.model.Faction;
import heroes.model.Tile;
import heroes.model.World;
import jasonlib.Json;
import jasonlib.Log;
import jasonlib.util.Utils;
import java.net.InetSocketAddress;
import java.util.Map;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import com.google.common.collect.Maps;

public class HeroSocketServer extends WebSocketServer {

  private final Map<WebSocket, WebSocket> players = Maps.newConcurrentMap();

  private final World world = new World();

  public HeroSocketServer(int port) {
    super(new InetSocketAddress(port));
  }

  @Override
  public void onOpen(WebSocket conn, ClientHandshake handshake) {
    players.put(conn, conn);

    Log.info("Client connected!");

    Json json = Json.object()
        .with("command", "world")
        .with("world", world.toJson());
    conn.send(json.toString());

    Faction faction = Utils.random(Faction.values());
    Tile t = world.getSpawn(faction);
    conn.send(Json.object()
        .with("command", "spawn")
        .with("layer", t.k)
        .with("x", t.i)
        .with("y", t.j)
        .toString());
  }

  @Override
  public void onMessage(WebSocket conn, String message) {
    Json json = new Json(message);
    String command = json.get("command");
    if (command.equals("chat")) {
      json.with("from", "Guest");
      sendToAll(json);
    } else {
      Log.warn("Unknown command: " + command);
    }
  }

  private void sendToAll(Json json) {
    String s = json.toString();
    for (WebSocket socket : players.values()) {
      try {
        socket.send(s);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  @Override
  public void onClose(WebSocket conn, int code, String reason, boolean remote) {
    players.remove(conn);
  }

  @Override
  public void onError(WebSocket conn, Exception ex) {
    ex.printStackTrace();
  }

}
