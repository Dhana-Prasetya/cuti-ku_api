import Route from "@ioc:Adonis/Core/Route";

export default function authRoutes() {
    Route.group(() => {
        Route.post("login", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.get("google", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.get("google-callback", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.post("set-password", async ({ request }) => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.patch("change-password", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.post("add-user", async ({ request }) => {
            return { message: "Welcome to Cuti-Ku API!" };
        });
    }).prefix("/auth");
}
