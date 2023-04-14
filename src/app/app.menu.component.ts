import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import {Router} from '@angular/router';
import {LoggerService} from './shared/log/logger.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[];


    constructor(public app: AppComponent, private router: Router,
                private log: LoggerService) {
        this.log = log.getSpecificLogger('AppMenuComponent');
    }

    ngOnInit() {
        this.model = [
            {label: 'Draw', icon: 'fas fa-pencil-alt', routerLink: ['/']},
            // {label: 'About', icon: 'fas fa-info', routerLink: ['/about']}
        ];
    }

    onMenuClick(event) {
        if (!this.app.isHorizontal()) {
        }
        this.app.onMenuClick(event);
    }
}
