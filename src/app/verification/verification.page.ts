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

  constructor(private authSvc: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  logOnVerifiation(verificationID: string, smsCode: string) {
    this.authSvc.verifSmsCode(verificationID, smsCode);
  }

}
