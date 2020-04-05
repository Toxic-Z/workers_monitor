import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public log(inOrOut: boolean): void {
    inOrOut ? this.authService.login() : this.authService.logout();
  }

  public checkLogin(): boolean {
    return this.authService.loggedIn;
  }

  public checkRoute(checkFor: string): boolean {
    return this.router.url.includes(checkFor);
  }
}
