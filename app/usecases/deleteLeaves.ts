import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import ErrorMapper from "App/helper/ErrorMapper";

export default class DeleteLeaves {
    public static async runUseCase(
        { id }: { id: number },
        { user_id }: { user_id: string },
    ) {
        LoggerContract.info("", "Starting deletion of selected leave list");

        const selectedData = await userRepository.getDetailedLeave(id);

        if (!selectedData) {
            throw new ErrorMapper("Selected leave data not found !", 404);
        }

        if (selectedData.status !== "pending") {
            throw new ErrorMapper("Only pending leave can be deleted !", 403);
        }

        const data = await userRepository.deleteSelectedLeave(id, user_id);

        LoggerContract.info("", "Completed deletion of selected leave list");

        return data;
    }
}
