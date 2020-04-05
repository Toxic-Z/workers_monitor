import { Component } from '@angular/core';
import { CommonService } from "../shared/services/common.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Monitor';
  public showLoader: boolean = false;
  constructor(
    private commonService: CommonService
  ) {
    this.commonService.checkLoaderState().subscribe((state: boolean) => {
      if (state !== null) {
        this.showLoader = state;
      }
    });
  }
  // public checkLoader(): boolean {
  //   this.commonService.checkLoaderState().subscribe((state: boolean) => {
  //     if (state !== null) {
  //       this.showLoader = state;
  //     }
  //   });
  // }
}
