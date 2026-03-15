import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UpdateEmployeeStatusValidator {
    constructor(protected ctx: HttpContextContract) {}

    public data = {
        // enabling validation for both params and body in single validator file
        id: this.ctx.params.id,
        enable: this.ctx.request.input("enable"),
    };

    public schema = schema.create({
        id: schema.string([rules.maxLength(255)]),
        enable: schema.enum(["true", "false"] as const),
    });

    public messages: CustomMessages = {
        "id.required": "ID is required",
        "id.string": "ID must be a string",
        "id.maxLength": "ID must be less than or equal to 255 characters",
        "enable.required": "Enable status is required",
        "enable.enum": "Enable status must be either 'true' or 'false'",
    };
}
