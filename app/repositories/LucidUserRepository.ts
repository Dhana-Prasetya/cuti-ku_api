import User from "App/Models/Users";
import PaidLeave from "App/Models/PaidLeave";
import LeaveBalance from "App/Models/LeaveBalances";
import type { UserRepository } from "@ioc:App/UserRepository"; // Import the UserRepository contract

export default class LucidUserRepository implements UserRepository {
    public async registerAdmin(email: string) {
        const query = await User.create({
            email: email,
            role: "admin",
        });

        return query;
    }

    public async registerUser(email: string) {
        const query = await User.create({
            email: email,
            role: "user",
        });

        return query;
    }

    public async login(email: string) {
        const query = await User.query()
            .select("password")
            .where("email", email)
            .firstOrFail();

        return query;
    }

    public async setPassword(password: string) {
        await User.create({
            email: password,
        });
    }
}
