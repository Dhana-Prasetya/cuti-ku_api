import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SetPasswordValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        password: schema.string({ trim: true }, [
            rules.maxLength(255),
            rules.minLength(8),
        ]),
    });

    public messages: CustomMessages = {
        "password.required": "Password is required",
        "password.string": "Password must be a string",
        "password.maxLength": "Password cannot be longer than 255 characters",
        "password.minLength": "Password must be at least 8 characters long",
    };
}
