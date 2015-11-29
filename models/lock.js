var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LockSchema   = new Schema({
    machine_id: String,
    user_id: String,
    created: Date,
    resolved: Boolean
});

module.exports = mongoose.model('Lock', LockSchema);