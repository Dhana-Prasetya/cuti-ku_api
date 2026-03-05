import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import ErrorMapper from "App/helper/ErrorMapper";

export default class GlobalCookieAuth {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        const accessToken = ctx.request.cookie("accessToken");

        if (!accessToken) {
            throw new ErrorMapper("Authentication required !", 401);
        }

        const decodedToken = JwtServicesContract.decodeToken(accessToken);

        const blacklisedToken = await cacheRepository.getRevokedToken(
            decodedToken.jti,
        );

        if (blacklisedToken) {
            throw new ErrorMapper("Session has been revoked !", 401);
        }

        ctx.user_id = decodedToken.id; // Attach user ID to context for downstream use
        ctx.jti = decodedToken.jti;

        await next();
    }
}
