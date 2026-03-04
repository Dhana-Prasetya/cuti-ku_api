import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import oauthProvider from "@ioc:App/Services/OAuthProvider";
import ConventionalLogin from "App/usecases/conventionalLogin";
import oauthLogin from "App/usecases/oauthLogin";
import ConventionalLoginValidator from "App/Validators/ConventionalLoginValidator";
import Env from "@ioc:Adonis/Core/Env";
import {
    accessTokenCookieHelper,
    refreshTokenCookieHelper,
} from "App/helper/cookies";
import SetPassword from "App/usecases/setPassword";

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
    public async google(ctx: HttpContextContract) {
        return oauthProvider.redirect(ctx);
    }

    public async googleCallback(ctx: HttpContextContract) {
        try {
            if (oauthProvider.accessDenied(ctx)) {
                return ctx.response.unauthorized({
                    message: "Access denied by user",
                });
            }
            if (oauthProvider.stateMisMatch(ctx)) {
                return ctx.response.badRequest({
                    message: "Invalid OAuth state",
                });
            }
            if (oauthProvider.hasError(ctx)) {
                return ctx.response.badRequest(oauthProvider.getError(ctx));
            }

            const oldRefreshToken = ctx.request.cookie("refreshToken");

            const validAuth = await oauthLogin.runUseCase(ctx, oldRefreshToken);

            if (!validAuth)
                return ctx.response.unauthorized({ message: "User not found" });

            const accessTokenOptions: any = accessTokenCookieHelper;
            const refreshTokenOptions: any = refreshTokenCookieHelper;

            if (Env.get("NODE_ENV") === "development") {
                accessTokenOptions.secure = false;
                accessTokenOptions.sameSite = "lax";
                refreshTokenOptions.secure = false;
                refreshTokenOptions.sameSite = "lax";
            }

            ctx.response.cookie(
                "accessToken",
                validAuth.accessToken,
                accessTokenOptions,
            );

            ctx.response.cookie(
                "refreshToken",
                validAuth.jti,
                refreshTokenOptions,
            );

            return ctx.response.ok({ message: "Google login successful" });
        } catch (error) {
            return ctx.response.internalServerError({
                message: "Internal server error",
            });
        }
    }

    public async setPassword({ request, response }: HttpContextContract) {
        const password: any = request.only(["password"]);

        const id = "ac512f77-f8de-4a85-a8b2-d86633aa03e4";

        const isPasswordSet = await SetPassword.runUseCase(id, password);

        return response.ok({ isPasswordSet });
    }

    // public async changePassword() {}

    // public async addUser({ request, response }: HttpContextContract) {
    //     const email = request.input("email");
    // }}
}
