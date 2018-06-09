require('app-module-path').addPath(__dirname + '/lib');

exports.setup = function(runningApp, callback) {
  // Nothing ever comes from "x-powered-by", but a security hole
  runningApp.disable("x-powered-by");

  // API endpoint attached to root route:
  runningApp.use('/api/cache', require('cache')); // attach to sub-route

  if(typeof callback === 'function') {
    callback(runningApp);
  }
};
