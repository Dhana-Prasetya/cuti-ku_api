import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ChangePasswordValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        old_password: schema.string({ trim: true }, [rules.maxLength(255)]),
        new_password: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.minLength(8),
        ]),
    });

    public messages: CustomMessages = {
        "old_password.required": "Old password is required",
        "old_password.string": "Old password must be a string",
        "old_password.maxLength":
            "Old password cannot be longer than 255 characters",
        "new_password.required": "New password is required",
        "new_password.string": "New password must be a string",
        "new_password.maxLength":
            "New password cannot be longer than 255 characters",
        "new_password.minLength":
            "New password must be at least 8 characters long",
    };
}
