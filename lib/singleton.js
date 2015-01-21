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

    return {
      DataTypes: Sequelize,
      sequelize: sequelize
    };
  }

  return {
    getInstance: function(config){
      if(!instance) {
        instance = createInstance(config);
      }

      return instance;
    }
  };
}();

module.exports = singleton;