import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {environment} from '../../../environments/environment';
import {LoggerProperties} from './logger-config';

@Injectable({
    providedIn: 'root'
})
export class ConsoleLoggerService implements LoggerService {
    enableInfo: boolean;
    enableDebug: boolean;
    enableError: boolean;
    enableWarn: boolean;
    enableTrace: boolean;
    clsTag: string;
    noop = (): any => null;


    constructor() {
        this.initLogger(environment.loggerConfig.root);
    }

    getSpecificLogger(classTag: string): LoggerService {
        const logger = new ConsoleLoggerService();
        const rootProps = environment.loggerConfig.root;
        const specificProps = environment.loggerConfig.specific[classTag];
        logger.initLogger(rootProps, specificProps, classTag);
        return logger;
    }

    initLogger(rootProps: LoggerProperties, specificLoggerProperties?: LoggerProperties, classTag?: string) {
        this.clsTag = classTag || 'root';
        if (specificLoggerProperties) {
            this.enableError = specificLoggerProperties.enableError;
            this.enableDebug = specificLoggerProperties.enableDebug;
            this.enableWarn = specificLoggerProperties.enableWarn;
            this.enableInfo = specificLoggerProperties.enableInfo;
            this.enableTrace = specificLoggerProperties.enableTrace;
        } else {
            this.enableError = rootProps.enableError;
            this.enableDebug = rootProps.enableDebug;
            this.enableWarn = rootProps.enableWarn;
            this.enableInfo = rootProps.enableInfo;
            this.enableTrace = rootProps.enableTrace;
        }

    }

    get debug(): (...args: any[]) => void {
        if (this.enableDebug) {
            // noinspection TsLint
            return console.debug.bind(console);
        } else {
            return this.noop;
        }
    }


    get trace(): (...args: any[]) => void {
        if (this.enableTrace) {
            // noinspection TsLint
            return console.debug.bind(console);
        } else {
            return this.noop;
        }
    }


    get info(): (...args: any[]) => void {
        if (this.enableInfo) {
            // noinspection TsLint
            return console.info.bind(console);
        } else {
            return this.noop;
        }
    }

    get warn(): (...args: any[]) => void {
        if (this.enableWarn) {
            // noinspection TsLint
            return console.warn.bind(console);
        } else {
            return this.noop;
        }
    }

    get error(): (...args: any[]) => void {
        if (this.enableError) {
            // noinspection TsLint
            return console.error.bind(console);
        } else {
            return this.noop;
        }
    }

    //
    // invokeConsoleMethod(type: string, args?: any): void {
    //   const logFn: Function = (console)[type] || console.log || this.noop;
    //   logFn.apply(console, [args]);
    // }

}
