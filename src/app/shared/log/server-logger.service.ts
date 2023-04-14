import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {environment} from '../../../environments/environment';
import {LoggerProperties} from './logger-config';
import {HttpClient} from '@angular/common/http';

const API_BASE_URL = environment.apiUrl;


@Injectable({
    providedIn: 'root'
})
export class ServerLoggerService implements LoggerService {
    enableInfo: boolean;
    enableDebug: boolean;
    enableError: boolean;
    enableWarn: boolean;
    enableTrace: boolean;
    clsTag: string;
    noop = (): any => null;


    constructor(private http: HttpClient) {
        this.initLogger(environment.loggerConfig.root);
    }

    getSpecificLogger(classTag: string): LoggerService {
        const logger = new ServerLoggerService(this.http);
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

    private getLogFunction(level: string): (...args: any[]) => void {
        return (...args: any[]) => {
            const req = {
                level,
                logElements: args.map(arg => {
                    const cache = [];
                    return JSON.stringify(arg, (key: any, value: any) => {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // Duplicate reference found, discard key
                                return;
                            }
                            // Store value in our collection
                            cache.push(value);
                        }
                        return value;
                    });
                })
            };
            try {
                const sub = this.http.post<AppResponse<string>>(API_BASE_URL + '/api/logToConsole', req)
                    .subscribe(() => {
                        sub.unsubscribe();
                    });
            } catch (e) {
                // do nothing
                console.error('failed to log to /api/logToConsole', e);
            }

        };
    }


    get debug(): (...args: any[]) => void {
        if (this.enableDebug) {
            // noinspection TsLint
            return this.getLogFunction('DEBUG');
        } else {
            return this.noop;
        }
    }


    get trace(): (...args: any[]) => void {
        if (this.enableTrace) {
            // noinspection TsLint
            return this.getLogFunction('TRACE');
        } else {
            return this.noop;
        }
    }


    get info(): (...args: any[]) => void {
        if (this.enableInfo) {
            // noinspection TsLint
            return this.getLogFunction('INFO');
        } else {
            return this.noop;
        }
    }

    get warn(): (...args: any[]) => void {
        if (this.enableWarn) {
            // noinspection TsLint
            return this.getLogFunction('WARN');
        } else {
            return this.noop;
        }
    }

    get error(): (...args: any[]) => void {
        if (this.enableError) {
            // noinspection TsLint
            return this.getLogFunction('ERROR');
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
