import redisClient from './initRedis.js'
// Init middleware to get data from Redis
export const getDataFromRedis = async (req, res, next) => {
  try {
    const species = req.params.species;
    let isCached = false;
    let results;
    const redis = await redisClient()
    const cacheResults = await redis.get(species);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      return next();
    }
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
};
