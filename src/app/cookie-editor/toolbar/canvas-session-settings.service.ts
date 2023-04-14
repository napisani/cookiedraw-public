import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CanvasSessionSettings} from './canvas-session-settings';

@Injectable()
export class CanvasSessionSettingsService {

  settingsSubject = new BehaviorSubject<CanvasSessionSettings>(new CanvasSessionSettings());

  constructor() {
  }

  changeImageAlpha(newAlpha: number) {
    const settings = this.settingsSubject.value;
    settings.imageAlpha = newAlpha;
    this.settingsSubject.next(settings);
  }

  getSettingsAsObservable(): Observable<CanvasSessionSettings> {
    return this.settingsSubject.asObservable();
  }
}
