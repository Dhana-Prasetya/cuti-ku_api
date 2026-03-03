import Route from "@ioc:Adonis/Core/Route";

export default function leavesRoutes() {
    Route.group(() => {
        // User
        Route.post("/", "LeavesController.add");

        Route.delete("del/:id", "LeavesController.delete");

        Route.get("my-list", "LeavesController.myLeaveList");

        // Admin
        Route.get("list", "LeavesController.paginatedLeaveList");
        Route.patch("list/:id", "LeavesController.confirmLeave");
    }).prefix("leaves");
}
