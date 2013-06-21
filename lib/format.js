var inspect = require("util").inspect

var formatRegExp = /%[sdj%]/g;
// copy paste from require("util").format
module.exports = function(f) {
  if (typeof f !== "string") {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(" ");
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === "%%") {
      return "%";
    }
    if (i >= len) {
      return x;
    }
    switch (x) {
      case "%s": return String(args[i++]);
      case "%d": return Number(args[i++]);
      case "%j": return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  // DO NOT APPEND REMAINING ARGUMENTS
  // for (var x = args[i]; i < len; x = args[++i]) {
  //   if (x === null || typeof x !== "object") {
  //     str += " " + x;
  //   } else {
  //     str += " " + inspect(x);
  //   }
  // }
  return str;
};
