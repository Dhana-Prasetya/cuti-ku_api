import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class DateValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        start_date: schema.date({ format: "yyyy-MM-dd" }, [
            rules.after("today"),
        ]),
        end_date: schema.date({ format: "yyyy-MM-dd" }, [rules.after("today")]),
    });

    public messages: CustomMessages = {
        "start_date.required": "Start date is required",
        "start_date.string": "Start date must be a string",
        "start_date.date": "Start date must be a valid date",
        "end_date.required": "End date is required",
        "end_date.string": "End date must be a string",
        "end_date.date": "End date must be a valid date",
    };
}
