import type { CacheRepository } from "@ioc:App/Repositories/CacheRepository";
import redisClient from "Config/redisClient";

export default class RedisUserRepository implements CacheRepository {
    async saveRefreshToken(key: string, value: any, ttl: number) {
        await redisClient.setEx(`rt:${key}`, ttl, value.toString());
    }

    async getRefreshToken(key: string) {
        const data: any = await redisClient.get(`rt:${key}`);
        return data;
    }

    async deleteRefreshToken(key: string) {
        await redisClient.del(`rt:${key}`);
    }

    async revokeSession(key: string, ttl: number) {
        await redisClient.setEx(`revoked:${key}`, ttl, "blacklisted");
    }

    async getRevokedToken(key: string) {
        const data: any = await redisClient.get(`revoked:${key}`);
        return data;
    }

    async getRateLimit(key: string) {
        let data: any = await redisClient.get(`ratelimit:${key}`);
        return data;
    }

    async setRateLimit(key: string, ttl: number) {
        await redisClient.setEx(`ratelimit:${key}`, ttl, Date.now().toString()); // set rate limiting with redis
    }
}
