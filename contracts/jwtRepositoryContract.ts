declare module "@ioc:App/Repositories/JwtRepositoryContract" {
    export type CreateTokenResult = {
        accessToken: string;
        jti: string;
    };

    export interface JwtRepositoryContract {
        createToken(id: string, role: string): CreateTokenResult;
        decodeToken(userToken: string): string | Record<string, any>; // return jwt decoded payload, which can be a string or an object depending on the token structure
    }

    const jwtToken: JwtRepositoryContract;
    export default jwtToken;
}
