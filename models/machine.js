var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MachineSchema   = new Schema({
  name: String,
  deviceCommands: [{ name: String, url: String, method: String, data: String, contentType: String }]
});

module.exports = mongoose.model('Machine', MachineSchema);