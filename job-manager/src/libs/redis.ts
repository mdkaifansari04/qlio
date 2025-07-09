import redis from "ioredis";

const redisClient = new redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

export default redisClient;
