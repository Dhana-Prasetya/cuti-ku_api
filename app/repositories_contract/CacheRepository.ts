declare module "@ioc:App/Repositories/CacheRepository" {
    export interface CacheRepository {
        save(key: string, value: any, ttl: number): Promise<void>;
        get(key: string): Promise<any>;
        delete(key: string);
    }

    const cacheRepository: CacheRepository;
    export default cacheRepository;
}
