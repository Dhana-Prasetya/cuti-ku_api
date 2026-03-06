import { BaseCommand } from "@adonisjs/core/build/standalone";
import Hash from "@ioc:Adonis/Core/Hash";
import type { UserRepository } from "@ioc:App/UserRepository";

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

        const password = await this.prompt.ask("Enter admin password:");

        const hashedPassword = await Hash.make(password);

        const userRepository = this.application.container.use(
            "App/UserRepository",
        ) as UserRepository;

        await userRepository.registerAdmin(email, hashedPassword);
        this.logger.success(`Admin registered successfully: ${email}`);
    }
}
