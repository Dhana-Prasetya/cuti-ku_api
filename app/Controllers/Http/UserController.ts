import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ErrorMapper from "App/helper/ErrorMapper";
import standarizedResponse from "App/helper/standarizedResponse";
import EnableEmployeeAccount from "App/usecases/enableEmployeeAccount";
import FetchPaginatedUser from "App/usecases/fetchPaginatedUser";
import IdValidator from "App/Validators/IdValidator";

import PaginationValidator from "App/Validators/PaginationValidator";

export default class UserController {
    public async list({ request, response }: HttpContextContract) {
        let queryObject = request.qs();
        queryObject = await request.validate(PaginationValidator); // Validator & normalizer for pagination query data

        const page = parseInt(queryObject.page) || 1; // Default to page 1 if not provided or invalid
        const limit = parseInt(queryObject.limit) || 10; // Default to 10 items per page if not provided or invalid

        const data = await FetchPaginatedUser.runUseCase({ page }, { limit });

        return response
            .status(201)
            .send(
                standarizedResponse(
                    data,
                    201,
                    "Fetched paginated user list success !",
                ),
            );
    }

    public async enable({ request, response }: HttpContextContract) {
        const user_id = request.param("id");

        const body = request.body();

        let enableStatus: any = true;

        if (body.enable === "false") {
            enableStatus = false;
        }
        if (body.enable !== "false" && body.enable !== "true") {
            throw new ErrorMapper(
                "Enable value only support 'true' or 'false' !",
                400,
            );
        }

        const data = await EnableEmployeeAccount.runUseCase({
            user_id,
            enableStatus,
        });

        return response
            .status(200)
            .send(
                standarizedResponse(
                    data,
                    200,
                    `User account has been successfully ${
                        enableStatus ? "enabled" : "disabled"
                    } !`,
                ),
            );
    }
}
