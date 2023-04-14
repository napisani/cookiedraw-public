import {Injectable} from '@angular/core';

const STORAGE_KEY = 'cookie_app_splash_shown';

@Injectable({
  providedIn: 'root'
})
export class TutorialModalService {

  constructor() {
  }

  get showedTutorialAlready(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  markShown() {
    localStorage.setItem(STORAGE_KEY, 'true');
  }
}
