import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/interfaces/user";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;

  constructor(
    private authService: AuthService
  ) {
    this.authService.userProfile$.subscribe((user: User) => {
      console.log(user)
      this.user = {...user};
      this.initForm();
    })
  }

  ngOnInit(): void {
  }

  private initForm(): void {
    this.profileForm = new FormGroup({
      email: new FormControl(this.user.email, [Validators.required]),
      profileImage: new FormControl(this.user.picture),
      emailVerified: new FormControl(this.user.email_verified),
      nickname: new FormControl(this.user.nickname, [Validators.required]),
      current_password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  public submitForm(): void {
    const userdata = {
      email: this.profileForm.get('email').value,
      nickname: this.profileForm.get('nickname').value,
      current_password: this.profileForm.get('current_password').value,
    };
  }

}
