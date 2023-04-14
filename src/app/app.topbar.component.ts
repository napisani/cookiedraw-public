import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';
import {Router} from '@angular/router';
import {LoggerService} from './shared/log/logger.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styles: [`
    .title-text {
      color: white;
      font-size: 40px;
      font-weight: bold;
      font-family: Courier;
      padding: 10px;
      vertical-align: top;
    }

    @media screen and (min-width: 0px) and (max-width: 400px) {
      .title-text {
        display: none;
      }

      /* show it on small screens */
    }

    @media screen and (min-width: 401px) and (max-width: 1024px) {
      .title-text {
        display: inline;
      }

      /* hide it elsewhere */
    }
  `]
})
export class AppTopBarComponent implements OnInit {


  constructor(public app: AppComponent,
              private router: Router,
              private log: LoggerService) {
    this.log = log.getSpecificLogger('NavbarComponent');
  }

  ngOnInit(): void {

  }


  handleLoggout() {

  }
}
