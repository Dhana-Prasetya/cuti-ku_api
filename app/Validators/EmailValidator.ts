import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class EmailValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        email: schema.string({ trim: true }, [
            rules.email(), // Automatically checks for '@' and valid domain
            rules.maxLength(255),
        ]),
    });

    public messages: CustomMessages = {
        "email.required": "Email is required",
        "email.string": "Email must be a string",
        "email.email": "Please provide a valid email address",
        "email.maxLength": "Email cannot be longer than 255 characters",
    };
}
