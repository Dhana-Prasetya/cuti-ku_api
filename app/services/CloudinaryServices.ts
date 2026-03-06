import type { CloudinaryServicesContract } from "@ioc:App/Services/CloudinaryServicesContract";
import type { AttachmentUploadDTO } from "App/helper/attachmentUploadDTO";
import { v2 } from "cloudinary";
import Env from "@ioc:Adonis/Core/Env";

export default class CloudinaryServices implements CloudinaryServicesContract {
    public uploadAttachment = async (
        data: AttachmentUploadDTO,
        file_name: string,
    ) => {
        const buffer = data?.buffer;

        if (!Buffer.isBuffer(buffer)) {
            throw new TypeError("Attachment data must include a valid Buffer");
        }

        const upload = await new Promise<any>((resolve, reject) => {
            const stream = v2.uploader.upload_stream(
                {
                    public_id: file_name,
                    folder: Env.get("CLOUDINARY_FOLDER"),
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(
                            error || new Error("Cloudinary upload failed"),
                        );
                    }

                    resolve(result);
                },
            );

            stream.end(buffer);
        });

        return upload.secure_url as string;
    };

    public deleteAttachment = async (attachment_url: any) => {
        const cloudinaryPublicId = getCloudinaryPublicId(attachment_url);

        const status = await v2.uploader.destroy(cloudinaryPublicId, {
            type: "upload",
        });
    };
}

function getCloudinaryPublicId(url) {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
