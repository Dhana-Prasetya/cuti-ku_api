declare module "@ioc:App/Services/CloudinaryServicesContract" {
    import type { AttachmentUploadDTO } from "App/helper/attachmentUploadDTO";

    export interface CloudinaryServicesContract {
        uploadAttachment(
            data: AttachmentUploadDTO,
            file_name: string,
        ): Promise<string>;
        deleteAttachment(attachment_url: any): Promise<void>;
    }

    const cloudinaryServices: CloudinaryServicesContract;
    export default cloudinaryServices;
}
