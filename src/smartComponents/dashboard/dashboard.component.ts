import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../shared/services/common.service';
import { Employee } from '../../shared/interfaces/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MatSnackBar ]
})
export class DashboardComponent implements OnInit {

  public employeeForms: {form: FormGroup, id: string}[] = [];
  public employeesList: Employee[] = [];
  public editableList: string[] = [];
  public isCreating = false;
  private newItemsIdIndex = 1;
  private initialStateOfEmployees: Employee[] = [];
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
      this.employeesList.forEach((e: Employee) => {
        this.employeeForms.push(
          {
            form: this.initForm(e),
            id: e._id
          }
        );
      });
    });
  }

  private initForm(employee: Employee): FormGroup {
    return new FormGroup({
      name: new FormControl({
        value: employee.name,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)]),
      gender: new FormControl({
        value: employee.gender,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1)]),
      addDate: new FormControl({
        value: employee.addDate,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required]),
      salary: new FormControl({
        value: employee.salary,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.min(500),
        Validators.max(5000000)]),
      position: new FormControl({
        value: employee.position,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15)]),
      city: new FormControl({
        value: employee.contactInfo.address.city,
        disabled: !this.checkEditListById(employee._id)},
        [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)]),
      street: new FormControl({
        value: employee.contactInfo.address.street,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20)]),
      addN: new FormControl({
        value: employee.contactInfo.address.addN,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.maxLength(3)]),
      email: new FormControl({
        value: employee.contactInfo.email,
        disabled: !this.checkEditListById(employee._id)},
        [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.maxLength(30)]),
      houseN: new FormControl({
        value: employee.contactInfo.address.houseN,
        disabled: !this.checkEditListById(employee._id)
      },
        [
        Validators.required,
        Validators.min(1),
        Validators.max(9999)])
    });
  }

  public findForm(id: string): FormGroup {
    return this.employeeForms.filter((i: {form: FormGroup, id: string}) => i.id === id)[0].form;
  }

  private showMessage(message: string): void {
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
    this.employeesList.unshift({...newEmployee});
    this.employeeForms.push(
      {
        form: this.initForm({...newEmployee}),
        id: newEmployee._id
      }
    );
  }

  public parseDate(date: Date): string {
    return this.commonService.dateToMoment(date);
  }

  public toEditList(employee: Employee): void {
    if (!this.editableList.includes(employee._id)) {
      this.editableList.push(employee._id);
      this.initialStateOfEmployees.push(employee);
      const index = this.employeeForms.findIndex((i: {form: FormGroup, id: string}) => i.id === employee._id);
      if (!this.isCreating) {
        for (const control in this.employeeForms[index].form.controls) {
          this.employeeForms[index].form.get(`${control}`).enable();
        }
      }
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
            if (employee._id === this.newItemsIdIndex.toString() && this.findForm(employee._id).valid) {
              const form = this.findForm(employee._id).value;
              delete form._id;
              const value: Employee = {
                name: form.name,
                position: form.position,
                salary: form.salary,
                gender: form.gender,
                addDate: form.addDate,
                contactInfo: {
                  email: form.email,
                  address: {
                    city: form.city,
                    addN: form.addN,
                    street: form.street,
                    houseN: form.houseN
                  }
                }
              };
              this.apiService.createEmployee(value).subscribe((e: boolean) => {
                if (e) {
                  this.updateEmployeesList();
                  this.newItemsIdIndex ++;
                  this.isCreating = false;
                  const ind = this.employeeForms.findIndex((i: {form: FormGroup, id: string}) => i.id === employee._id);
                  for (const control in this.employeeForms[ind].form.controls) {
                    this.employeeForms[ind].form.get(`${control}`).disable();
                  }
                  this.showMessage('Created successfully!');
                }
              });
            } else if (this.findForm(employee._id).valid) {
              this.apiService.updateEmployee(employee).subscribe((e: boolean) => {
                if (e) {
                  const i = this.editableList.indexOf(employee._id);
                  this.editableList.splice(i, 1);
                  const ind = this.employeeForms.findIndex((i: {form: FormGroup, id: string}) => i.id === employee._id);
                  for (const control in this.employeeForms[ind].form.controls) {
                    this.employeeForms[ind].form.get(`${control}`).disable();
                  }
                  this.updateEmployeesList();
                  this.showMessage('Updated successfully!');
                }
              });
            } else {
              this.showMessage('Form validation error!');
            }
            break;
          case 'delete':
            const index = this.editableList.indexOf(employee._id);
            const eIndex = this.employeesList.indexOf(employee);
            this.editableList.splice(index, 1);
            if (employee._id === this.newItemsIdIndex.toString()) {
              this.employeesList.shift();
              this.isCreating = false;
            } else {
              this.employeesList[eIndex] = this.initialStateOfEmployees.filter((e: Employee) => e._id === employee._id)[0];
              if (!this.isCreating) {
                const ind = this.employeeForms.findIndex((i: {form: FormGroup, id: string}) => i.id === employee._id);
                const initial: Employee = this.initialStateOfEmployees.filter((i: Employee) => i._id === employee._id)[0];
                this.employeeForms.filter((i: {form: FormGroup, id: string}) => i.id === employee._id)[0].form = this.initForm(initial);
                for (const control in this.employeeForms[ind].form.controls) {
                  this.employeeForms[ind].form.get(`${control}`).disable();
                }
                break;
              }
            }
            break;
        }
        break;
      case false:
        switch (type) {
          case 'edit':
            this.toEditList(employee);
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
