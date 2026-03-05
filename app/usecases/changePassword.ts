import userRepository from "@ioc:App/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";
import ErrorMapper from "App/helper/ErrorMapper";
import LoggerContract from "@ioc:App/Services/LoggerContract";

export default class ChangePassword {
    public static async runUseCase(
        { user_id }: { user_id: string },
        { old_password }: { old_password: string },
        { new_password }: { new_password: string },
    ) {
        LoggerContract.info("", "Starting change password process");

        const query = await userRepository.isPasswordExist(user_id);

        const matchedPassword = await Hash.verify(query.password, old_password);

        if (!matchedPassword) {
            throw new ErrorMapper("Invalid password !", 401);
        }

        const newHashedPassword = await Hash.make(new_password);

        await userRepository.setPassword(user_id, newHashedPassword);

        LoggerContract.info(
            "",
            "Successfully completed change password process",
        );
    }
}
