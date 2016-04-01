# sequelize-connect
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Formerly [sequelize-singleton](https://github.com/jspizziri/sequelize-singleton).

sequelize-connect is a simple singleton wrapper for the sequelize ORM, making it easier to configure and build models with Sequelize.

* [Configuring sequelize-connect](#configuring-sequelize-connect)
  * [Connection String](#connection-string)
* [Custom Matcher](#custom-matcher)
* [Accessing Sequelize](#accessing-sequelize)
* [Defining Models](#defining-models)
* [Logging](#logging)
* [Contributing](#contributing)

## Configuring sequelize-connect

***NOTE:*** `sequelize-connect` must be configured upon app initialization, prior to [accessing your models](#accessing-sequelize)

The  sequelize-connect `connect()` method accepts the same parameters as the Sequelize() object `database, username, password, options`. It is important to configure the `discover` array of the set of paths where your models should be discovered.
```js
// app.js
var orm 		= require('sequelize-connect');

orm.discover = [__dirname + '/models'];
orm.connect(
  'test-db',
  'test-user',
  'secret1234',
  {
    dialect: "mysql",
    port:    3306
  })
  .then(function(){
    // Connection is completed
  });
```
Upon `connect()` sequelize-connect will ***ASYNCHRONOUSLY recurse*** through all of the subfolders located at the provided file paths looking for any files with the naming default convention `*.model.js`. Connect will return a Promise that is called on it's completion.

#### Connection String
You can use a connection string to connect as well:

```js
orm.connect(
  'MyConnectionString',
  {
    dialect: "mysql",
    port:    3306
  })
  .then(function(){
    // Connection is completed
  });
```


## Custom matcher
If you prefer to define your own naming convention instead of the default you can create a custom matching function which receives the file name as the parameter returns a `boolean` indicating if sequelize-connect should attempt to load the file as a model.

This function should be attached to `matcher` like so:

```js
orm.matcher = function(file){
  if(//some condition or regex here)
    return true;

  return false;
};
```


## Accessing sequelize
After connecting you can access the sequelize instance and models wherever you need!

```js
// somefile.js

var orm       = require('sequelize-connect');
var sequelize = orm.sequelize;
var Sequelize = orm.Sequelize;
var models    = orm.models;
var User      = models.User;
```

## Defining Models

Models are defined as per the suggestion the article here: http://sequelizejs.com/articles/express. All associations are done via the class method `associate` which is injected with the models object.
```js
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


## Logging

Logging is done via the [winston](https://github.com/winstonjs/winston), the winston object can be accessed at via `orm.logger`. If you want to control the log level you can do it like so:

```js
orm.logger.level = "debug";
```

To disable logging entirely:

```js
orm.logger.level = null
```


## Contributing

Please read the [contributing guidlines](https://github.com/jspizziri/sequelize-connect/blob/master/CONTRIBUTING.md)
