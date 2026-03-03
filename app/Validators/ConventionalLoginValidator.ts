import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ConventionalLoginValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        email: schema.string({ trim: true }, [
            rules.email(), // Automatically checks for '@' and valid domain
            rules.maxLength(255),
            rules.normalizeEmail({ allLowercase: true }), // Normalizes email by converting to lowercase and removing dots for Gmail addresses
        ]),
        password: schema.string({ trim: true }, [rules.maxLength(255)]),
    });

    public messages: CustomMessages = {
        "email.required": "Email is required",
        "email.string": "Email must be a string",
        "email.email": "Please provide a valid email address",
        "email.maxLength": "Email cannot be longer than 255 characters",
        "password.required": "Password is required",
        "password.string": "Password must be a string",
        "password.maxLength": "Password cannot be longer than 255 characters",
    };
}
