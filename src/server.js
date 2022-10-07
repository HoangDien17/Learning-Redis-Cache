import express from 'express';
import { getDataFromRedis } from './getDataRedisMiddleware.js';
import { fetchApiData } from './fetchData.js';
import redisClient from './initRedis.js'

const app = express();
const port = process.env.PORT;

async function getSpeciesData(req, res) {
  const species = req.params.species;
  let results;

  try {
    results = await fetchApiData(species);
    if (results.length === 0) {
      throw "API returned an empty array";
    }
    const redis = await redisClient();
    await redis.set(species, JSON.stringify(results), {
      EX: 180,
      NX: true,
    });

    res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

app.get("/fish/:species", getDataFromRedis, getSpeciesData);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});