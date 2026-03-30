import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class ConfirmLeaves {
    public static async runUseCase({
        selected_id,
        status,
        user_id,
        rejection_reason,
    }: {
        selected_id: number;
        status: string;
        user_id: string;
        rejection_reason: string;
    }) {
        LoggerContract.info("", "Starting confirm of user leave process");

        await userRepository.confirmLeaveStatus(
            selected_id,
            status,
            user_id,
            rejection_reason,
        );

        LoggerContract.info(
            "",
            "Successfully completed confirm of user leave process",
        );
    }
}
