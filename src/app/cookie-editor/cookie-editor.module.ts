import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CookieEditorComponent} from './cookie-editor.component';
import {CanvasModule} from './canvas/canvas.module';
import {ExtrusionModule} from './extrusion/extrusion.module';
import {SharedModule} from '../shared/shared.module';
import {CanvasToolbarModule} from './toolbar/canvas-toolbar.module';
import {RouterModule} from '@angular/router';
import {CanvasSessionSettingsService} from './toolbar/canvas-session-settings.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    declarations: [CookieEditorComponent],
    imports: [
        CommonModule,
        CanvasModule,
        ExtrusionModule,
        SharedModule,
        CanvasToolbarModule,
        RouterModule,
        ConfirmDialogModule
    ],
    providers: [CanvasSessionSettingsService],
    exports: [CookieEditorComponent]
})
export class CookieEditorModule {
}
