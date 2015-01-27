"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var dive      = require("./dive");
var db        = {};
var db.models = {};


// Expose Sequelize
db.Sequelize = Sequelize;

// Set the default discovery paths
db.discover = ["/model"];
db.logger   = true;
db.matcher  = null;

// Expose the connection function
db.connect = function(database, username, password, options) {

  // Instanciate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options);


  db.discover.forEach(function(location){
    
    // Construct the path to discover 
    var p = path.join(__dirname, '/../', location);

    // Recurse through the api directory and collect the models
    dive(p, function(err, path) {

      if(db.logger)
        console.log("Loading Model: "+ path.substring(path.lastIndexOf("/") + 1));

      var model = sequelize["import"](path);

      if(model)
        db.models[model.name] = model;
    });
  });


  // Execute the associate methods for each Model
  Object.keys(db).forEach(function(modelName) {
    if ("associate" in db.models[modelName]) {
      db.models[modelName].associate(db);
    }
  });


  // Expose the sequelize object
  db.sequelize = sequelize;

  return true;
};

module.exports = db;