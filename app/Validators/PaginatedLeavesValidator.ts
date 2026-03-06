import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class PaginatedLeavesValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        page: schema.number.optional([
            rules.range(1, Number.MAX_SAFE_INTEGER), // Ensure page is a positive integer for optional field
        ]),
        limit: schema.number.optional([
            rules.range(1, Number.MAX_SAFE_INTEGER),
        ]), // Ensure limit is a positive integer
        order: schema.string.optional({ trim: true }, [rules.maxLength(10)]),
    });

    public messages: CustomMessages = {
        "page.required": "Page is required",
        "page.number": "Page must be a number",
        "page.range": "Page must be a positive integer",
        "limit.required": "Limit is required",
        "limit.number": "Limit must be a number",
        "limit.range": "Limit must be a positive integer",
        "order.required": "Order is required",
        "order.string": "Order must be a string",
        "order.maxLength": "Order cannot be longer than 10 characters",
    };
}
