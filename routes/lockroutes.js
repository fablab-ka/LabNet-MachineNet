var config = require('../config');

var Machine = require('../models/machine');
var Lock = require('../models/lock');

module.exports = function(router) {

  router.route('/locks')
    .get(function(req, res) {

    });

  router.route('/machines/:machine_id/lock')

    // get machine lock (GET http://localhost:4020/api/machines/:machine_id/lock)
    .get(function(req, res) {
      console.log('get machine lock');

      Lock.find({ machine_id: req.params.machine_id, resolved: false }, function(err, locks) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        if (locks.length <= 0) {
          res.json([]);
          return;
        }

        if (locks.length > 1) {
          console.warn("More than one lock on Machine '" + req.params.machine_id);
        }

        res.json(locks[0]);
      });
    });

  router.route('/machines/:machine_id/lock/:user_id')

    // create a new machine lock (POST http://localhost:4020/api/machines/:machine_id/lock/:user_id)
    .post(function(req, res) {
      console.log('create machine lock');

      request({ url: config.userNetApi + 'users/' + req.params.user_id, json: true }, function(error, response, body) {
        if (response.statusCode === 404) {
          console.error('User ' + req.params.user_id + ' does not exist.');
          res.send('User ' + req.params.user_id + ' does not exist.');
          return;
        }

        if (err || response.statusCode !== 200) {
          console.error(err || 'error: ' + response.statusCode);
          res.send(err);
          return;
        }

        var lock = new Lock();
        lock.machine_id = req.params.machine_id;
        lock.user_id = req.params.user_id;
        lock.created = new Date();
        lock.resolved = false;

        lock.save(function(err) {
          if (err) {
            console.error(err);
            res.send(err);
            return;
          }

          res.json({ message: 'Machine Lock created!' });
        });
      });
    })


    // delete a new machine lock (DELETE http://localhost:4020/api/machines/:machine_id/lock/:user_id)
    .delete(function(req, res) {
      console.log('resolve machine lock');

      Lock.find({ machine_id: req.params.machine_id, resolved: false }, function(err, locks) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        if (locks.length > 0) {
          var culprits = 'Culprits: ' + locks.map(function(lock) { return lock.user_id; }).join(',');
          console.warn('more than 1 machine locks for machine ' + req.params.machine_id + '. Resolving all of them. ' + culprits);
        }

        var error = '';

        locks.map(function(lock) {
          lock.resolved = true;
          lock.save(function(err) {
            if (err) {
              console.error(err);
              error += err + ' \n';
            }
          });
        });

        if (error.length === 0) {
          res.json({ message: 'All locks on machine resolved. ', locks: locks });
        } else {
          res.json({ message: 'Not all locks on machine could be resolved. Reason: ' + error, locks: locks });
        }
      });

      var machine = new Machine();
      machine.name = req.body.name;

      machine.save(function(err) {
        if (err) {
          console.error(err);
          res.send(err);
        }

        res.json({ message: 'Machine created!' });
      });
    });

};