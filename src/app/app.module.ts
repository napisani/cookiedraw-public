import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CookieEditorModule} from './cookie-editor/cookie-editor.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MessageModule} from 'primeng/message';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {LoggerService} from './shared/log/logger.service';
import {ConsoleLoggerService} from './shared/log/console-logger.service';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {AppFooterComponent} from './app.footer.component';
import {AppTopBarComponent} from './app.topbar.component';
import {LoadingModule} from './shared/loading/loading.module';
import {Angulartics2Module} from 'angulartics2';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
@NgModule({
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppFooterComponent,
        AppTopBarComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        CookieEditorModule,
        BrowserAnimationsModule,
        CoreModule,
        MessageModule,
        MessagesModule,
        LoadingModule,
        Angulartics2Module.forRoot()
    ],
    providers: [
        ConfirmationService, {
            provide: LoggerService,
            // useClass: ServerLoggerService
            useClass: ConsoleLoggerService
        },

        MessageService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
