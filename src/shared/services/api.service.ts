import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
  ) { }

  public fetchEmployees(): Observable<Employee[]> {
    this.commonService.changeLoaderVisibility(true);
    const url = environment.apiUrl + 'employees';
    return this.httpClient.get<Employee[]>(url);
  }

  public deleteEmployee(id: string): Observable<boolean> {
    this.commonService.changeLoaderVisibility(true);
    const url = environment.apiUrl + 'employees/' + id;
    return this.httpClient.delete<boolean>(url);
  }
}
