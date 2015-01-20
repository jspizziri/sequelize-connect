var singleton = require('./lib/singleton');

module.exports = function(config){
  return singleton.getInstance(config);
}