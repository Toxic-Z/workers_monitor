import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private showLoader: Subject<boolean> = new Subject<boolean>();
  constructor() {}

  public changeLoaderVisibility(state: boolean): void {
    setTimeout(() => {
      this.showLoader.next(state);
    },0);
  }

  public checkLoaderState(): Observable<boolean> {
    return this.showLoader.asObservable();
  }

}
