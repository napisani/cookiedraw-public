import {Injectable} from '@angular/core';
import {LoggerService} from '../log/logger.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {SavedCanvasState} from './cookie-cutter.interface';
import {CookieCutter} from './cookie-cutter';

const STORAGE_KEY = 'CURRENT_CUTTER';

@Injectable({
    providedIn: 'root'
})
export class CookieCutterService {

    private currentCookieCutterSubject = new BehaviorSubject<CookieCutter>(
        this.deserialize(localStorage.getItem(STORAGE_KEY))
    );

    constructor(private log: LoggerService) {
        this.log = this.log.getSpecificLogger('CookieCutterService');

    }

    private serialize(c: CookieCutter): string {
        this.log.trace('serializing cutter', c);
        if (c) {
            return JSON.stringify(c);
        }
        return null;
    }

    private deserialize(s: string): CookieCutter {
        if (s) {
            const cutterRaw = JSON.parse(s);
            const cutter = CookieCutter.deserialize(cutterRaw);
            this.log.trace('cutterRaw', cutterRaw);
            this.log.trace('deserialized cutter', cutter);
            return cutter;
        }
        return null;
    }

    clearCurrentCookieCutter() {
        localStorage.removeItem(STORAGE_KEY);
        this.currentCookieCutterSubject.next(null);
    }

    setCurrentCookieCutter(c: CookieCutter) {
        localStorage.setItem(STORAGE_KEY, this.serialize(c));
        this.currentCookieCutterSubject.next(c);
    }

    getCurrentCookieCutterAsObservable(): Observable<CookieCutter> {
        return this.currentCookieCutterSubject.asObservable();
    }

    getCurrentCookieCutter(): CookieCutter {
        return this.currentCookieCutterSubject.getValue();
    }

    mergeCanvasWithCurrentCutter(canvasState: SavedCanvasState): CookieCutter {
        const cutter = this.getCurrentCookieCutter() || Object.assign(new CookieCutter());
        return Object.assign(cutter, {canvasState} as CookieCutter);
    }

}

export type GetCookieCuttersOrder = 'rating' | 'downloadCount' | 'createdAt';
