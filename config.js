module.exports = {
  //dbUrl: 'mongodb://192.168.99.101:27017/machinenet',
  dbUrl: process.env.machineNetUrl || 'mongodb://mongo/machinenet',
  userNetApi: process.env.usernetUrl || 'http://usernet/api',
  discoveryPort: 1212,
  discoveryInterval: 3000,
  machinePingInterval: 3000
};