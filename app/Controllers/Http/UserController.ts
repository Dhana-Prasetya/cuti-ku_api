import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import standarizedResponse from "App/helper/standarizedResponse";
import EnableEmployeeAccount from "App/usecases/enableEmployeeAccount";
import FetchPaginatedUser from "App/usecases/fetchPaginatedUser";

import PaginationValidator from "App/Validators/PaginationValidator";
import UpdateEmployeeStatusValidator from "App/Validators/UpdateEmployeeStatusValidator";

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
        const requestObject = await request.validate(
            UpdateEmployeeStatusValidator,
        );

        const { id, enable } = requestObject;

        const user_id = id; // for better readability

        let enableStatus: any = true; // default as true, can be true or false

        if (enable === "false") {
            enableStatus = false;
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
