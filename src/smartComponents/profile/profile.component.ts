import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import { User } from "../../shared/interfaces/user";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;

  constructor(
    private authService: AuthService,
    private commonService: CommonService
  ) {
    this.commonService.changeLoaderVisibility(true);
    this.authService.userProfile$.subscribe((user: User) => {
      this.user = {...user};
      this.initForm();
      this.commonService.changeLoaderVisibility(false);
    });
  }

  ngOnInit(): void {
  }

  private initForm(): void {
    this.profileForm = new FormGroup({
      email: new FormControl({value: this.user.email, disabled: true}, [Validators.required]),
      profileImage: new FormControl(this.user.picture),
      emailVerified: new FormControl({value: this.user.email_verified, disabled: true}),
      nickname: new FormControl({value: this.user.nickname, disabled: true}, [Validators.required]),
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
