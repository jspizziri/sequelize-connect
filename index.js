
module.exports = function(config){
  var singleton = require('./lib/singleton');

  return singleton.getInstance(config);
};