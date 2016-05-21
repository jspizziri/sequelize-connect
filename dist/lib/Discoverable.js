"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = _bluebird2.default.promisifyAll(_fs2.default);

var Discoverable = function () {
  function Discoverable(paths, matcher) {
    var logger = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    _classCallCheck(this, Discoverable);

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


  _createClass(Discoverable, [{
    key: "discover",
    value: function discover() {
      var _this = this;

      var discovered = [];

      return _bluebird2.default.each(this.paths, function (location) {

        // Recurse through the api directory and collect the models
        return _this._dive(location).then(function (results) {
          _this._log("debug", "Flattening results");
          return _lodash2.default.flatten(results, true);
        }).filter(function (value) {
          return value !== false;
        }).then(function (results) {
          _this._log("debug", "Assigning filtered results to discover: " + results);
          return discovered = results;
        });
      }).then(function () {
        return discovered;
      });
    }

    /**
     * [dive description]
     * @param  {String} dir The directory to recurse through
     * @return {Array}     An array of matching files at the given location
     */

  }, {
    key: "_dive",
    value: function _dive(dir) {
      var _this2 = this;

      // Read the directory
      return fs.readdirAsync(dir).map(function (file) {
        var path = dir + "/" + file; // Full path of that file
        var stat = fs.statSync(path); // Get the file's stats

        // If the file is a directory
        if (stat && stat.isDirectory()) {
          return _this2._dive(path); // Dive into the directory
        } else {
            // Allow user to define a custom matcher function
            if (typeof _this2.matcher === 'function' && _this2.matcher(file) === true) {
              _this2._log("debug", "Discovered path: " + path);
              return path;
            } else if (file.indexOf(".") !== 0 && file.indexOf(".model.js") > 0) {
              _this2._log("debug", "Discovered path: " + path);
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

  }, {
    key: "_log",
    value: function _log(level, message) {
      this.logger ? this.logger.log(level, message) : false;
    }
  }]);

  return Discoverable;
}();

module.exports = Discoverable;
//# sourceMappingURL=Discoverable.js.map
