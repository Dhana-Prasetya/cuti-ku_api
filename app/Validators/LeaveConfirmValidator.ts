import { schema, rules, CustomMessages } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class LeaveConfirmValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        selected_id: schema.number([rules.range(1, Number.MAX_SAFE_INTEGER)]),
        status: schema.enum(["Approved", "Rejected"] as const),
    });

    public messages: CustomMessages = {
        "selected_id.required": "Selected ID is required",
        "selected_id.minLength": "At least one ID must be selected",
        "status.required": "Status is required",
        "status.enum": "Status must be either 'Approved' or 'Rejected'",
    };
}
