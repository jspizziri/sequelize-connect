sequelize-singleton is a simple singleton wrapper for the sequelize ORM, making it easier to configure and build models.

# Example Usage

## Configuring sequelize-singleton

The  sequelize-singleton ```connect()``` argument accepts the same parameters as the Sequelize() object. It is important to configure the ```discover``` array to the set of paths where your models should be discovered.
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
Upon ```connect()``` sequelize-singleton will SYNCHRONOUSLY recurse through the provided file paths looking for any files with the naming convention ```*.model.js```.

## Custom matcher
Alternatively you can define a custom matching function which returns a ```boolean``` and attach it to:

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
