import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../shared/services/common.service';
import { Employee } from '../../shared/interfaces/employee';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MatSnackBar ]
})
export class DashboardComponent implements OnInit {

  public employeesList: Employee[] = [];
  public editableList: string[] = [];
  public isCreating = false;
  private newItemsIdIndex = 1;
  public searchKeyWord = '';
  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private commonService: CommonService,
    private snackBar: MatSnackBar
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

  private showMessage(message: string) {
    this.snackBar.open(message, 'Done!', {
      duration: 2000,
    });
  }

  public fetchFilteredList(): Employee[] {
    const temporaryArray = [...this.employeesList];
    if (this.searchKeyWord) {
      return temporaryArray.filter((e: Employee) => e.name.toLocaleLowerCase().includes(this.searchKeyWord));
    } else {
      return temporaryArray;
    }
  }

  public addNewEmployee(): void {
    const newEmployee: Employee = {
        name: null,
        gender: 'm',
        contactInfo: {
        address: {
          city: null,
          street: null,
          houseN: null,
          addN: null
        },
        email: null,
        },
      addDate: new Date(),
      salary: null,
      position: null,
      _id: this.newItemsIdIndex.toString()
    };
    this.editableList.push(this.newItemsIdIndex.toString());
    this.isCreating = true;
    this.employeesList.unshift(newEmployee);
  }

  public parseDate(date: Date): string {
    return this.commonService.dateToMoment(date);
  }

  public toEditList(id: string): void {
    if (!this.editableList.includes(id)) {
      this.editableList.push(id);
    }
  }

  public onGenderClick(employee: Employee): void {
    if (this.checkEditListById(employee._id)) {
      employee.gender === 'm' ? employee.gender = 'f' : employee.gender = 'm';
    } else {
      return;
    }
  }

  public deleteEmployee(id: string): void {
    this.apiService.deleteEmployee(id).subscribe((r: boolean) => {
      if (r) {
        this.commonService.changeLoaderVisibility(false);
        this.updateEmployeesList();
        this.showMessage('Deleted successfully!');
      }
    });
  }

  public toAction(employee: Employee, type: string): void {
    switch (this.editableList.includes(employee._id)) {
      case true:
        switch (type) {
          case 'edit':
            if (employee._id === this.newItemsIdIndex.toString()) {
              delete employee._id;
              this.apiService.createEmployee(employee).subscribe((e: boolean) => {
                if (e) {
                  this.updateEmployeesList();
                  this.showMessage('Created successfully!');
                }
              });
            } else {
              this.apiService.updateEmployee(employee).subscribe((e: boolean) => {
                if (e) {
                  const i = this.editableList.indexOf(employee._id);
                  this.editableList.splice(i, 1);
                  this.updateEmployeesList();
                  this.showMessage('Updated successfully!');
                }
              });
            }
            break;
          case 'delete':
            const index = this.editableList.indexOf(employee._id);
            this.editableList.splice(index, 1);
            if (employee._id === this.newItemsIdIndex.toString()) {
              this.employeesList.shift();
              this.isCreating = false;
            }
            break;
        }
        break;
      case false:
        switch (type) {
          case 'edit':
            this.toEditList(employee._id);
            break;
          case 'delete':
            this.deleteEmployee(employee._id);
            break;
        }
        break;
    }
  }

  public checkEditListById(id: string): boolean {
    return this.editableList.includes(id);
  }
}
