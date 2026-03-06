import Route from "@ioc:Adonis/Core/Route";

export default function leavesRoutes() {
    Route.group(() => {
        // User
        Route.post("/submit", "LeavesController.submit").middleware(
            "EmployeeCookieAuth",
        );

        Route.delete("del/:id", "LeavesController.delete").middleware(
            "EmployeeCookieAuth",
        );

        Route.get("my-list", "LeavesController.myLeaveList").middleware(
            "GlobalCookieAuth",
        );

        // Admin
        Route.get("list", "LeavesController.paginatedLeaveList").middleware(
            "AdminCookieAuth",
        );

        Route.patch("list/confirm", "LeavesController.confirmLeave").middleware(
            "AdminCookieAuth",
        );
    }).prefix("leaves");
}
