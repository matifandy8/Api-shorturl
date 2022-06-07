const shortId = require('shortid');
const Redis = require("ioredis");
const redis = new Redis(
  "redisurl");

redis.on('connect', () => {
    console.log('Connected to RedisGreen Server');
});

redis.on('ready', () => {
    console.log('ready to work with RedisGreen Server');
});

redis.on('error', (err) => {
    console.log('Error occurred while connecting to Redis');
    process.exit(0);
});

function storeURL(url) {
    return new Promise((resolve, reject) => {
        redis.get(url, (err, reply) => {
            if(err) {
                return reject('error occurred during the redis operation');
            }
            if(reply) {
                resolve(reply);
            } else {
                // make new entry
                let id = shortId.generate();
                redis.set(id, url, 'EX', 86400);
                // set URL as a key too for searching
                redis.set(url, id, 'EX', 86400);
                // return
                resolve(id);
            }
        });
    });
}

function findURL(key) {
    return new Promise((resolve, reject) => {
        redis.get(key, (err, reply) => {
            if(err) {
                return reject('error occurred during the redis operation');                
            }
            // check if the reply exists
            if(reply === null) {
                resolve(null);
            } else {
                resolve(reply);
            }
        });
    });
}

module.exports = {
    storeURL: storeURL,
    findURL: findURL
};