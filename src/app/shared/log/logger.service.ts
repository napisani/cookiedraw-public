import {Injectable} from '@angular/core';

@Injectable()
export abstract class LoggerService {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    trace: (...args: any[]) => void;

    public abstract getSpecificLogger(classTag: string): LoggerService;
}

