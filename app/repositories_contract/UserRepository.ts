declare module "@ioc:App/UserRepository" {
    export interface UserRepository {
        registerAdmin(email: string, password: string): Promise<any>;
        registerEmployee(email: string): Promise<any>;
        login(email: string): Promise<any>;
        oauthLogin(email: string): Promise<any>;
        setPassword(id: string, hashedPassword: string): Promise<void>;
        oauthSetName(email: string, name: string): Promise<void>;
        isPasswordExist(id: string): Promise<any>;
        getUserRole(id: string): Promise<any>;
        registerOauthEmployee(email: string, name: string): Promise<any>;
        getMyLeaveList(user_id: string): Promise<any>;
        getPaginatedLeaveList(
            page: number,
            limit: number,
            order: string,
        ): Promise<any>;
        countLeaveList(): Promise<any>;
        addLeaves(
            user_id: string,
            start_date: any,
            end_date: any,
            attachment_url: any,
            daysGap: number,
        ): Promise<any>;
        getDetailedLeave(id: number): Promise<any>;
        deleteSelectedLeave(id: number, user_id: string): Promise<any>;
        confirmLeaveStatus(id: number, status: any): Promise<void>;
        countUserList(): Promise<any>;
        getPaginatedUserList(page: number, limit: number): Promise<any>;
        setUserAccountAccess(user_id: string, enableStatus: any): Promise<any>;
    }

    const userRepository: UserRepository;
    export default userRepository; // Export the instance of UserRepository
}
