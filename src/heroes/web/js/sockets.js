function connect(ip, port) {
  if (!window.WebSocket) {
    console.log("websockets not supported!");
    return;
  }

  var socket = new WebSocket("ws://" + ip + ":" + port + "/");

  return {
    send : function(data) {
      socket.send(JSON.stringify(data));
      return this;
    },
    open : function(e) {
      socket.onopen = e;
      return this;
    },
    close : function(e) {
      socket.onclose = e;
      return this;
    },
    message : function(e) {
      socket.onmessage = e;
      return this;
    }
  };
}
