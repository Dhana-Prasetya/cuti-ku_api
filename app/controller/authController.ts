import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ConventionalLogin from "App/usecases/conventionalLogin";
import ConventionalLoginValidator from "App/Validators/ConventionalLoginValidator";

export default class AuthController {
    public async login({ request, response }: HttpContextContract) {
        const data = await request.validate(ConventionalLoginValidator); // Validator & normalizer for login data

        const isLoginValid = await ConventionalLogin.runUseCase({
            email: data.email,
            password: data.password,
        });

        if (!isLoginValid) {
            return response.unauthorized({
                message: "Invalid email or password",
            });
        }
    }
    // public async google() {}

    // public async googleCallback() {}

    // public async setPassword({ request, auth, response }: HttpContextContract) {
    //     const password = request.input("password");
    // }

    // public async changePassword() {}

    // public async addUser({ request, response }: HttpContextContract) {
    //     const email = request.input("email");
    // }
}
