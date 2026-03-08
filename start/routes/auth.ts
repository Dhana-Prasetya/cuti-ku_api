import Route from "@ioc:Adonis/Core/Route";

export default function authRoutes() {
    Route.group(() => {
        Route.post("login", "AuthController.login");

        Route.get("google", "AuthController.google");

        Route.get("google-callback", "AuthController.googleCallback");

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
