"user strict";
  
// Singleton Object
var singleton = function(){
  var instance
  , Sequelize
  , sequelize;

  function createInstance(config){

    if(!config)
      throw "The first time getInstace is called it must be called with configuration.";

    Sequelize = require('sequelize');
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.opts
      );
      
    // Connect to MySQL
    sequelize
      .authenticate()
      .complete(function(err) {
        if (!!err) {
          console.log('Unable to connect to the database:', err);
        } else {
          console.log('Connection has been established to: \''+config.database+'\' Listening on: \''+config.opts.port+'\'');
        }
      });
    
    return {
      DataTypes: Sequelize,
      sequelize: sequelize
    };
  }

  return {
    getInstance: function(config){
      if(!instance) {
        console.log("Creating instance");
        instance = createInstance(config);
      }

      console.log("returning instance");
      return instance;
    }
  };
}();

module.exports = singleton;