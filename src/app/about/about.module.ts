import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrivacyPolicyModule} from './privacy-policy/privacy-policy.module';
import {AboutComponent} from './about/about.component';
import {AccordionModule} from 'primeng/accordion';
import {TermsOfServiceModule} from './terms-of-service/terms-of-service.module';


@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    PrivacyPolicyModule,
    TermsOfServiceModule,
    AccordionModule
  ],
  exports: [AboutComponent]
})
export class AboutModule {
}
