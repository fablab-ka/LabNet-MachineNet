var mongoose   = require('mongoose');
var express    = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var machineRoutes = require('./routes/machineroutes');
var lockRoutes = require('./routes/lockroutes');
var discoverer = require('./discoverer');

// SETUP
// =============================================================================

console.log("MachineNet Version '" + require('./package.json').version + "'");

mongoose.connect(config.dbUrl, function(err) {
  if (err) {
    console.log("Failed to initialize Database. Ensure connectivity to '" + config.dbUrl + "'");
    throw err;
  }
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 4020;

// ROUTES
// =============================================================================
var router = express.Router();

router.get('/', function(req, res) {
  console.log('route / hit');
  res.json({ message: 'Welcome to the MachineNet. A LabNet Service provided to you by FabLab Karlsruhe e.V.' });
});

machineRoutes(router);
lockRoutes(router);

// REGISTER ROUTES -------------------------------
app.use('/api', router);

// START SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

// START UDP Broadcast
// =============================================================================
discoverer.start();