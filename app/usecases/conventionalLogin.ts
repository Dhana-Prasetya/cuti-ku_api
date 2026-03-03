import userRepository from "@ioc:App/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";

interface loginData {
    // defined data required for login
    email: string;
    password: string;
}

export default class ConventionalLogin {
    public static async runUseCase(data: loginData) {
        try {
            const queryPassword = await userRepository.login(data.email);

            const matchedPassword = await Hash.verify(
                queryPassword.password,
                data.password,
            );

            if (!matchedPassword) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            throw new Error("Internal server error");
        }
    }
}
