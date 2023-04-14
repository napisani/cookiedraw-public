import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExtrusionPreviewComponent} from './extrusion-preview.component';
import {SharedModule} from '../../shared/shared.module';
import {ExtrusionExportSettingsComponent} from './extrusion-export-settings.component';
// import {
//   ButtonModule,
//   CardModule,
//   CheckboxModule,
//   DialogModule,
//   DropdownModule,
//   InputSwitchModule,
//   RadioButtonModule,
//   TooltipModule
// } from 'primeng';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TooltipModule} from 'primeng/tooltip';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ExtrusionPreviewComponent, ExtrusionExportSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioButtonModule,
    FormsModule,
    SharedModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    InputSwitchModule,
    TooltipModule
  ],
  exports: [ExtrusionPreviewComponent]
})
export class ExtrusionModule {
}
