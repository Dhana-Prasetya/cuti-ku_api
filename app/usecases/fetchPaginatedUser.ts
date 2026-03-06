import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class FetchPaginatedUser {
    public static async runUseCase(
        { page }: { page: number },
        { limit }: { limit: number },
    ) {
        LoggerContract.info("", "Starting fetch paginated employee process");

        // Pagination logic
        const total = await userRepository.countUserList(); // counting total records
        const totalPages = Math.ceil(total / limit);

        const fetchedData = await userRepository.getPaginatedUserList(
            page,
            limit,
        );

        const data = {
            page,
            limit,
            total,
            totalPages,
            fetchedData,
        };

        LoggerContract.info(
            "",
            "Successfully completed fetch paginated employee process",
        );

        return data;
    }
}
