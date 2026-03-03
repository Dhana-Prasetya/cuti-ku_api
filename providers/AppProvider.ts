import type { ApplicationContract } from "@ioc:Adonis/Core/Application";

export default class AppProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        this.app.container.singleton("App/Repositories/LucidRepository", () => {
            const {
                default: LucidRepository,
            } = require("App/repositories/LucidRepository");
            return new LucidRepository();
        });
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
