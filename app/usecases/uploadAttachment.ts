import { AttachmentUploadDTO } from "App/helper/attachmentUploadDTO";
import cloudinaryServices from "@ioc:App/Services/CloudinaryServicesContract";
import jwtServices from "@ioc:App/Services/JwtServicesContract";
import userRepository from "@ioc:App/UserRepository";
import { DateTime } from "luxon";
import LoggerContract from "@ioc:App/Services/LoggerContract";
import ErrorMapper from "App/helper/ErrorMapper";

export default class UploadAttachment {
    public async execute(
        data: AttachmentUploadDTO,
        user_id: string,
        start_date: any,
        end_date: any,
    ) {
        let attachment_url: any = "";

        try {
            LoggerContract.info("", "Starting upload of attachment");

            const uniqueId = jwtServices.generateUniqueId();
            const file_name = uniqueId;

            const startUTC = DateTime.fromISO(start_date);
            const endUTC = DateTime.fromISO(end_date);
            const daysGap = endUTC.diff(startUTC, "days").days;

            attachment_url = await cloudinaryServices.uploadAttachment(
                data,
                file_name,
            );

            const insertAttachment = await userRepository.addLeaves(
                user_id,
                start_date,
                end_date,
                attachment_url,
                daysGap,
            );

            LoggerContract.info("", "Completed upload of attachment");

            return insertAttachment;
        } catch (error) {
            const isOverlapError =
                error instanceof ErrorMapper &&
                error.appCode === "EXCLUDE_OVERLAPPING_LEAVE";

            if (isOverlapError && attachment_url) {
                await cloudinaryServices.deleteAttachment(attachment_url);
            }

            throw error;
        }
    }
}
