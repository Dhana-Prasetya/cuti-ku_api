import userRepository from "@ioc:App/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";
import JwtServicesContract from "@ioc:App/Services/JwtServicesContract";
import cookieTTL from "App/helper/cookieTTL";
import ErrorMapper from "App/helper/ErrorMapper";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class ConventionalLogin {
    public static async runUseCase(
        { email }: { email: string },
        { password }: { password: string },
        { oldRefreshToken }: { oldRefreshToken?: string },
        { oldAccessToken }: { oldAccessToken?: string },
    ) {
        LoggerContract.info("", "Starting conventional login process");

        const query = await userRepository.login(email);

        if (!query) {
            throw new ErrorMapper("User not found !", 404);
        }

        if (!query.password) {
            throw new ErrorMapper(
                "Conventional login is not enabled for this user !",
                400,
            );
        }

        const matchedPassword = await Hash.verify(query.password, password);

        if (!matchedPassword) {
            throw new ErrorMapper("Invalid email or password !", 401);
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
            query.id,
            query.role,
        );

        const refreshTokenTTL = 60 * 60 * 24 * 7; // 7 days in seconds

        await cacheRepository.saveRefreshToken(jti, query.id, refreshTokenTTL); // Store the jti in cache with a TTL of 7 days

        LoggerContract.info(
            "",
            "Successfully completed conventional login process",
        );
        return { accessToken, jti };
    }
}
