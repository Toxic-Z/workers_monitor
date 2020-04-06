import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../interfaces/employee";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public fetchEmployees():Observable<any> {
    const url = environment.apiUrl + 'employees';
    return this.httpClient.get(url);
  }
}
