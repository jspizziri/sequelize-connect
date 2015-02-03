// Recurse through the specified directory structure
var dive = function (dir, action, matcher) {
  // Assert that it's a function
  if (typeof action !== "function")
    action = function (error, file) { };

  // Read the directory
  fs.readdirSync(dir).forEach(function (file) {
    var path = dir + "/" + file;  // Full path of that file
    var stat = fs.statSync(path); // Get the file's stats

    // If the file is a directory
    if (stat && stat.isDirectory())
      dive(path, action); // Dive into the directory
    else {
      // Allow user to define a custom matcher function
      if(typeof matcher === 'function' && matcher(file) === true) {
        action(null, path); // Call the action
      else if((file.indexOf(".") !== 0) && (file.indexOf(".model.js") > 0))
        action(null, path); // Call the action
    }
  });
};


module.exports = dive;