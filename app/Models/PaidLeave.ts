import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "./Users";

export default class PaidLeave extends BaseModel {
    public static table = "paid_leave"; // Explicitly set because of underscore

    @column({ isPrimary: true })
    public id: number;

    @column()
    public userId: string;

    @column()
    public startDate: DateTime;

    @column()
    public endDate: DateTime;

    @column()
    public status: "Pending" | "Approved" | "Rejected";

    @column()
    public approvedBy: string;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;
}
