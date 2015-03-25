var loadCache = {};

function load(url) {
  var ret = loadCache[url];
  if (ret) {
    return ret;
  }

  ret = {
    loaded : false,
    img : new Image()
  };

  ret.img.onload = function() {
    ret.loaded = true;
    ret.width = ret.img.width;
    ret.height = ret.img.height;
  };
  ret.img.src = "rez/" + url;

  loadCache[url] = ret;

  return ret;
}
