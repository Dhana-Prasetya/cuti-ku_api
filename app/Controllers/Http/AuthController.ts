import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import oauthProvider from "@ioc:App/Services/OAuthProvider";
import ConventionalLogin from "App/usecases/conventionalLogin";
import oauthLogin from "App/usecases/oauthLogin";
import ConventionalLoginValidator from "App/Validators/ConventionalLoginValidator";
import Env from "@ioc:Adonis/Core/Env";
import { stageProperty } from "App/helper/cookies";
import SetPassword from "App/usecases/setPassword";
import SetPasswordValidator from "App/Validators/SetPasswordValidator";
import standarizedResponse from "App/helper/standarizedResponse";
import ChangePassword from "App/usecases/changePassword";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";
import EmailValidator from "App/Validators/EmailValidator";
import RegisterEmployee from "App/usecases/registerEmployee";
import RefreshingToken from "App/usecases/refreshingToken";
import Logout from "App/usecases/logout";

export default class AuthController {
    public async login({ request, response }: HttpContextContract) {
        const requestObject = await request.validate(
            ConventionalLoginValidator,
        ); // Validator & normalizer for login data

        const email: string = requestObject.email;
        const password: string = requestObject.password;

        const oldRefreshToken = request.cookie("refreshToken");
        const oldAccessToken = request.cookie("accessToken");

        const conventionalLoginAuth = await ConventionalLogin.runUseCase(
            { email },
            { password },
            { oldRefreshToken },
            { oldAccessToken },
        );

        // Cookies

        const stage = Env.get("NODE_ENV");

        const { accessTokenCookieHelper, refreshTokenCookieHelper } =
            stageProperty(stage);

        response.cookie(
            "accessToken",
            conventionalLoginAuth.accessToken,
            accessTokenCookieHelper,
        );

        response.cookie(
            "refreshToken",
            conventionalLoginAuth.jti,
            refreshTokenCookieHelper,
        );

        return response
            .status(201)
            .send(
                standarizedResponse(null, 201, "Conventional Login success !"),
            );
    }

    public async google(ctx: HttpContextContract) {
        return oauthProvider.redirect(ctx);
    }

    public async googleCallback(ctx: HttpContextContract) {
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
        const oldAccessToken = ctx.request.cookie("accessToken");

        const organization_oauth = Env.get("ORGANIZATION_OAUTH");

        const validAuth = await oauthLogin.runUseCase(
            { ctx },
            { oldRefreshToken },
            { oldAccessToken },
            { organization_oauth },
        ); // Use case for handling OAuth login logic

        // Cookies

        const stage = Env.get("NODE_ENV");

        const { accessTokenCookieHelper, refreshTokenCookieHelper } =
            stageProperty(stage);

        ctx.response.cookie(
            "accessToken",
            validAuth.accessToken,
            accessTokenCookieHelper,
        );

        ctx.response.cookie(
            "refreshToken",
            validAuth.jti,
            refreshTokenCookieHelper,
        );

        return ctx.response
            .status(201)
            .send(standarizedResponse(null, 201, "Google Login success !"));
    }

    public async setPassword({
        user_id,
        request,
        response,
    }: HttpContextContract) {
        let passwordObject: any = request.input("password");

        passwordObject = await request.validate(SetPasswordValidator); // Validator (returning object with password property)

        await SetPassword.runUseCase(user_id, passwordObject.password);

        return response
            .status(201)
            .send(standarizedResponse(null, 201, "Set password success !"));
    }

    public async changePassword({
        user_id,
        request,
        response,
    }: HttpContextContract) {
        const requestObject = await request.validate(ChangePasswordValidator); // Validator for change password data

        const { old_password, new_password } = requestObject;

        await ChangePassword.runUseCase(
            { user_id },
            { old_password },
            { new_password },
        );

        return response
            .status(201)
            .send(standarizedResponse(null, 201, "Change password success !"));
    }

    public async registerEmployee({ request, response }: HttpContextContract) {
        let emailObject = request.input("email");

        emailObject = await request.validate(EmailValidator); // Validator for email data

        console.log(emailObject.email, emailObject);

        await RegisterEmployee.runUseCase(emailObject.email);

        return response
            .status(201)
            .send(
                standarizedResponse(
                    null,
                    201,
                    "Employee registered successfully !",
                ),
            );
    }

    public async refresh({ request, response }: HttpContextContract) {
        const oldRefreshToken = request.cookie("refreshToken");
        const oldAccessToken = request.cookie("accessToken");

        const newToken = await RefreshingToken.runUseCase(
            {
                oldRefreshToken,
            },
            {
                oldAccessToken,
            },
        );

        // Cookies

        const stage = Env.get("NODE_ENV");

        const { accessTokenCookieHelper, refreshTokenCookieHelper } =
            stageProperty(stage);

        response.cookie(
            "accessToken",
            newToken.accessToken,
            accessTokenCookieHelper,
        );

        response.cookie("refreshToken", newToken.jti, refreshTokenCookieHelper);

        return response
            .status(201)
            .send(
                standarizedResponse(
                    null,
                    201,
                    "Access token refreshed successfully !",
                ),
            );
    }

    public async logout({ request, response }: HttpContextContract) {
        const refreshToken = request.cookie("refreshToken");
        const accessToken = request.cookie("accessToken");

        await Logout.runUseCase(
            {
                refreshToken,
            },
            {
                accessToken,
            },
        );

        return response
            .status(200)
            .send(standarizedResponse(null, 200, "User logout successfully !"));
    }
}
