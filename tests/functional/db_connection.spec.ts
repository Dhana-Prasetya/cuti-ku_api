import { test } from "@japa/runner";
import Database from "@ioc:Adonis/Lucid/Database";
import { QueryClientContract } from "@ioc:Adonis/Lucid/Database"; // Import the Type

test.group("Database connection", () => {
    test("should connect to the database", async ({ assert }) => {
        // 1. Get the client and explicitly tell TS it is a QueryClientContract
        const client = Database.connection() as QueryClientContract;

        // 2. Execute a simple query
        const result = await client.rawQuery("SELECT 1 as isconnected");

        // 3. Handle result based on the dialect (much safer than checking config.client)
        const dialect = client.dialect.name;
        let rows = [];

        if (dialect === "postgres") {
            rows = result.rows;
        } else {
            rows = result;
        }

        // assert.equal(rows[0].isconnected, 1, 'Database connection failed')
    });
});
