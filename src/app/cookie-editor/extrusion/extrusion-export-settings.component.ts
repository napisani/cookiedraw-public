import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThreeEngineService} from './three-engine.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DEFAULT_THREE_D_SETTINGS, ThreeDSettings} from './three-d-settings';
import {CookieCutterService} from '../../shared/cookie-cutter/cookie-cutter.service';
import {CookieCutter} from '../../shared/cookie-cutter/cookie-cutter';
import * as FileSaver from 'file-saver/dist/FileSaver.js';
import {AlertMessageService} from '../../shared/alert-message.service';


export const INCHES_TO_MM = 25.4;


function validateFloat(c: FormControl) {
    const float = parseFloat(c.value);
    if (!float || float < 0.001) {
        return {valid: false};
    }
    return null;
}

@Component({
    selector: 'app-extrusion-export-settings',
    templateUrl: './extrusion-export-settings.component.html',
    styleUrls: ['./extrusion-export-settings.component.scss']
})
export class ExtrusionExportSettingsComponent implements OnInit {
    @Input() cookieCutter: CookieCutter;


    @Output()
    download = new EventEmitter<void>();

    @Output()
    addedToCart = new EventEmitter<void>();

    fg: FormGroup;

    sizesSTD = [
        {label: '2.5 (Small)', value: 2.5},
        {label: '3.5 (Medium)', value: 3.5},
        {label: '4', value: 4},
        {label: '4.5', value: 4.5},
        {label: '4.75', value: 4.75},
        {label: '5 (Large)', value: 5},
        {label: '5.25', value: 5.25},
        {label: '5.5', value: 5.5},
        {label: '6', value: 6},
        {label: '6.5', value: 6.5},
        {label: '7', value: 7},

    ];


    heightsSTD = [
        {label: '0.5 (Short)', value: 0.5},
        {label: '0.7 (Medium)', value: 0.7},
        {label: '1 (Tall)', value: 1.0},
    ];

    thicknessesMM = [
        {label: '1 (Really Thin)', value: 1},
        {label: '1.5 (Thin)', value: 1.5},
        {label: '2 (Standard)', value: 2},
        {label: '3 (Thick)', value: 3},
    ];


    constructor(public engServ: ThreeEngineService,
                private cookieCutterService: CookieCutterService,
                private alertMessageService: AlertMessageService) {
    }

    ngOnInit(): void {
        this.fg = new FormGroup({
            size: new FormControl(3.5, [Validators.required, validateFloat]),
            height: new FormControl(0.7, [Validators.required, validateFloat]),
            thickness: new FormControl(2, [Validators.required, validateFloat])
        });
        this.fg.valueChanges.subscribe(() => {
            if (this.fg.valid) {
                this.engServ.threeDSettings = this.buildThreeDSettings();
            }
        });
    }


    handleExport() {
        if (this.cookieCutter && this.cookieCutter.cutterId && this.cookieCutter.cutterId !== 0) {
        } else {
            const stashedCutter = this.cookieCutterService.getCurrentCookieCutter();
            if (stashedCutter && stashedCutter.cutterId && stashedCutter.cutterId !== 0) {
            } else {
                const stl = this.engServ.exportToSTL(this.buildThreeDSettings());
                if (stl) {
                    FileSaver.saveAs(stl.blob, stl.name);
                    this.download.emit();
                }
            }
        }
    }


    buildThreeDSettings(): ThreeDSettings {
        const settings: ThreeDSettings = Object.assign({}, DEFAULT_THREE_D_SETTINGS);
        settings.desiredSizeMM = INCHES_TO_MM * parseFloat(this.fg.controls.size.value);
        settings.heightMM = INCHES_TO_MM * parseFloat(this.fg.controls.height.value);
        settings.wallThicknessMM = parseFloat(this.fg.controls.thickness.value);
        return settings;
    }

    enableExport() {
        return this.engServ.canExportToSTL() && this.fg.valid && !this.enableRender();
    }

    enableRender() {
        return this.engServ.pendingRenderUpdates && this.fg.valid;
    }

    handleRender() {
        this.engServ.render3DCutter();

    }

}
