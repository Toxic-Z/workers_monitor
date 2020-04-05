import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private showLoader: Subject<boolean> = new Subject<boolean>();
  constructor() {}

  public changeLoaderVisibility(state: boolean): void {
    this.showLoader.next(state);
  }

  public checkLoaderState(): Observable<boolean> {
    return this.showLoader.asObservable();
  }

}
