import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import standarizedResponse from "App/helper/standarizedResponse";

import GetMyLeaveList from "App/usecases/getMyLeaveList";
import FetchPaginatedLeaveList from "App/usecases/fetchPaginatedLeaveList";
import PaginatedLeavesValidator from "App/Validators/PaginatedLeavesValidator";
import DateValidator from "App/Validators/DateValidator";
import fs from "fs";
import UploadAttachment from "App/usecases/uploadAttachment";
import IdValidator from "App/Validators/IdValidator";
import LeaveConfirmValidator from "App/Validators/LeaveConfirmValidator";
import ConfirmLeaves from "App/usecases/confirmLeaves";
import DeleteMyLeaves from "App/usecases/deleteMyLeaves";

export default class LeavesController {
    public async submit({ user_id, request, response }: HttpContextContract) {
        const attachment = request.file("attachment", {
            size: "5MB",
            extnames: ["jpg", "png", "jpeg", "pdf"],
        });

        if (!attachment || !attachment.isValid) {
            return response
                .status(400)
                .send(
                    standarizedResponse(
                        null,
                        400,
                        "Attachment is required and must be a file of type jpg, png, jpeg, or pdf, and must not exceed 5MB in size",
                    ),
                );
        }

        const requestObject = await request.validate(DateValidator);

        let { start_date, end_date } = requestObject; // returning luxon date format

        if (start_date > end_date) {
            return response
                .status(400)
                .send(
                    standarizedResponse(
                        null,
                        400,
                        "Start leave date cannot be after end date !",
                    ),
                );
        }

        if (!attachment.tmpPath || !attachment.type) {
            return response
                .status(400)
                .send(
                    standarizedResponse(
                        null,
                        400,
                        "Attachment upload data is incomplete",
                    ),
                );
        }

        // read file into memory
        const buffer = await fs.promises.readFile(attachment.tmpPath);

        const attachmentUseCase = new UploadAttachment();

        const data = await attachmentUseCase.execute(
            {
                buffer,
                fileName: attachment.clientName,
                mimeType: attachment.type,
            },
            user_id,
            start_date,
            end_date,
        );

        return response.send(
            standarizedResponse(
                data,
                201,
                "Paid leaves request submitted successfully !",
            ),
        );
    }

    public async delete({ user_id, request, response }: HttpContextContract) {
        let idObject = request.param("id");

        idObject = await request.validate(IdValidator);

        const data = await DeleteMyLeaves.runUseCase(idObject.id, user_id);

        return response.send(
            standarizedResponse(
                data,
                200,
                "Selected leave request deleted successfully !",
            ),
        );
    }

    public async myLeaveList({ user_id, response }: HttpContextContract) {
        const data = await GetMyLeaveList.runUseCase(user_id);

        return response
            .status(201)
            .send(
                standarizedResponse(
                    data,
                    201,
                    "Fetched user leave list success !",
                ),
            );
    }

    public async paginatedLeaveList({
        request,
        response,
    }: HttpContextContract) {
        let queryObject = request.qs();
        queryObject = await request.validate(PaginatedLeavesValidator); // Validator & normalizer for pagination query data

        const page = parseInt(queryObject.page) || 1; // Default to page 1 if not provided or invalid
        const limit = parseInt(queryObject.limit) || 10; // Default to 10 items per page if not provided or invalid
        const order = queryObject.order || "newest"; // Default to 'newest'. [newest, oldest]

        const data = await FetchPaginatedLeaveList.runUseCase({
            page,
            limit,
            order,
        });

        return response
            .status(201)
            .send(
                standarizedResponse(
                    data,
                    201,
                    `Fetched paginated leave list with ${order} order success !`,
                ),
            );
    }

    public async confirmLeave({
        user_id,
        request,
        response,
    }: HttpContextContract) {
        const payload = await request.validate(LeaveConfirmValidator);

        const selected_id = payload.selected_id;
        const status = payload.status;
        let rejection_reason = "";

        if (payload.rejection_reason) {
            // if provided, assign to variable
            rejection_reason = payload.rejection_reason;
        }

        await ConfirmLeaves.runUseCase({
            selected_id,
            status,
            user_id,
            rejection_reason,
        });

        return response.send(
            standarizedResponse(
                null,
                200,
                `Leave request for id ${selected_id} confirmed successfully !`,
            ),
        );
    }
}
