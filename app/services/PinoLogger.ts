import Logger from "@ioc:Adonis/Core/Logger";
import { LoggerContract } from "@ioc:App/Services/LoggerContract";
export default class PinoLogger implements LoggerContract {
    public info = (message: string, meta?: any) => {
        Logger.info(meta, message);
    };

    public warn = (message: string, meta?: any) => {
        Logger.warn(meta, message);
    };

    public error = (message: string, meta?: any) => {
        Logger.error(meta, message);
    };
}
