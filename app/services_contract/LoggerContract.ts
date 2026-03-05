declare module "@ioc:App/Services/LoggerContract" {
    export interface LoggerContract {
        info(message: string, meta?: any): void;
        warn(message: string, meta?: any): void;
        error(message: string, meta?: any): void;
    }
    const loggerServices: LoggerContract;
    export default loggerServices;
}
