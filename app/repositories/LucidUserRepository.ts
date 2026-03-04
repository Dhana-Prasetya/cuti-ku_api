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
            .first();

        return query;
    }

    public async oauthLogin(email: string) {
        const query = await User.query()
            .where("email", email)
            .select(["id", "email", "name", "role"])
            .first();
        return query;
    }

    public async oauthSetName(email: string, name: string) {
        const query = await User.query().where("email", email).update({
            name,
        });
    }

    public async setPassword(id: string, hashedPassword: string) {
        await User.query().where("id", id).update({
            password: hashedPassword,
        });
    }

    public async isPasswordExist(id: string) {
        const query = await User.query()
            .select("password")
            .where("id", id)
            .first();

        return query;
    }
}
