const { promisify } = require('util');
const client = require('redis').createClient({
  host: 'cache',
  port: 6379
});

client.getAsync = promisify(client.get).bind(client);
client.setAsync = promisify(client.set).bind(client);
client.setexAsync = promisify(client.setex).bind(client);

client.EXPIRE_IN = 60 * 60 * 24;

module.exports = client;
