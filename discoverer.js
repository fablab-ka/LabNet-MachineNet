var os = require('os');
var dgram = require('dgram');
var config = require('./config');

var machineNetVersion = require('./package.json').version;

var udpClient = dgram.createSocket('udp4');
udpClient.setBroadcast(true);

module.exports = function() {
  setInterval(function() {
    var msgData = { hostname: os.hostname(), name: 'MachineNet', version: machineNetVersion };
    var message = new Buffer(JSON.stringify(msgData));
    client.send(message, 0, message.length, config.discoveryPort);
  }, config.discoveryInterval);
};