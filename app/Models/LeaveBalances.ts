import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class LeaveBalance extends BaseModel {
    // not to expect a single 'id' (composite primary key)
    public static primaryKey = "user_id";

    @column({ isPrimary: true })
    public userId: string;

    @column({ isPrimary: true })
    public year: number;

    @column()
    public totalAllowed: number;

    @column()
    public taken: number;
}
