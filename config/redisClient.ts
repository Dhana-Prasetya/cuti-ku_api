import * as redis from "@redis/client";
import Env from "@ioc:Adonis/Core/Env";

// Create and export a Redis client for caching
const redisClient = redis.createClient({
    url: Env.get("REDIS_URL"),
});

// Connect to Redis and handle errors
redisClient.connect().catch((err) => {
    console.error("Redis connection failed:", err);
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redisClient;
