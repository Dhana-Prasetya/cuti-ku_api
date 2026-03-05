import UserRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class RegisterEmployee {
    public static async runUseCase(email: string) {
        LoggerContract.info("", "Starting employee register process");

        await UserRepository.registerEmployee(email);

        LoggerContract.info(
            "",
            "Successfully completed employee register process",
        );
    }
}
