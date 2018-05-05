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

The  sequelize-connect `connect()` method accepts the same parameters as the Sequelize() object `database, username, password, options`.
```js
// app.js
var Connection 		= require('sequelize-connect');

var orm = new Connection(
  'test-db',
  'test-user',
  'secret1234',
  {
    dialect: "mysql",
    port:    3306
  }
)
.then(function(instance){
  // Connection is completed
});
```

It is important to configure the `discover` array of the set of paths where your models should be discovered.
```js
// app.js
var Connection 		= require('sequelize-connect');

var discover = [__dirname + '/models', ...];
var orm = new Connection(
  'test-db',
  'test-user',
  'secret1234',
  {
    dialect: "mysql",
    port:    3306
  },
  discover,
)
.then(function(instance){
  // Connection is completed
});
```
Upon the first initialization of the `Connection` e.g. `new Connection(...);` sequelize-connect will ***ASYNCHRONOUSLY recurse*** through all of the subfolders located at the provided file paths looking for any files with the naming default convention `*.model.js`. Connect will return a Promise that is called on it's completion.

#### Connection String
You can use a connection string to connect as well:

```js
new Connection(
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

This function should be injected to `Connection` like so:

```js
var matcher = function(file){
  if(//some condition or regex here)
    return true;

  return false;
};

new Connection(
  'test-db',
  'test-user',
  'secret1234',
  {
    dialect: "mysql",
    port:    3306
  },
  discover,
  matcher
)
```


## Accessing sequelize
After connecting you can access the sequelize instance and models wherever you need!

```js
// somefile.js

var Connection = require('sequelize-connect');
var orm = new Connection(); // singleton pattern - returns the created instance
var sequelize = orm.sequelize;
var Sequelize = orm.Sequelize;
var models    = orm.models;
var User      = models.User;
```

If you prefer, rather than waiting for the connection to load before initializing every part of your application, you can wrap the code that has dependencies on your models in a `then`. e.g.


```js
// app.js
new Connection(
  'MyConnectionString',
  {
    dialect: "mysql",
    port:    3306
  })
```

```js
// foobar.js

var Promise = require('bluebird');
var Connection = require('sequelize-connect');
var orm = new Connection();

// This will ensure that the connection has been established
// if you load foobar.js before you wait for your initial connection
// to return
var Promise.resolve(orm)
  .then(function(instance) {
    var User = instance.models.Foo;

    /**
     * Get list of users
     * restriction: 'admin'
     */
    var index = function(req, res) {
      Foo.bar()
    };
  })
```

## Defining Models

Models are defined as per the suggestion the article here: http://sequelizejs.com/articles/express. All associations are done via the class method `associate` which is injected with the models object.

```js
// user.model.js
"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING
  });

  // class association method
  User.associate = function(models) {
    User.hasMany(models.Task);
  }

  return User;
};

```


## Logging

Logging is optional, but is turned off by default. In order to enable logging, simply inject the logger of your choice:

```js

myLogger = console;
// myLogger = winston;
// myLogger = ...;

new Connection(
  'test-db',
  'test-user',
  'secret1234',
  {
    dialect: "mysql",
    port:    3306
  },
  discover,
  matcher,
  myLogger
)
```

Your logger must comply with the following interface:

```js
logger.log(level, message);
```


## Contributing

Please read the [contributing guidlines](https://github.com/jspizziri/sequelize-connect/blob/master/CONTRIBUTING.md)
