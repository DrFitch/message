import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sim } from '@ionic-native/sim/ngx';
import { Platform } from '@ionic/angular';
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
  firstName: string;
  connectCount = 0;

  constructor(private router: Router, private authSvc: AuthenticationService, private sim: Sim, private platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.sim.getSimInfo().then(
        (info) => { console.log('sim : ', info); this.phoneNumber = info.phoneNumber; },
        (err) => console.log('Unable to get sim info: ', err)
      );

      this.sim.hasReadPermission().then(
        (info) => console.log('Has permission: ', info)
      );

      this.sim.requestReadPermission().then(
        () => console.log('Permission granted'),
        () => console.log('Permission denied')
      );
    });

    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('signin');
  }

  logUser() {
    this.connectCount++;
    console.log('this.connectCount', this.connectCount);
    // tslint:disable-next-line:max-line-length
    this.authSvc.loginWithPhoneNumber('+33688911341', 'Pierre'); //  this.phoneNumber,
  }

  signout() {
    cordova.plugins.firebase.auth.signOut().then(function () {
      // user was signed out
      console.log('congrats');
    });
  }
  test() {
    console.log('coucou');
  }
}
