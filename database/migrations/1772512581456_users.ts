import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
    protected userTable = "users";
    protected paidLeaveTable = "paid_leave";
    protected leaveBalanceTable = "leave_balances";

    public async up() {
        // Users Table
        this.schema.createTable(this.userTable, (table) => {
            table
                .uuid("id")
                .primary()
                .defaultTo(this.db.rawQuery("uuid_generate_v4()").toQuery());
            table.string("username", 20).notNullable().unique();
            table.string("email", 255).notNullable().unique();
            table.string("password").nullable();
            table
                .enum("role", ["user", "admin"])
                .defaultTo("user")
                .notNullable();
            table
                .timestamp("created_at", { useTz: true })
                .defaultTo(this.now());
        });

        // Paid Leave Table
        this.schema.createTable(this.paidLeaveTable, (table) => {
            table.increments("id").primary();
            table
                .uuid("user_id")
                .references("id")
                .inTable(this.userTable)
                .onDelete("RESTRICT");
            table.date("start_date").notNullable();
            table.date("end_date").notNullable();
            table.string("attachment_url", 500).notNullable();
            table.string("rejection_reason", 500).nullable();
            table
                .enum("status", ["Pending", "Approved", "Rejected"])
                .defaultTo("Pending")
                .notNullable();
            table
                .uuid("approved_by")
                .references("id")
                .inTable(this.userTable)
                .notNullable();
            table
                .timestamp("created_at", { useTz: true })
                .defaultTo(this.now());
        });

        // 3. Leave Balances Table
        this.schema.createTable(this.leaveBalanceTable, (table) => {
            table
                .uuid("user_id")
                .references("id")
                .inTable(this.userTable)
                .onDelete("RESTRICT");
            table.integer("year").notNullable();
            table.integer("total_allowed").defaultTo(12);
            table.integer("taken").defaultTo(0);

            // Define Composite Primary Key
            table.primary(["user_id", "year"]);
        });

        // SQL Constraints
        this.defer(async (db) => {
            await db.rawQuery(`
                ALTER TABLE ${this.paidLeaveTable} 
                ADD CONSTRAINT check_dates CHECK (end_date >= start_date)
            `);

            // Exclusion constraint
            await db.rawQuery(`
                ALTER TABLE ${this.paidLeaveTable} 
                ADD CONSTRAINT exclude_overlapping_leave 
                EXCLUDE USING gist (
                  user_id WITH =,
                  ( daterange(start_date, end_date, '[]') ) WITH &&
                )
            `);
        });
    }

    public async down() {
        // Drop in reverse order to avoid foreign key violations
        this.schema.dropTable(this.leaveBalanceTable);
        this.schema.dropTable(this.paidLeaveTable);
        this.schema.dropTable(this.userTable);
    }
}
