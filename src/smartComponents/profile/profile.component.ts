import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) {
    this.authService.userProfile$.subscribe((user) => {
      console.log(user)
    })
  }

  ngOnInit(): void {
  }

}
