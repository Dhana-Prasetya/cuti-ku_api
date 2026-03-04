import ally from "@ioc:Adonis/Addons/Ally";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import type { OAuthProvider, OAuthUser } from "@ioc:App/Services/OAuthProvider";

export default class GoogleOAuthProvider implements OAuthProvider {
    private getGoogleDriver(ctx: HttpContextContract) {
        return ally.getAllyForRequest(ctx).use("google");
    }

    public async redirect(ctx: HttpContextContract): Promise<void> {
        await this.getGoogleDriver(ctx).redirect();
    }

    public accessDenied(ctx: HttpContextContract): boolean {
        return this.getGoogleDriver(ctx).accessDenied();
    }

    public stateMisMatch(ctx: HttpContextContract): boolean {
        return this.getGoogleDriver(ctx).stateMisMatch();
    }

    public hasError(ctx: HttpContextContract): boolean {
        return this.getGoogleDriver(ctx).hasError();
    }

    public getError(ctx: HttpContextContract): any {
        return this.getGoogleDriver(ctx).getError();
    }

    public async getUser(ctx: HttpContextContract): Promise<OAuthUser> {
        const user = await this.getGoogleDriver(ctx).user();

        if (!user.email || !user.name) {
            throw new Error(
                "Google account is missing required profile fields",
            );
        }

        return {
            email: user.email,
            name: user.name,
        };
    }
}
