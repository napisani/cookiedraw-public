import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loading = false;

  constructor(private loadingService: LoadingService,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadingService.isLoading().subscribe((isLoading) => {
      // console.log('isLoading changed!!!' + isLoading);
      this.loading = isLoading;
      this.cdRef.detectChanges();
    });
  }


}
