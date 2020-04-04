import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public log(inOrOut: boolean): void {
    inOrOut ? this.authService.login() : this.authService.logout();
  }
  public checkLogin(): boolean {
    return this.authService.loggedIn;
  }

}
