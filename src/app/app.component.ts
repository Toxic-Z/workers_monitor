import { Component } from '@angular/core';
import { CommonService } from "../shared/services/common.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Monitor';
  public showLoader: boolean = true;
  constructor(
    private commonService: CommonService
  ) {
    this.commonService.checkLoaderState().subscribe((state: boolean) => {
      if (state !== null) {
        this.showLoader = state;
      }
    });
  }
}
