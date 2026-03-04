import userRepository from "@ioc:App/UserRepository";
import Hash from "@ioc:Adonis/Core/Hash";

export default class SetPassword {
    public static async runUseCase(id: string, password: string) {
        try {
            const passwordExist = await userRepository.isPasswordExist(id);

            if (passwordExist) {
                return false;
            }

            const hashedPassword = await Hash.make(password);

            await userRepository.setPassword(id, hashedPassword);

            return true;
        } catch (error) {
            throw new Error("Internal server error");
        }
    }
}
