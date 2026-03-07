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

            let start_date_string: string = start_date.toISODate(); // turn luxon format into string
            let end_date_string: string = end_date.toISODate();

            const start_date_UTC: Date = new Date(start_date_string); // turn string into utc date (cant be done directly since it would get normalized)
            const end_date_UTC: Date = new Date(end_date_string);

            const uniqueId: string = jwtServices.generateUniqueId();
            const file_name: any = `${user_id}_${uniqueId}`;

            const gap = end_date_UTC.getTime() - start_date_UTC.getTime(); // subtratct to get the gap in milliseconds
            const daysGap = gap / (1000 * 60 * 60 * 24) + 1; // convert milliseconds into days, then add 1 to include both start and end date in the count

            const year = start_date_UTC.getUTCFullYear();

            console.log(daysGap, typeof daysGap); // debug

            attachment_url = await cloudinaryServices.uploadAttachment(
                data,
                file_name,
            );

            const insertAttachment = await userRepository.addLeaves(
                user_id,
                start_date_UTC,
                end_date_UTC,
                attachment_url,
                daysGap,
                year,
            );

            LoggerContract.info("", "Completed upload of attachment");

            return insertAttachment;
        } catch (error) {
            cloudinaryServices.deleteAttachment(attachment_url); // Clean up the uploaded file if there was an error during the process

            const isOverlapError =
                error instanceof ErrorMapper &&
                error.appCode === "EXCLUDE_OVERLAPPING_LEAVE";

            const isInsufficientBalanceError =
                error instanceof ErrorMapper &&
                error.appCode === "LEAVE_BALANCE_INSUFFICIENT";

            throw error;
        }
    }
}
