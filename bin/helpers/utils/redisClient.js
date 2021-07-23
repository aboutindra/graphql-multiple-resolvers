const redis = require('redis');
require('dotenv').config();

const client = redis.createClient(process.env.REDIS_URL);

/* istanbul ignore next */
client.on('connect', () => {
  console.log('redis connect to save data');
});

/* istanbul ignore next */
client.on('error', (e) => {
  console.log(`Redis Error ${e}`);
});

module.exports = client;
