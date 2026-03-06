import type { UserRepository } from "@ioc:App/UserRepository"; // Import the UserRepository contract
import ErrorMapper from "App/helper/ErrorMapper";

import prisma from "Config/prisma";

export default class PrismaUserRepository implements UserRepository {
    public async registerAdmin(email: string, password: string) {
        try {
            const query = await prisma.users.create({
                data: {
                    email: email,
                    password: password,
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
                enabled: true,
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
                enabled: true,
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
            select: {
                id: true,
                start_date: true,
                end_date: true,
                attachment_url: true,
                status: true,
                rejection_reason: true,
                approved_by: true,
                created_at: true,
            },
        });

        return query;
    }

    public async getPaginatedLeaveList(
        page: number,
        limit: number,
        order: string,
    ) {
        const skip = (page - 1) * limit;

        let dataOrder: any;

        if (order === "oldest") {
            dataOrder = "asc";
        } else {
            dataOrder = "desc";
        }

        const query = await prisma.paid_leave.findMany({
            skip: skip,
            take: limit,
            orderBy: { created_at: dataOrder }, // Order by created_at in descending order to get the latest records first
        });

        return query;
    }

    public async countLeaveList() {
        const query = await prisma.paid_leave.count({});

        return query;
    }

    public async addLeaves(
        user_id: string,
        start_date: any,
        end_date: any,
        attachment_url: any,
        daysGap: number,
    ) {
        const year = new Date(start_date).getFullYear();

        try {
            const prismaTransaction = await prisma.$transaction(
                async (tx) => {
                    const insertLeave = await tx.paid_leave.create({
                        data: {
                            user_id: user_id,
                            start_date: start_date,
                            end_date: end_date,
                            attachment_url: attachment_url,
                        },
                    });

                    await tx.leave_balances.upsert({
                        // create or update
                        where: { user_id_year: { user_id, year } },
                        update: {
                            taken: { increment: daysGap },
                        },
                        create: {
                            user_id: user_id,
                            year: year,
                            taken: daysGap,
                        },
                    });

                    return insertLeave;
                },
                {
                    isolationLevel: "RepeatableRead", // Set the isolation level to prevent dirty reads and ensure data consistency during concurrent transactions
                    timeout: 8000,
                },
            );

            return prismaTransaction;
        } catch (error) {
            if (error.message.includes("exclude_overlapping_leave")) {
                throw new ErrorMapper(
                    "You already have a leave request that overlaps with the selected dates !",
                    400,
                    "EXCLUDE_OVERLAPPING_LEAVE",
                );
            }

            throw error;
        }
    }

    public async getDetailedLeave(id: number) {
        const query = await prisma.paid_leave.findUnique({
            where: { id: id },
        });

        return query;
    }

    public async deleteSelectedLeave(id: number, user_id: string) {
        const query = await prisma.paid_leave.delete({
            where: { id: id, user_id: user_id },
        });

        return query;
    }

    public async confirmLeaveStatus(id: number, status: any) {
        const query = await prisma.paid_leave.update({
            where: { id: id },
            data: { status: status },
        });
    }

    public async countUserList() {
        const query = await prisma.users.count({});
        return query;
    }

    public async getPaginatedUserList(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const query = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                enabled: true,
                created_at: true,
            },
            skip: skip,
            take: limit,
            orderBy: { created_at: "desc" }, // fetch latest records first
        });

        return query;
    }

    public async setUserAccountAccess(user_id: string, enableStatus: any) {
        const query = await prisma.users.update({
            where: { id: user_id },
            data: { enabled: enableStatus },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                enabled: true,
                created_at: true,
            },
        });
        return query;
    }
}
