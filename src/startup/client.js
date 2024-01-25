const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const host = '127.0.0.1'
const client = redis.createClient(REDIS_PORT, host);
client.on('connect', () => {
    console.log("Connected!");
})
client.set('doctor','Shifokor', function(err,reply){
    console.log(reply);
})
// const client = new 

module.exports = client;