import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { ApiService } from "../../shared/services/api.service";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    console.log('12412412412412')
    this.apiService.fetchEmployees().subscribe(r => {
      this.commonService.changeLoaderVisibility(false);
      console.log(r)
    })
  }

  ngOnInit(): void {
  }

}
