import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoggerService} from '../log/logger.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private statusMap = new Map<string, boolean>();

  constructor(private loggerService: LoggerService) {
    this.loggerService = this.loggerService.getSpecificLogger('LoadingService');
  }

  startLoading(apiPath: string): void {
    this.loggerService.trace('startLoading apiPath: ' + apiPath);
    this.statusMap.set(apiPath, true);
    this.loading.next(true);
  }

  endLoading(apiPath: string): void {
    this.loggerService.trace('endLoading end apiPath: ' + apiPath);

    this.statusMap.set(apiPath, false);
    let finalLoadingStatus = false;
    this.statusMap.forEach((value: boolean, key: string) => {
      finalLoadingStatus = finalLoadingStatus || value;
    });
    this.loading.next(finalLoadingStatus);
  }

  isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
