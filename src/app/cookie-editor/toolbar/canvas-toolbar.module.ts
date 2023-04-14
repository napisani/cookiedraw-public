import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanvasToolbarComponent} from './canvas-toolbar.component';
// import {ButtonModule, CardModule, CarouselModule, ConfirmDialogModule, DialogModule, SliderModule, ToolbarModule} from 'primeng';
import {ImageUploadModalModule} from './image-upload-modal/image-upload-modal.module';
import {FormsModule} from '@angular/forms';
import {TutorialModalComponent} from './tutorial-modal/tutorial-modal.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CarouselModule} from 'primeng/carousel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {SliderModule} from 'primeng/slider';
import {ToolbarModule} from 'primeng/toolbar';


@NgModule({
    declarations: [CanvasToolbarComponent, TutorialModalComponent],
    imports: [
        CommonModule,
        ToolbarModule,
        FormsModule,
        ButtonModule,
        ImageUploadModalModule,
        ConfirmDialogModule,
        DialogModule,
        CardModule,
        CarouselModule,
        SliderModule

    ],
    exports: [CanvasToolbarComponent]
})
export class CanvasToolbarModule {
}
