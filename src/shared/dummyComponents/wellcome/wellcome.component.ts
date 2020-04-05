import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../services/common.service";

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss']
})
export class WellcomeComponent implements OnInit {

  constructor(
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.commonService.changeLoaderVisibility(false);
  }

}
