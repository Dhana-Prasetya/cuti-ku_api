import { test } from "@japa/runner";
import prisma from "Config/prisma";

test.group("Database connection", () => {
    test("should connect to the database", async ({ assert }) => {
        const rows = await prisma.$queryRaw<
            Array<{ isconnected: number }>
        >`SELECT 1 as isconnected`;

        assert.equal(rows[0].isconnected, 1, "Database connection failed");
    });
});
