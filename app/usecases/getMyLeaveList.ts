import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class GetMyLeaveList {
    public static async runUseCase(user_id: string) {
        LoggerContract.info("", "Starting fetch of user leave list process");

        const data = await userRepository.getMyLeaveList(user_id);

        LoggerContract.info(
            "",
            "Successfully completed fetch of user leave list process",
        );
        return data;
    }
}
