import Env from "@ioc:Adonis/Core/Env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = Env.get("DATABASE_URL");

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

export default prisma;
