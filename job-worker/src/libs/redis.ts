import redis from "ioredis";

const redisClient = new redis(process.env.REDIS_HOST!);

export default redisClient;
