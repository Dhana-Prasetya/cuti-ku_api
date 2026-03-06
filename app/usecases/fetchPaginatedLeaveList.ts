import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class FetchPaginatedLeaveList {
    public static async runUseCase({
        page,
        limit,
        order,
    }: {
        page: number;
        limit: number;
        order: string;
    }) {
        LoggerContract.info("", "Starting fetch of user leave list process");

        // Pagination logic
        const total = await userRepository.countLeaveList(); // counting total records
        const totalPages = Math.ceil(total / limit);

        const fetchedData = await userRepository.getPaginatedLeaveList(
            page,
            limit,
            order,
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
            "Successfully completed fetch of user leave list process",
        );

        return data;
    }
}
