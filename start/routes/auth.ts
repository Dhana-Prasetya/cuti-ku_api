import Route from "@ioc:Adonis/Core/Route";

export default function authRoutes() {
    Route.group(() => {
        Route.post("login", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.get("google", "AuthController.google");

        Route.get("google-callback", "AuthController.googleCallback");

        Route.post("set-password", "AuthController.setPassword");
        Route.patch("change-password", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.post("add-user", async ({ request }) => {
            return { message: "Welcome to Cuti-Ku API!" };
        });
    }).prefix("/auth");
}
