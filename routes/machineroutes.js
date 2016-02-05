var request = require('request');

var Machine = require('../models/machine');

module.exports = function(router) {

  router.route('/machines')

    // get machines (GET http://localhost:4020/api/machines)
    .get(function(req, res) {
      console.log('get machines');

      Machine.find(function(err, machines) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        res.json(machines);
      });
    })


    // create a machine (POST http://localhost:4020/api/machines)
    .post(function(req, res) {
      console.log('create machine');

      var machine = new Machine();
      machine.name = req.body.name;

      machine.save(function(err) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        res.json({ message: 'Machine created!' });
      });
    });


  router.route('/machines/:machine_id')

    // get the machine with that id (GET http://localhost:4020/api/machines/:machine_id)
    .get(function(req, res) {
      console.log('get machine ' + req.params.machine_id);

      Machine.findById(req.params.machine_id, function(err, machine) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        if (machine) {
          res.json(machine);
        } else {
          res.status(404).send('Not found');
        }
      });
    })

    // update the machine with this id (PUT http://localhost:4020/api/machines/:machine_id)
    .put(function(req, res) {
      console.log('update machine ' + req.params.machine_id);

      Machine.findById(req.params.machine_id, function(err, machine) {

        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        machine.name = req.body.name;

        machine.save(function(err) {
          if (err) {
            console.error(err);
            res.send(err);
            return;
          }

          res.json({ message: 'Machine updated!' });
        });

      });
    })

    // delete the machine with this id (DELETE http://localhost:4020/api/machines/:machine_id)
    .delete(function(req, res) {
      console.log('delete machine ' + req.params.machine_id);

      Machine.remove({
        _id: req.params.machine_id
      }, function(err, machine) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        res.json({ message: 'Successfully deleted' });
      });
    });


  router.route('/machines/:machine_id/:command_name')


    // execute a device command (POST http://localhost:4020/api/machines/:machine_id/:command_name)
    .post(function(req, res) {
      console.log('execute device command ' + req.params.command_name + ' for ' + req.params.machine_id);

      Machine.findById(req.params.machine_id, function(err, machine) {
        if (err) {
          console.error(err);
          res.send(err);
          return;
        }

        if (machine) {
          var commandToExecute = null;
          for (var i in machine.commands) {
            var command = machine.commands[i];
            if (command.name === command_name) {
              commandToExecute = command;
              break;
            }
          }

          if (commandToExecute) {
            request({
              url: command.url,
              method: command.method,
              multipart: [{
                'content-type': command.contentType,
                body: command.data
              }]
            }, function(error, response, body) {
              if (error) {
                console.error(err);
                res.send(err);
                return;
              }

              res.status(200).send('OK');
            });
          } else {
            res.status(404).send('Command not found');
          }
        } else {
          res.status(404).send('Machine not found');
        }
      });
    })

};