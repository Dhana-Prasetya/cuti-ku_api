import Route from "@ioc:Adonis/Core/Route";

export default function userRoutes() {
    Route.group(() => {
        // User
        Route.get("/list", "UserController.list").middleware("AdminCookieAuth");

        Route.patch("enable/:id", "UserController.enable").middleware(
            "AdminCookieAuth",
        );
    })
        .prefix("user")
        .middleware("RateLimiter");
}
