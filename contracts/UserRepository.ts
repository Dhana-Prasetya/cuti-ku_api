declare module "@ioc:App/UserRepository" {
    export interface UserRepository {
        registerAdmin(email: string): Promise<any>;
        registerUser(email: string): Promise<any>;
        login(email: string): Promise<any>;
        setPassword(password: string): Promise<void>;
    }

    const userRepository: UserRepository;
    export default userRepository; // Export the instance of UserRepository
}
