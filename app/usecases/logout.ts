import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import cookieTTL from "App/helper/cookieTTL";

export default class Logout {
    public static async runUseCase(
        {
            refreshToken,
        }: {
            refreshToken?: string;
        },
        {
            accessToken,
        }: {
            accessToken: string;
        },
    ) {
        LoggerContract.info("", "Starting logout process");

        const decodedToken: any = JwtServicesContract.decodeToken(accessToken); // Decode the access token to get the jti and user_id

        const tokenTTL = cookieTTL(decodedToken.exp); // Calculate remaining TTL for the access token

        await cacheRepository.revokeSession(decodedToken.jti, tokenTTL); // Invalidate the old access token if exist

        if (refreshToken) {
            await cacheRepository.deleteRefreshToken(refreshToken); // Invalidate the old refresh token
        }

        LoggerContract.info("", "Successfully completed logout process");
    }
}
