import type { CacheRepository } from "@ioc:App/Repositories/CacheRepository";
import redisClient from "Config/redisClient";

export default class RedisUserRepository implements CacheRepository {
    async save(key: string, value: any, ttl: number) {
        await redisClient.setEx(key, ttl, value.toString());
    }

    async get(key: string) {
        const data: any = await redisClient.get(key);
        return data;
    }

    async delete(key: string) {
        await redisClient.del(key);
    }
}
