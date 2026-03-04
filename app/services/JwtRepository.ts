import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import Env from "@ioc:Adonis/Core/Env";
import type { JwtServicesContract } from "@ioc:App/Services/JwtServicesContract";

export default class JwtRepository implements JwtServicesContract {
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
            issuer: Env.get("JWT_ISSUER"),
        };

        const accessToken = jwt.sign(
            payload,
            Env.get("SECRET_KEY"),
            verifyOpts,
        );
        return { accessToken, jti };
    };

    public decodeToken = (userToken: string) => {
        const decoded = jwt.verify(userToken, Env.get("SECRET_KEY"));
        return decoded;
    };
}
