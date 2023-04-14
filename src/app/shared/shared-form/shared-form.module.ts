import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormErrorComponent} from './form-error/form-error.component';
import {FormFieldErrorComponent} from './form-error-field/form-field-error.component';
import {PhoneMaskDirective} from './phone-mask.directive';


@NgModule({
  declarations: [FormErrorComponent, PhoneMaskDirective, FormFieldErrorComponent],
  imports: [
    CommonModule
  ],
  exports: [FormErrorComponent, FormFieldErrorComponent, PhoneMaskDirective]
})
export class SharedFormModule {
}
