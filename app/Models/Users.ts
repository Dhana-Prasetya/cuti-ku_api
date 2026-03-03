import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import PaidLeave from "./PaidLeave";

export default class User extends BaseModel {
    // Select the row back after inserting
    public static selfAssignPrimaryKey = false;

    @column({ isPrimary: true })
    public id: string; // UUID is a string in TS

    @column()
    public name: string;

    @column()
    public email: string;

    @column({ serializeAs: null })
    public password: string;

    @column()
    public role: "user" | "admin";

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    // Relationship: One user has many leave requests
    @hasMany(() => PaidLeave)
    public leaves: HasMany<typeof PaidLeave>;
}
