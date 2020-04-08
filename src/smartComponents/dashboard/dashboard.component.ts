import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {ApiService} from '../../shared/services/api.service';
import {CommonService} from '../../shared/services/common.service';
import {Employee} from '../../shared/interfaces/employee';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  public employeesList: Employee[] = [];

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {
    this.updateEmployeesList();
  }

  ngOnInit(): void {
  }

  private updateEmployeesList(): void {
    this.apiService.fetchEmployees().subscribe((employees: Employee[]) => {
      this.commonService.changeLoaderVisibility(false);
      this.employeesList = employees ? employees : [];
    });
  }

  public parseDate(date: Date): string {
    return this.commonService.dateToMoment(date);
  }
}
