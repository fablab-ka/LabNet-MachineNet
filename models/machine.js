var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MachineSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Machine', MachineSchema);