# sequelize-singleton

sequelize-singleton is a simple singleton wrapper for the sequelize ORM, making it easier to configure and build models with Sequelize.

* [Configuring sequelize-singleton](#configuring-sequelize-singleton)
* [Custom Matcher](#custom-matcher)
* [Accessing Sequelize](#accessing-sequelize)
* [Defining Models](#defining-models)

## Configuring sequelize-singleton

The  sequelize-singleton ```connect()``` method accepts the same parameters as the Sequelize() object ```database, username, password, options```. It is important to configure the ```discover``` array of the set of paths where your models should be discovered.
```
// app.js
var orm 		= require('sequelize-singleton');

orm.discover = [__dirname + '/models'];
orm.connect(
  'test-db',
  'test-user',
  'secret1234', 
  {
    dialect: "mysql",
    port:    3306
  });
```
Upon ```connect()``` sequelize-singleton will ***SYNCHRONOUSLY recurse*** through all of the subfolders located at the provided file paths looking for any files with the naming default convention ```*.model.js```.

## Custom matcher
If you prefer to define your own naming convention instead of the default you can create a custom matching function which receives the file name as the parameter returns a ```boolean``` indicating if sequelize-singleton should attempt to load the file as a model. 

This function should be attached to ```matcher``` like so:

```
orm.matcher = function(file){
  if(//some condition or regex here)
    return true;
    
  return false;
};
```


## Accessing sequelize
Now you can access the sequelize instance and models wherever you need!

```
// somefile.js

var orm       = require('sequelize-singleton');
var sequelize = orm.sequelize;
var Sequelize = orm.Sequelize;
var models    = orm.models;
var User      = models.User;
```

## Defining Models

Models are defined as per the suggestion the article here: http://sequelizejs.com/articles/express. All associations are done via the class method ```associate``` which is injected with the models object.
```
// user.model.js
"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  });

  return User;
};

```
