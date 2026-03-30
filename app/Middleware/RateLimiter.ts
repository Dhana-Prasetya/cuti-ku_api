import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import ErrorMapper from "App/helper/ErrorMapper";

export default class RateLimiter {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        const clientIp: string = ctx.request.ip();

        const lastRequest: string = await cacheRepository.getRateLimit(
            // fetch as string
            `${clientIp}`,
        );

        const gapLimitSecond = 3; // single request per 3 seconds for the same client

        if (Date.now() - Number(lastRequest) < gapLimitSecond * 1000) {
            throw new ErrorMapper(
                "Too many requests. Please try again later.",
                429,
            );
        }

        await cacheRepository.setRateLimit(clientIp, 3); // Set rate limit for 3 seconds
        await next();
    }
}
