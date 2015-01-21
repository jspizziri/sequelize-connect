sequelize-singleton is a simple singleton wrapper for the sequelize ORM, making it easier to configure and build models.

Example Usage:

```
#app.js
var config = { database: 'db', username: 'user', password: 'password123', opts: {...}};
var orm = require('sequelize-singleton')(config);
```

Now you can access the sequelize instance wherever you need:

```
var orm = require('sequelize-singleton')();


...

var User = sequelize.define('User', {
  username: orm.DataTypes.STRING,
  password: orm.DataTypes.STRING
});

...

```
