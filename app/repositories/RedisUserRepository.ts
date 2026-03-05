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
        await redisClient.setEx(`revoked:${key}`, ttl, "");
    }

    async getRevokedToken(key: string) {
        const data: any = await redisClient.get(`revoked:${key}`);
        return data;
    }
}
