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

  userPhoneNumber: string;
  connecting = false;
  user = {};

  constructor(private router: Router, private authSvc: AuthenticationService) { }

  ngOnInit() {
  }

  logUser() {
    this.authSvc.loginWithPhoneNumber(this.userPhoneNumber);
  }
}
