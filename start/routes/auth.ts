import Route from "@ioc:Adonis/Core/Route";

export default function authRoutes() {
    // No rate limit
    Route.group(() => {
        Route.get("google", "AuthController.google");
        Route.get("google-callback", "AuthController.googleCallback");
    }).prefix("/auth");

    // Rate Limited
    Route.group(() => {
        Route.post("login", "AuthController.login");
        Route.post("set-password", "AuthController.setPassword").middleware(
            "GlobalCookieAuth",
        );
        Route.patch(
            "change-password",
            "AuthController.changePassword",
        ).middleware("EmployeeCookieAuth");
        Route.post(
            "register-employee",
            "AuthController.registerEmployee",
        ).middleware("AdminCookieAuth");
        Route.get("refresh", "AuthController.refresh");
        Route.post("logout", "AuthController.logout").middleware(
            "GlobalCookieAuth",
        );
    })
        .prefix("/auth")
        .middleware("RateLimiter");
}
