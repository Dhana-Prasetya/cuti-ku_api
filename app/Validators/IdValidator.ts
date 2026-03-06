import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class IdValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        id: schema.number.optional([
            rules.range(1, Number.MAX_SAFE_INTEGER), // Ensure id is a positive integer for optional field
        ]),
    });

    public messages: CustomMessages = {
        "id.required": "Id is required",
        "id.number": "Id must be a number",
        "id.range": "Id must be a positive integer",
    };
}
