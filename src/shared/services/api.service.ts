import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Employee } from '../interfaces/employee';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private url = environment.apiUrl + 'employees/';

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) { }

  public fetchEmployees(): Observable<Employee[]> {
    this.commonService.changeLoaderVisibility(true);
    return this.httpClient.get<Employee[]>(this.url);
  }

  public updateEmployee(employee: Employee): Observable<boolean> {
    this.commonService.changeLoaderVisibility(true);
    return this.httpClient.put<boolean>(this.url + employee._id, employee);
  }

  public createEmployee(employee: Employee): Observable<boolean> {
    this.commonService.changeLoaderVisibility(true);
    return this.httpClient.post<boolean>(this.url, employee);
  }

  public deleteEmployee(id: string): Observable<boolean> {
    this.commonService.changeLoaderVisibility(true);
    return this.httpClient.delete<boolean>(this.url + id);
  }
}
