declare module "@ioc:App/UserRepository" {
    export interface UserRepository {
        registerAdmin(email: string): Promise<any>;
        registerUser(email: string): Promise<any>;
        login(email: string): Promise<any>;
        oauthLogin(email: string): Promise<any>;
        setPassword(id: string, hashedPassword: string): Promise<void>;
        oauthSetName(email: string, name: string): Promise<void>;
        isPasswordExist(id: string): Promise<any>;
    }

    const userRepository: UserRepository;
    export default userRepository; // Export the instance of UserRepository
}
