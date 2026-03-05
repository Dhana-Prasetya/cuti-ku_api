import type { UserRepository } from "@ioc:App/UserRepository"; // Import the UserRepository contract
import ErrorMapper from "App/helper/ErrorMapper";

import prisma from "Config/prisma";

export default class PrismaUserRepository implements UserRepository {
    public async registerAdmin(email: string) {
        try {
            const query = await prisma.users.create({
                data: {
                    email: email,
                    role: "admin",
                },
            });

            return query;
        } catch (error) {
            if (error.code === "P2002") {
                throw new ErrorMapper("Email already registered !", 409);
            }
            throw error;
        }
    }

    public async registerEmployee(email: string) {
        try {
            const query = await prisma.users.create({
                data: {
                    email: email,
                    role: "employee",
                },
            });

            return query;
        } catch (error) {
            if (error.code === "P2002") {
                throw new ErrorMapper("Email already registered !", 409);
            }
            throw error;
        }
    }

    public async login(email: string) {
        const query = await prisma.users.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                password: true,
                role: true,
            },
        });

        return query;
    }

    public async oauthLogin(email: string) {
        const query = await prisma.users.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        return query;
    }

    public async oauthSetName(email: string, name: string) {
        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                name: name,
            },
        });
    }

    public async setPassword(id: string, hashedPassword: string) {
        await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                password: hashedPassword,
            },
        });
    }

    public async isPasswordExist(id: string) {
        const query = await prisma.users.findUnique({
            where: { id: id },
            select: { password: true },
        });

        return query;
    }

    public async getUserRole(id: string) {
        const query = await prisma.users.findUnique({
            where: { id: id },
            select: { role: true },
        });

        return query;
    }

    public async registerOauthEmployee(email: string, name: string) {
        try {
            const query = await prisma.users.create({
                data: {
                    email: email,
                    name: name,
                    role: "employee",
                },
            });

            return query;
        } catch (error) {
            if (error.code === "P2002") {
                throw new ErrorMapper("Email already registered !", 409);
            }
            throw error;
        }
    }

    public async getMyLeaveList(user_id: string) {
        const query = await prisma.paid_leave.findMany({
            where: { user_id: user_id },
        });

        return query;
    }
}
