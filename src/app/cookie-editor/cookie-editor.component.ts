import {Component, OnDestroy, OnInit} from '@angular/core';
import {CanvasConstants} from '../shared/canvas-constants';
import {ActivatedRoute} from '@angular/router';
import {LoggerService} from '../shared/log/logger.service';
import {DrawingCanvasStateService} from './state/drawing-canvas-state.service';
import {CookieCutterService} from '../shared/cookie-cutter/cookie-cutter.service';
import {ThreeEngineService} from './extrusion/three-engine.service';

@Component({
    selector: 'app-cookie-editor',
    templateUrl: './cookie-editor.component.html',
    styleUrls: ['./cookie-editor.component.scss'],
    providers: [ThreeEngineService]
})
export class CookieEditorComponent implements OnInit, OnDestroy {

    canvasConsts = CanvasConstants;
    continueAdd = false;
    loaded = false;

    constructor(private cookieCutterService: CookieCutterService,
                private canvasStateService: DrawingCanvasStateService,
                private activeRoute: ActivatedRoute,
                private threeEngineService: ThreeEngineService,
                private logger: LoggerService) {
        this.logger = this.logger.getSpecificLogger('CookieEditorComponent');
    }

    ngOnInit() {
        const continueAdd = this.activeRoute.snapshot.params.continueAdd;
        if (continueAdd) {
            this.continueAdd = continueAdd;
        }
        this.loaded = true;
    }

    ngOnDestroy(): void {
        this.threeEngineService.ngOnDestroy();
    }
}
