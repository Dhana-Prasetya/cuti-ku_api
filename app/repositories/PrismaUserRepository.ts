import type { UserRepository } from "@ioc:App/UserRepository"; // Import the UserRepository contract
import ErrorMapper from "App/helper/ErrorMapper";
import { DateTime } from "luxon";

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
            select: { role: true, enabled: true },
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
            orderBy: { created_at: "desc" }, // Order by created_at in descending order to get the latest records first
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
        start_date_UTC: Date,
        end_date_UTC: Date,
        attachment_url: any,
        daysGap: number,
        year: number,
    ) {
        try {
            const prismaTransaction = await prisma.$transaction(
                async (tx) => {
                    const insertLeave = await tx.paid_leave.create({
                        data: {
                            user_id: user_id,
                            start_date: start_date_UTC,
                            end_date: end_date_UTC,
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

            const postgreCode = error?.cause?.code;

            if (postgreCode === "23514") {
                throw new ErrorMapper(
                    "Your paid leaves quota are lesser than the requested for the respective year!",
                    400,
                    "LEAVE_BALANCE_INSUFFICIENT",
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
        const prismaTransaction = await prisma.$transaction(async (tx) => {
            const dbData = await this.getDetailedLeave(id);

            if (!dbData) {
                throw new ErrorMapper("Selected leave not found", 404);
            }

            if (dbData.status !== "Pending") {
                throw new ErrorMapper(
                    "Only pending leaves can be deleted",
                    400,
                );
            }

            const attachment_url = dbData.attachment_url;

            const query = await prisma.paid_leave.delete({
                where: { id: id, user_id: user_id },
            });

            const gap = query.end_date.getTime() - query.start_date.getTime(); // subtratct to get the gap in milliseconds
            const daysGap: any = gap / (1000 * 60 * 60 * 24) + 1; // convert milliseconds into days, then add 1 to include both start and end date in the count
            const leave_year: any = query.start_date.getUTCFullYear();

            await tx.leave_balances.update({
                // Update the leave balance by decrementing the taken leaves (return to normal)
                where: {
                    user_id_year: {
                        user_id: query.user_id,
                        year: leave_year,
                    },
                },
                data: {
                    taken: { decrement: daysGap },
                },
            });

            return { query, attachment_url };
        });

        return prismaTransaction;
    }

    public async confirmLeaveStatus(
        id: number,
        status: any,
        user_id: string,
        rejection_reason: string,
    ) {
        const prismaTransaction = await prisma.$transaction(
            async (tx) => {
                const employee: any = await tx.paid_leave.findUnique({
                    where: { id: id },
                    select: {
                        status: true,
                    },
                });

                if (employee.status !== "Pending") {
                    throw new ErrorMapper(
                        "Only pending leave can be confirmed !",
                        403,
                    );
                }

                const query = await tx.paid_leave.update({
                    where: { id: id },
                    data: {
                        status: status,
                        rejection_reason: rejection_reason,
                        approved_by: user_id,
                    },
                    select: {
                        user_id: true,
                        start_date: true,
                        end_date: true,
                    },
                });

                if (status === "Rejected") {
                    const gap =
                        query.end_date.getTime() - query.start_date.getTime(); // subtratct to get the gap in milliseconds
                    const daysGap: any = gap / (1000 * 60 * 60 * 24) + 1; // convert milliseconds into days, then add 1 to include both start and end date in the count
                    const leave_year: any = query.start_date.getUTCFullYear();

                    await tx.leave_balances.update({
                        where: {
                            user_id_year: {
                                user_id: query.user_id,
                                year: leave_year,
                            },
                        },
                        data: {
                            taken: { decrement: daysGap },
                        },
                    });
                }
            },
            {
                isolationLevel: "Serializable", // Set the isolation level to prevent race condition
                timeout: 8000,
            },
        );
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
