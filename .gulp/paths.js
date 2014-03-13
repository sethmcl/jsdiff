var path = require('path');

module.exports = function () {
  return {
    helpers     : path.resolve(__dirname, '..', 'lib', 'helpers.js'),
    core        : path.resolve(__dirname, '..', 'lib', 'core.js'),
    builtWorker : path.resolve(__dirname, '..', 'build', 'worker.js')
  }
};
