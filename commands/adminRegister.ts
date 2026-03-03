import { BaseCommand } from "@adonisjs/core/build/standalone";
import type { LucidRepositoryContract } from "@ioc:App/Repositories/LucidRepositoryContract";

export default class AdminRegister extends BaseCommand {
    public static commandName = "admin:register";
    public static description = "Register admin user by email";

    public static settings = {
        loadApp: true,
        stayAlive: false,
    };

    public async run() {
        const email = (await this.prompt.ask("Enter valid admin email:"))
            .trim()
            .toLowerCase();

        if (!email) {
            this.logger.error("Email is required. Program exiting...");
            return;
        }

        if (email.length > 255) {
            this.logger.error(
                "Email cannot be longer than 255 characters. Program exiting...",
            );
            return;
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            this.logger.error(
                "Please provide a valid email address. Program exiting...",
            );
            return;
        }

        const lucidRepository =
            await this.application.container.make<LucidRepositoryContract>(
                "App/Repositories/LucidRepository",
            );

        await lucidRepository.registerAdmin(email);
        this.logger.success(`Admin registered successfully: ${email}`);
    }
}
