var chatPanel = $(".chat-panel").hide();
var chatOutput = $(".chat-output");
var chatInput = chatPanel.find("input");
var chatting = false;

function handleChat(data) {
  chatOutput.append($("<div>").append($("<b>").text(data.from + ": ")).append($("<span>").text(data.text)));
  chatOutput.scrollTop(chatOutput[0].scrollHeight);
}

$(window).keydown(function(e) {
  if (e.keyCode == keys.ENTER) {
    chatting = !chatting;
    chatPanel.toggle();
    if (chatting) {
      chatInput.focus();
    } else {
      var text = chatInput.val().trim();
      chatInput.val("");
      if (text) {
        socket.send({
          command : "chat",
          text : text
        });
      }
    }
  }
});
