onmessage = function (event) {
  var oldString = event.data.oldString;
  var newString = event.data.newString;
  var result    = logic.diff(oldString, newString);

  postMessage(result);
};

var logic = {
  diff: function (oldString, newString) {
    // Handle the identity case (this is due to unrolling editLength == 0
    if (newString === oldString) {
      return [{ value: newString }];
    }
    if (!newString) {
      return [{ value: oldString, removed: true }];
    }
    if (!oldString) {
      return [{ value: newString, added: true }];
    }

    newString = this.tokenize(newString);
    oldString = this.tokenize(oldString);

    var newLen = newString.length, oldLen = oldString.length;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{ newPos: -1, components: [] }];

    // Seed editLength = 0
    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos+1 >= newLen && oldPos+1 >= oldLen) {
      return bestPath[0].components;
    }

    for (var editLength = 1; editLength <= maxEditLength; editLength++) {
      for (var diagonalPath = -1*editLength; diagonalPath <= editLength; diagonalPath+=2) {
        var basePath;
        var addPath = bestPath[diagonalPath-1],
            removePath = bestPath[diagonalPath+1];
        oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath-1] = undefined;
        }

        var canAdd = addPath && addPath.newPos+1 < newLen;
        var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
          basePath = clonePath(removePath);
          this.pushComponent(basePath.components, oldString[oldPos], undefined, true);
        } else {
          basePath = clonePath(addPath);
          basePath.newPos++;
          this.pushComponent(basePath.components, newString[basePath.newPos], true, undefined);
        }

        var oldPos = this.extractCommon(basePath, newString, oldString, diagonalPath);

        if (basePath.newPos+1 >= newLen && oldPos+1 >= oldLen) {
          return basePath.components;
        } else {
          bestPath[diagonalPath] = basePath;
        }
      }
    }
  },

  pushComponent: function(components, value, added, removed) {
    var last = components[components.length-1];
    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length-1] =
        {value: this.join(last.value, value), added: added, removed: removed };
    } else {
      components.push({value: value, added: added, removed: removed });
    }
  },

  extractCommon: function(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath;
    while (newPos+1 < newLen && oldPos+1 < oldLen && this.equals(newString[newPos+1], oldString[oldPos+1])) {
      newPos++;
      oldPos++;

      this.pushComponent(basePath.components, newString[newPos], undefined, undefined);
    }
    basePath.newPos = newPos;
    return oldPos;
  },

  equals: function(left, right) {
    var reWhitespace = /\S/;
    if (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right)) {
      return true;
    } else {
      return left === right;
    }
  },
  join: function(left, right) {
    return left + right;
  },
  tokenize: function(value) {
    return value;
  }
};


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
