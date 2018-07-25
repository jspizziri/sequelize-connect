import Promise from "bluebird";
import flatten from "lodash.flatten";
import f from "fs";

let fs = Promise.promisifyAll(f);

class Discoverable {

  constructor(paths, matcher, logger=false){
    this.paths = paths;
    this.matcher = matcher;
    this.logger = logger;
  }

  /**
   * Discover the specified path for files
   * matching the given convention
   *
   * @return {Array} The array of matching files for the discoverable directories
   */
  discover() {

    let discovered = [];

    return Promise.each(this.paths, (location) => {

      // Recurse through the api directory and collect the models
      return this._dive(location)
        .then((results) => {
          this._log("debug", "Flattening results");
          return flatten(results, true);
        })
        .filter((value) => {
          return value !== false
        })
        .then((results) => {
          this._log("debug", "Assigning filtered results to discover: " + results);
          return discovered = results;
        });

    }).then(() => {
      return discovered;
    });
  }

  /**
   * [dive description]
   * @param  {String} dir The directory to recurse through
   * @return {Array}     An array of matching files at the given location
   */
  _dive(dir) {

    // Read the directory
    return fs.readdirAsync(dir).map((file) => {
      let path = dir + "/" + file;  // Full path of that file
      let stat = fs.statSync(path); // Get the file's stats

      // If the file is a directory
      if (stat && stat.isDirectory()) {
        return this._dive(path); // Dive into the directory
      } else {
        // Allow user to define a custom matcher function
        if(typeof this.matcher === 'function' && this.matcher(file) === true) {
          this._log("debug", "Discovered path: " + path);
          return path;
        } else if(/^[^.].*?\.model\.js$/.test(file)) {
          this._log("debug", "Discovered path: " + path);
          return path;
        }

        return false;
      }
    });

  }

  /**
   * Attempt to log
   * @param  {String} message Message to log
   * @return {null}
   */
  _log(level, message){
    this.logger ? this.logger.log(level, message) : false;
  }
}

module.exports =  Discoverable;
