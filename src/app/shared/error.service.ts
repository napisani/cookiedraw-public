import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {LoggerService} from './log/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private readonly loggerService: LoggerService) {
    this.loggerService = this.loggerService.getSpecificLogger('ErrorService');
  }

  getClientMessage(error: Error): string {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }
    return error.message ? error.message : JSON.stringify(error);
  }

  getClientStack(error: Error): string {
    return error.stack;
  }

  getServerMessage(error: HttpErrorResponse): string {
    // if (error.error && error.error.hasOwnProperty('errorMessages')) {
    //   return (error.error as APIError).errorMessages.join('\n');
    // }
    return '';
  }

  getServerStack(error: HttpErrorResponse): string {
    // handle stack trace
    return 'stack';
  }
}
