import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {

  timeoutInMiliseconds = 3000;
  timeoutId;
  active = false;
  activeSubject = new BehaviorSubject<boolean>(this.active);


  constructor() {
    this.setupTimers();
  }


  private resetTimer() {
    if (!this.active) {
      this.active = true;
      this.activeSubject.next(this.active);
    }
    window.clearTimeout(this.timeoutId);
    this.startTimer();

  }

  setupTimers() {
    document.addEventListener('mousemove', () => this.resetTimer(), false);
    document.addEventListener('mousedown', () => this.resetTimer(), false);
    document.addEventListener('keypress', () => this.resetTimer(), false);
    document.addEventListener('touchmove', () => this.resetTimer(), false);

    this.startTimer();
  }


  startTimer() {
    this.timeoutId = window.setTimeout(() => this.doInactive(), this.timeoutInMiliseconds);
  }

  doInactive() {
    if (this.active) {
      this.active = false;
      this.activeSubject.next(this.active);
    }
  }


  get userActiveObservable(): Observable<boolean> {
    return this.activeSubject.asObservable();
  }
}
