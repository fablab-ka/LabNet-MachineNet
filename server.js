var mongoose   = require('mongoose');
var express    = require('express');
var bodyParser = require('body-parser');
var machineRoutes = require('./routes/machineroutes');

// SETUP
// =============================================================================

console.log("MachineNet Version '" + require('./package.json').version + "'");

dburl = 'mongodb://mongo/machinenet';

mongoose.connect(dburl, function(err) {
  if (err) {
    console.log("Failed to initialize Database. Ensure connectivity to '" + dburl + "'");
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

// REGISTER ROUTES -------------------------------
app.use('/api', router);

// START SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);