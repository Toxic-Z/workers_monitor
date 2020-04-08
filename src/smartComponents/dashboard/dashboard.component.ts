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
  public editableList: string[] = [];

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

  public toEditList(id: string): void {
    if (!this.editableList.includes(id)) {
      this.editableList.push(id);
    }
  }

  public deleteEmployee(id: string): void {
    this.apiService.deleteEmployee(id).subscribe((r: boolean) => {
    });
  }

  public toAction(id: string, type: string): void {
    switch (this.editableList.includes(id)) {
      case true:
        switch (type) {
          case 'edit':
            break;
          case 'delete':
            const index = this.editableList.findIndex((i: string) => i === id);
            this.editableList.splice(index, 1);
            break;
        }
        break;
      case false:
        switch (type) {
          case 'edit':
            this.toEditList(id);
            break;
          case 'delete':
            this.deleteEmployee(id);
            break;
        }
        break;

    }
  }

  public checkEditListById(id: string): boolean {
    return this.editableList.includes(id);
  }
}
