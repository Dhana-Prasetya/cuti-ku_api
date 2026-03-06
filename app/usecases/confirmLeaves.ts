import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import ErrorMapper from "App/helper/ErrorMapper";

export default class ConfirmLeaves {
    public static async runUseCase({
        selected_id,
        status,
    }: {
        selected_id: number;
        status: string;
    }) {
        LoggerContract.info("", "Starting confirm of user leave process");

        const selectedData = await userRepository.getDetailedLeave(selected_id);

        if (!selectedData) {
            throw new ErrorMapper("Selected leave data not found !", 404);
        }

        if (selectedData.status !== "Pending") {
            throw new ErrorMapper("Only pending leave can be confirmed !", 403);
        }

        const data = await userRepository.confirmLeaveStatus(
            selected_id,
            status,
        );

        LoggerContract.info(
            "",
            "Successfully completed confirm of user leave process",
        );
    }
}
