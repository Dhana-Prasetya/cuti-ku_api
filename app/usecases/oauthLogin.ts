import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import oauthProvider from "@ioc:App/Services/OAuthProvider";
import UserRepository from "@ioc:App/UserRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import cookieTTL from "App/helper/cookieTTL";
import ErrorMapper from "App/helper/ErrorMapper";
import userRepository from "@ioc:App/UserRepository";

export default class oauthLogin {
    public static async runUseCase(
        { ctx }: { ctx: HttpContextContract },
        { oldRefreshToken }: { oldRefreshToken?: string },
        { oldAccessToken }: { oldAccessToken?: string },
        { organization_oauth }: { organization_oauth: string },
    ) {
        LoggerContract.info("", "Starting OAuth login process");

        const userData = await oauthProvider.getUser(ctx);

        let existingUser: any = await UserRepository.oauthLogin(userData.email);

        if (!existingUser) {
            if (organization_oauth === "true") {
                existingUser = await userRepository.registerOauthEmployee(
                    userData.email,
                    userData.name,
                ); // Register the user if not exist (organization OAuth enabled)
            } else {
                throw new ErrorMapper("User not found !", 404);
            }
        }

        if (!existingUser.name) {
            await UserRepository.oauthSetName(userData.email, userData.name);
        }

        if (oldRefreshToken) {
            await cacheRepository.deleteRefreshToken(oldRefreshToken); // Invalidate the old refresh token
        }

        if (oldAccessToken) {
            const decodedToken: any =
                JwtServicesContract.decodeToken(oldAccessToken);

            const tokenTTL = cookieTTL(decodedToken.exp); // Calculate remaining TTL for the access token

            await cacheRepository.revokeSession(decodedToken.jti, tokenTTL); // Invalidate the old access token
            await cacheRepository.deleteRefreshToken(decodedToken.jti); // Also delete the associated refresh token if it exists
        }

        const { accessToken, jti } = JwtServicesContract.createToken(
            existingUser.id,
            existingUser.role,
        );

        const refreshTokenTTL = 60 * 60 * 24 * 7; // 7 days in seconds

        await cacheRepository.saveRefreshToken(
            jti,
            existingUser.id,
            refreshTokenTTL,
        ); // Store the jti in cache with a TTL of 7 days

        LoggerContract.info("", "Successfully completed OAuth login process");
        return { accessToken, jti };
    }
}
