"use strict";

var path      = require("path");
var Sequelize = require("sequelize");
var dive      = require("./dive");
var db        = {};


db.Sequelize = Sequelize; // Expose Sequelize
db.models = {};           // Expose models

db.discover = ["/model"]; // Set the default discovery paths
db.logger   = true;       // Set logger to true
db.matcher  = null;       // Set matcher to null

// Expose the connection function
db.connect = function(database, username, password, options) {

  if(db.logger)
    console.log("Connecting to: " + database + " as: " + username);

  // Instanciate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options);


  db.discover.forEach(function(location){
    
    // Construct the path to discover 
    //var p = path.join(__dirname, '/../', location);

    // Recurse through the api directory and collect the models
    dive(location, function(err, path) {

      if(db.logger)
        console.log("Loading Model: "+ path.substring(path.lastIndexOf("/") + 1));

      var model = sequelize["import"](path);

      if(model)
        db.models[model.name] = model;
    });
  });

  // Execute the associate methods for each Model
  Object.keys(db.models).forEach(function(modelName) {

    if(db.logger)
      console.log("Associating Model: "+ modelName);

    if ("associate" in db.models[modelName]) {
      db.models[modelName].associate(db.models);
    }
  });


  // Expose the sequelize object
  db.sequelize = sequelize;

  if(db.logger)
    console.log("Finished Connecting");

  return true;
};

module.exports = db;