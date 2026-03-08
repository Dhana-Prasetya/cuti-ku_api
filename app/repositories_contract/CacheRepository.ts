declare module "@ioc:App/Repositories/CacheRepository" {
    export interface CacheRepository {
        saveRefreshToken(key: string, value: any, ttl: number): Promise<void>;
        getRefreshToken(key: string): Promise<any>;
        deleteRefreshToken(key: string): Promise<void>;
        revokeSession(key: string, ttl: number): Promise<void>;
        getRevokedToken(key: string): Promise<any>;
        getRateLimit(key: string): Promise<any>;
        setRateLimit(key: string, ttl: number): Promise<void>;
    }

    const cacheRepository: CacheRepository;
    export default cacheRepository;
}
