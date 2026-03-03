import Route from "@ioc:Adonis/Core/Route";

export default function leavesRoutes() {
    Route.group(() => {
        // User
        Route.post("/add", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.delete("/del/:id", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        Route.get("/my-list", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });

        // Admin
        Route.get("/list", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });
        Route.patch("/list/:id", async () => {
            return { message: "Welcome to Cuti-Ku API!" };
        });
    }).prefix("/leaves");
}
