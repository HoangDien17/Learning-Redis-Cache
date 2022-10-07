import {createClient} from 'redis';
const redisClient = async () => {
    const redis = createClient(process.env.REDIS_PORT);
    redis.on("error", (error) => console.error(`Error : ${error}`));
    await redis.connect();
    return redis
}

export default redisClient
