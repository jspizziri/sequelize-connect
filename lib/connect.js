"use strict";

var Promise       = require("bluebird")
  , path          = require("path")
  , logger        = require("winston")
  , Sequelize     = require("sequelize")
  , discover      = require("./discover")
  , db            = {};


db.Sequelize = Sequelize; // Expose Sequelize
db.models = {};           // Expose models

db.discover = ["/model"]; // Set the default discovery paths
db.matcher  = null;       // Set matcher to null

// Setup Logger
logger.level  = "info";   // Default log level to debug
db.logger     = logger;   // Set the logger

// Expose the connection function
db.connect = function(database, username, password, options) {

  logger.log("info", "Connecting to: " + database + " as: " + username);

  // Instantiate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options)
    , models = {};


  var dir = typeof db.discover === "string" ? [db.discover] : db.discover;
  return discover(dir, db.matcher, logger)
    .each(function(path){
      // Import each discovered path
      var model  = sequelize["import"](path);

      if(model) {
        logger.log("debug", "Import for path succeeded: " + path);
        models[model.name] = model;
      } else {
        logger.log("debug", "Import for path failed: " + path);
      }

    })
    .then(function(path){
      // Execute the associate methods for each Model
      logger.log("info","Import completed");

      return Promise.each(Object.keys(models), function(modelName) {

        if ("associate" in models[modelName]) {
          logger.log("debug", "Associating Model: "+ modelName);
          models[modelName].associate(models);
        } else {
          logger.log("debug", "Nothing to associate for Model: "+ modelName);
        }
      });

    })
    .then(function(){
      // Syncronize the DB
      logger.log("info", "Finished connecting to: " + database + " as: " + username);
      return sequelize.sync();

    })
    .then(function(){
      logger.log("info", "Finished synchronizing " + database);
      // Expose objects
      db.sequelize = sequelize;
      db.models    = models;
    });
};

module.exports = db;
