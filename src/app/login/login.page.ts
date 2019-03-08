import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';

declare var cordova: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  phoneNumber: string;
  connecting = false;
  user = {};

  constructor(private router: Router, private authSvc: AuthenticationService) { }

  ngOnInit() {
  }

  logUser() {
    // tslint:disable-next-line:max-line-length
    this.authSvc.loginWithPhoneNumber(this.phoneNumber);
    console.log('phoneNumber: ', this.phoneNumber);
  }
}
