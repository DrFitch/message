import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {

  smsCode: string;
  firstName: string;

  constructor(private authSvc: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logOnVerifiation() {
    if (this.authSvc.verificationID) {
      this.authSvc.verifSmsCode(this.authSvc.verificationID, this.smsCode, this.firstName);
    } else {
      console.log('Nope');
    }

  }

}
