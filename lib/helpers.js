function clonePath(path) {
  return { newPos: path.newPos, components: path.components.slice(0) };
}
function removeEmpty(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i]) {
      ret.push(array[i]);
    }
  }
  return ret;
}
function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');

  return n;
}
