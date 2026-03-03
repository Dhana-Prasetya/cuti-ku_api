import { HttpContext, inject } from "@adonisjs/core/build/standalone";

@inject()
export default class LeavesController {
    public async add({ request }: HttpContext) {}
    public async delete() {}

    public async myLeaveList() {}

    public async paginatedLeaveList() {}

    public async confirmLeave() {}
}
