import userRepository from "@ioc:App/UserRepository";
import ErrorMapper from "App/helper/ErrorMapper";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import cloudinaryServices from "@ioc:App/Services/CloudinaryServicesContract";

export default class DeleteMyLeaves {
    public static async runUseCase(id: number, user_id: string) {
        LoggerContract.info("", "Starting delete leave process");

        const dbData = await userRepository.getDetailedLeave(id);

        if (!dbData) {
            throw new ErrorMapper("Selected leave not found", 404);
        }

        if (dbData.status !== "Pending") {
            throw new ErrorMapper("Only pending leaves can be deleted", 400);
        }

        const data = await userRepository.deleteSelectedLeave(id, user_id);

        await cloudinaryServices.deleteAttachment(dbData.attachment_url);

        LoggerContract.info("", "Successfully completed delete leave process");

        return data;
    }
}
