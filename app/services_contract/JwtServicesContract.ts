declare module "@ioc:App/Services/JwtServicesContract" {
    export interface JwtServicesContract {
        createToken(id: string, role: string): Record<string, string>; // return an object containing the accessToken and jti
        decodeToken(userToken: string): Record<string, any>;
        generateUniqueId(): string;
    }

    const jwtServices: JwtServicesContract;
    export default jwtServices;
}
