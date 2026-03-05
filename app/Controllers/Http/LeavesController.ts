import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import oauthProvider from "@ioc:App/Services/OAuthProvider";
import ConventionalLoginValidator from "App/Validators/ConventionalLoginValidator";
import Env from "@ioc:Adonis/Core/Env";
import { stageProperty } from "App/helper/cookies";
import SetPasswordValidator from "App/Validators/SetPasswordValidator";
import standarizedResponse from "App/helper/standarizedResponse";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";
import EmailValidator from "App/Validators/EmailValidator";

import GetMyLeaveList from "App/usecases/getMyLeaveList";

export default class LeavesController {
    // public async add({ request, response }: HttpContextContract) {}

    // public async delete({ request, response }: HttpContextContract) {}

    public async myLeaveList({ user_id, response }: HttpContextContract) {
        const data = await GetMyLeaveList.runUseCase(user_id);

        return standarizedResponse(
            data,
            200,
            "Successfully fetched user leave list",
        );
    }

    // public async paginatedLeaveList({
    //     request,
    //     response,
    // }: HttpContextContract) {}

    // public async confirmLeave({ request, response }: HttpContextContract) {}
}
