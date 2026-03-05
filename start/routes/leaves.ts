import Route from "@ioc:Adonis/Core/Route";

export default function leavesRoutes() {
    Route.group(() => {
        // User
        Route.post("/", "LeavesController.add").middleware(
            "EmployeeCookieAuth",
        );

        Route.delete("del/:id", "LeavesController.delete").middleware(
            "EmployeeCookieAuth",
        );

        Route.get("my-list", "LeavesController.myLeaveList").middleware(
            "EmployeeCookieAuth",
        );

        // Admin
        Route.get("list", "LeavesController.paginatedLeaveList").middleware(
            "AdminCookieAuth",
        );

        Route.patch("list/:id", "LeavesController.confirmLeave").middleware(
            "AdminCookieAuth",
        );
    }).prefix("leaves");
}
