var os = require('os');
var ping = require ("net-ping");

var config = require('./config');
var Machine = require('./models/machine');

module.exports = function() {
  setInterval(function() {
    console.log('[Pinger] pinging Machines');

    Machine.find({ type: 'tcp' }, function(err, machines) {
      if (err) {
        console.error(err);
        res.send(err);
      }

      var session = ping.createSession ();

      for (var i in machines) {
        session.pingHost(target, function (error, target) {
          if (error) {
            console.log('[Pinger] Failed to ping "' + target + '" because: "' + error.toString() + '". Going to Remove this Machine (' + machines[i].name);

            Machine.remove({
              _id: machines[i]._id
            }, function(err, machine) {
              if (err) {
                console.error(err);
              }

              console.log('[Pinger] Machine ' + machines[i] + ' is removed.');
            });
          } else {
            console.log('[Pinger] ' + target + ": Alive");
          }
        });
      }
    });
  }, config.machinePingInterval);
};
