declare module "@ioc:App/Services/OAuthProvider" {
    export interface OAuthUser {
        email: string;
        name: string;
    }

    export interface OAuthProvider {
        redirect(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): Promise<void>;
        accessDenied(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): boolean;
        stateMisMatch(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): boolean;
        hasError(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): boolean;
        getError(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): any;
        getUser(
            ctx: import("@ioc:Adonis/Core/HttpContext").HttpContextContract,
        ): Promise<OAuthUser>;
    }

    const oauthProvider: OAuthProvider;
    export default oauthProvider;
}
