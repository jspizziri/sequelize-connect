"use strict";

import Promise from "bluebird";
import path from "path";
import Sequelize from "sequelize";
import Discoverable  from "./Discoverable";

// Setup Logger
// logger.level  = "info";   // Default log level to debug

let instance = null;

class Connection {

  constructor(database, username, password, options={}, discover=["/model"], matcher=null, logger=false) {

    if(instance) return instance;

    this.database = database;
    this.username = username;
    this.password = password;
    this.options = options;
    this.discover = discover; // Set the default discovery paths to ["/model"]
    this.matcher = matcher; // Set the default matcher to null
    this.logger = logger;

    // Expose db
    this.models = {};
    this.Sequelize = Sequelize; // Expose Sequelize

    instance = this._connect();

    return instance
      .then((connection) => {
        return instance = connection;
      });
  }

  /**
   * Connect to the db
   * @return {Object} A database object containing sequelize and models
   */
  _connect(){

    // return the instance, although this shouldn't be being called externally
    if(instance) return instance;

    this._log("info", "Connecting to: " + this.database + " as: " + this.username);

    // Instantiate a new sequelize instance
    let sequelize = new this.Sequelize(this.database, this.username, this.password, this.options);
    let models = {};


    let dir = typeof this.discover === "string" ? [this.discover] : this.discover;
    let discoverable = new Discoverable(dir, this.matcher, this.logger);

    return discoverable.discover()
      .each((path) => {
        // Import each discovered path
        let model  = sequelize["import"](path);

        if(model) {
          this._log("debug", "Import for path succeeded: " + path);
          models[model.name] = model;
        } else {
          this._log("debug", "Import for path failed: " + path);
        }

      })
      .then((path) => {
        // Execute the associate methods for each Model
        this._log("info","Import completed");

        return Promise.each(Object.keys(models), (modelName) => {

          if ("associate" in models[modelName]) {
            this._log("debug", "Associating Model: "+ modelName);
            models[modelName].associate(models);
          } else {
            this._log("debug", "Nothing to associate for Model: "+ modelName);
          }
        });

      })
      .then(() => {
        // Syncronize the DB
        this._log("info", "Finished connecting to: " + this.database + " as: " + this.username);
        return sequelize.sync();

      })
      .then(() => {
        this._log("info", "Finished synchronizing " + this.database);
        // Expose objects
        this.sequelize = sequelize;
        this.models    = models;

        return this;
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

module.exports =  Connection;
