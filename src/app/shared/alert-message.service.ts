import { Injectable } from '@angular/core';
import { LoggerService } from './log/logger.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService {

  private currentTimeout;

  constructor(private log: LoggerService,
              private messageService: MessageService
              // private readonly toastController: ToastController
  ) {
    this.log = this.log.getSpecificLogger('AlertMessageService');
  }

  async addErrorMessage(errorTxt?: string, details?: string) {
    this.messageService.clear();
    this.messageService.add({ life: 15, severity: 'error', summary: errorTxt, detail: details });
    window.scroll(0, 0);

    this.startTimer();


  }

  async addSuccessMessage(message?: string, details?: string) {
    this.messageService.clear();
    this.messageService.add({ life: 15, severity: 'success', summary: message, detail: details });
    window.scroll(0, 0);

    this.startTimer();
  }

  async addInfoMessage(message?: string, details?: string) {
    this.messageService.clear();
    this.messageService.add({ life: 15, severity: 'info', summary: message, detail: details });
    window.scroll(0, 0);

    this.startTimer();
  }

  private startTimer() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    this.currentTimeout = setTimeout(() => {
      this.messageService.clear();
    }, 5000);
  }

}
