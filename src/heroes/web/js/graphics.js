function wrapContext(g) {
  return {
    color : function(color) {
      g.fillStyle = color;
      g.strokeStyle = color;
      return this;
    },
    fillRect : function(x, y, width, height) {
      g.fillRect(x, y, width, height);
      return this;
    },
    fillOval : function(x, y, width, height) {
      g.beginPath();
      g.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI, false);
      g.fill();
      return this;
    },
    drawLine : function(x, y, x2, y2) {
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x2, y2);
      g.stroke();
      return this;
    },
    drawString : function(s, x, y, width, height) {
      g.fillText(s, x, y);
      return this;
    },
    drawImage : function(img, x, y, width, height) {
      if (!img.loaded) {
        return this;
      }
      if (arguments.length == 3) {
        width = img.width;
        height = img.height;
      }
      g.drawImage(img.img, x, y, width, height);
      return this;
    },
    font : function(font) {
      g.font = font;
      return this;
    },
    translate : function(x, y) {
      g.translate(x, y);
      return this;
    },
    save : function() {
      g.save();
      return this;
    },
    restore : function() {
      g.restore();
      return this;
    }
  };
}