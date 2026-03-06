import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        this.app.container.singleton("App/UserRepository", () => {
            const {
                default: LucidUserRepository,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require("App/repositories/PrismaUserRepository");

            return new LucidUserRepository();
        });

        this.app.container.singleton("App/Repositories/CacheRepository", () => {
            const {
                default: RedisUserRepository,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require("App/repositories/RedisUserRepository");

            return new RedisUserRepository();
        });

        this.app.container.singleton("App/Services/JwtServicesContract", () => {
            const {
                default: JwtServices,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require("App/services/JwtServices");

            return new JwtServices();
        });

        this.app.container.singleton("App/Services/OAuthProvider", () => {
            const {
                default: GoogleOAuthProvider,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require("App/services/AllyGoogleOauthProvider");

            return new GoogleOAuthProvider();
        });

        this.app.container.singleton("App/Services/LoggerContract", () => {
            const {
                default: PinoLogger,
                // eslint-disable-next-line @typescript-eslint/no-var-requires
            } = require("App/services/PinoLogger");

            return new PinoLogger();
        });

        this.app.container.singleton(
            "App/Services/CloudinaryServicesContract",
            () => {
                const {
                    default: CloudinaryServices,
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                } = require("App/services/CloudinaryServices");

                return new CloudinaryServices();
            },
        );
    }

    public async boot() {
        // IoC container is ready
    }

    public async ready() {
        // App is ready
    }

    public async shutdown() {
        // Cleanup, since app is going down
    }
}
