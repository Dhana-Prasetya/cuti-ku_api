// config/database.ts
import Env from "@ioc:Adonis/Core/Env";
import { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const dbConfig: DatabaseConfig = {
    connection: Env.get("DB_CONNECTION", "pg"),

    connections: {
        pg: {
            client: "pg",
            connection: {
                host: Env.get("PG_HOST"),
                port: Env.get("PG_PORT"),
                user: Env.get("PG_USER"),
                password: Env.get("PG_PASSWORD"),
                database: Env.get("PG_DB_NAME"),
            },
            migrations: {
                naturalSort: true,
            },
            healthCheck: false,
            debug: false,
        },
    },
};

export default dbConfig;
