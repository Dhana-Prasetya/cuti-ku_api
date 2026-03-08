import userRepository from "@ioc:App/UserRepository";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import ErrorMapper from "App/helper/ErrorMapper";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import cookieTTL from "App/helper/cookieTTL";

export default class RefreshingToken {
    public static async runUseCase(
        {
            oldRefreshToken,
        }: {
            oldRefreshToken: string;
        },
        {
            oldAccessToken,
        }: {
            oldAccessToken?: string;
        },
    ) {
        LoggerContract.info("", "Starting token refreshing process");

        if (!oldRefreshToken) {
            throw new ErrorMapper("Refresh token is required !", 400);
        }

        const user_id = await cacheRepository.getRefreshToken(oldRefreshToken);

        if (!user_id) {
            throw new ErrorMapper("Invalid refresh token !", 401);
        }

        if (oldAccessToken) {
            const decodedToken: any =
                JwtServicesContract.decodeToken(oldAccessToken);

            const tokenTTL = cookieTTL(decodedToken.exp); // Calculate remaining TTL for the access token

            await cacheRepository.revokeSession(decodedToken.jti, tokenTTL); // Invalidate the old access token if exist
        }

        await cacheRepository.deleteRefreshToken(oldRefreshToken); // Invalidate the old refresh token

        const user_role = await userRepository.getUserRole(user_id);

        const { accessToken, jti } = JwtServicesContract.createToken(
            user_id,
            user_role,
        );

        const refreshTokenTTL = 60 * 60 * 24 * 7; // 7 days in seconds

        await cacheRepository.saveRefreshToken(jti, user_id, refreshTokenTTL); // Store the jti in cache with a TTL of 7 days

        LoggerContract.info(
            "",
            "Successfully completed token refreshing process",
        );
        return { accessToken, jti };
    }
}
