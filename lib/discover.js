var Promise = require("bluebird")
  , _       = require("lodash")
  , fs      = Promise.promisifyAll(require("fs"));

// Recurse through the specified directory structure
var dive = function (dir, matcher, logger) {

  // Read the directory
  return fs.readdirAsync(dir).map(function (file) {
    var path = dir + "/" + file  // Full path of that file
      , stat = fs.statSync(path); // Get the file's stats

    // If the file is a directory
    if (stat && stat.isDirectory()) {
      return dive(path, matcher, logger); // Dive into the directory
    } else {
      // Allow user to define a custom matcher function
      if(typeof matcher === 'function' && matcher(file) === true) {
        logger.log("debug", "Discovered path: "+path);
        return path;
      } else if((file.indexOf(".") !== 0) && (file.indexOf(".model.js") > 0)) {
        logger.log("debug", "Discovered path: "+path);
        return path;
      }

      return false;
    }
  });

};


var discover = function(paths, matcher, logger) {

  var discovered = [];

  return Promise.each(paths, function(location){

    // Recurse through the api directory and collect the models
    return dive(location, matcher, logger)
      .then(function(results){
        logger.log("debug","Flattening results");
        return _.flatten(results, true);
      })
      .filter(function(value){
        return value !== false
      })
      .then(function(results){
        logger.log("debug","Assigning filtered results to discover: "+results);
        return discovered = results;
      })
      .catch(function(err) {
        logger.log("error", err);
      });

  }).then(function(){
    return discovered;
  });
}

module.exports = discover;
