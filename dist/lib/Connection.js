"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _Discoverable = require("./Discoverable");

var _Discoverable2 = _interopRequireDefault(_Discoverable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Setup Logger
// logger.level  = "info";   // Default log level to debug

var instance = null;

var Connection = function () {
  function Connection(database, username, password) {
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    var discover = arguments.length <= 4 || arguments[4] === undefined ? ["/model"] : arguments[4];
    var matcher = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];
    var logger = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];

    _classCallCheck(this, Connection);

    if (instance) return instance;

    this.database = database;
    this.username = username;
    this.password = password;
    this.options = options;
    this.discover = discover; // Set the default discovery paths to ["/model"]
    this.matcher = matcher; // Set the default matcher to null
    this.logger = logger;

    // Expose db
    this.models = {};
    this.Sequelize = _sequelize2.default; // Expose Sequelize

    instance = this._connect();

    return instance.then(function (connection) {
      return instance = connection;
    });
  }

  /**
   * Connect to the db
   * @return {Object} A database object containing sequelize and models
   */


  _createClass(Connection, [{
    key: "_connect",
    value: function _connect() {
      var _this = this;

      // return the instance, although this shouldn't be being called externally
      if (instance) return instance;

      this._log("info", "Connecting to: " + this.database + " as: " + this.username);

      // Instantiate a new sequelize instance
      var sequelize = new this.Sequelize(this.database, this.username, this.password, this.options);
      var models = {};

      var dir = typeof this.discover === "string" ? [this.discover] : this.discover;
      var discoverable = new _Discoverable2.default(dir, this.matcher, this.logger);

      return discoverable.discover().each(function (path) {
        // Import each discovered path
        var model = sequelize["import"](path);

        if (model) {
          _this._log("debug", "Import for path succeeded: " + path);
          models[model.name] = model;
        } else {
          _this._log("debug", "Import for path failed: " + path);
        }
      }).then(function (path) {
        // Execute the associate methods for each Model
        _this._log("info", "Import completed");

        return _bluebird2.default.each(Object.keys(models), function (modelName) {

          if ("associate" in models[modelName]) {
            _this._log("debug", "Associating Model: " + modelName);
            models[modelName].associate(models);
          } else {
            _this._log("debug", "Nothing to associate for Model: " + modelName);
          }
        });
      }).then(function () {
        // Syncronize the DB
        _this._log("info", "Finished connecting to: " + _this.database + " as: " + _this.username);
        return sequelize.sync();
      }).then(function () {
        _this._log("info", "Finished synchronizing " + _this.database);
        // Expose objects
        _this.sequelize = sequelize;
        _this.models = models;

        return _this;
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

  return Connection;
}();

module.exports = Connection;
//# sourceMappingURL=Connection.js.map
