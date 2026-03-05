import userRepository from "@ioc:App/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";
import ErrorMapper from "App/helper/ErrorMapper";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class SetPassword {
    public static async runUseCase(id: string, password: string) {
        LoggerContract.info("", "Starting set password process");

        const fetchedData = await userRepository.isPasswordExist(id);

        if (fetchedData.password) {
            throw new ErrorMapper("Password already set !", 403);
        }

        const hashedPassword = await Hash.make(password);

        await userRepository.setPassword(id, hashedPassword);

        LoggerContract.info("", "Successfully completed set password process");
    }
}
