import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import Env from "@ioc:Adonis/Core/Env";
import type { JwtRepositoryContract } from "@ioc:App/Repositories/JwtRepositoryContract";

export default class JwtRepository implements JwtRepositoryContract {
    public createToken = (id: string, role: string) => {
        const jti = randomUUID();

        const payload = {
            id: id,
            role: role,
            jti,
        };

        const verifyOpts = {
            // Standard syntax from jwt dependency
            expiresIn: "15m",
            issuer: "cuti-ku_api",
        };

        const accessToken = jwt.sign(payload, Env.get("secretKey"), verifyOpts);
        return { accessToken, jti };
    };

    public decodeToken = (userToken: string) => {
        const decoded = jwt.verify(userToken, Env.get("secretKey"));
        return decoded;
    };
}
