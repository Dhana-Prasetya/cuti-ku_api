import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import ErrorMapper from "App/helper/ErrorMapper";
import cacheRepository from "@ioc:App/Repositories/CacheRepository";

export default class EnableEmployeeAccount {
    public static async runUseCase({
        user_id,
        enableStatus,
    }: {
        user_id: string;
        enableStatus: any;
    }) {
        LoggerContract.info(
            "",
            "Starting enable / disable employee account process",
        );

        const user = await userRepository.getUserRole(user_id);

        if (user.role === "admin") {
            throw new ErrorMapper("Cannot enable/disable admin account !", 403);
        }

        await cacheRepository.deleteRefreshToken(user_id);

        await cacheRepository.revokeSession(user_id, 60 * 5 * 3); // Blacklist access token for 15 minutes

        const data = await userRepository.setUserAccountAccess(
            user_id,
            enableStatus,
        );

        LoggerContract.info(
            "",
            "Successfully completed enable / disable employee account process",
        );

        return data;
    }
}
