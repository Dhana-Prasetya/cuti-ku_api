import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import oauthProvider from "@ioc:App/Services/OAuthProvider";
import UserRepository from "@ioc:App/UserRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";

export default class oauthLogin {
    public static async runUseCase(
        ctx: HttpContextContract,
        oldRefreshToken?: string,
    ) {
        try {
            const userData = await oauthProvider.getUser(ctx);

            const existingUser: any = await UserRepository.oauthLogin(
                userData.email,
            );

            if (!existingUser) {
                return false;
            }

            if (!existingUser.name) {
                await UserRepository.oauthSetName(
                    userData.email,
                    userData.name,
                );
            }

            const { accessToken, jti } = JwtServicesContract.createToken(
                existingUser.id,
                existingUser.role,
            );

            const refreshTokenTTL = 60 * 60 * 24 * 7; // 7 days in seconds

            await cacheRepository.save(jti, existingUser.id, refreshTokenTTL); // Store the jti in cache with a TTL of 7 days

            if (oldRefreshToken) {
                await cacheRepository.delete(oldRefreshToken); // Invalidate the old refresh token
            }

            return { accessToken, jti };
        } catch (error) {
            console.error("Error in oauthLogin use case:", error);
            throw new Error("Internal server error");
        }
    }
}
