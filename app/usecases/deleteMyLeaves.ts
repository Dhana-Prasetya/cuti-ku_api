import userRepository from "@ioc:App/UserRepository";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import cloudinaryServices from "@ioc:App/Services/CloudinaryServicesContract";

export default class DeleteMyLeaves {
    public static async runUseCase(id: number, user_id: string) {
        LoggerContract.info("", "Starting delete leave process");

        const { query, attachment_url } =
            await userRepository.deleteSelectedLeave(id, user_id);

        await cloudinaryServices.deleteAttachment(attachment_url); // Delete the attachment from Cloudinary

        LoggerContract.info("", "Successfully completed delete leave process");

        return query;
    }
}
