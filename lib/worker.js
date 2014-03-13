onmessage = function (event) {
  var oldString = event.data.oldString;
  var newString = event.data.newString;
  var result    = core.executeDiff(oldString, newString);

  postMessage(result);
};

//{{DIFF_HELPERS}}

var core = {
  //{{DIFF_CORE}}
};
