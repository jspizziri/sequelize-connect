"use strict";

var fs        = require("fs");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require('./config/environment');
var sequelize = new Sequelize(
  config.mysql.db, 
  config.mysql.user, 
  config.mysql.password, 
  {
    dialect: "mysql",
    port:    config.mysql.port
  });

var db        = {};
var db.models = {};


// Recurse through the api directory and collect the models
dive(__dirname+'/api', function(err, path){
  console.log("Loading Model: "+path.substring(path.lastIndexOf("/") + 1));
  var model = sequelize["import"](path);

  if(model)
    db.models[model.name] = model;
});


Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;