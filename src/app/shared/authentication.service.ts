import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/core/models/user';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  phoneNumber: string;
  connecting = false;
  verificationID: string;
  user$: Observable<User>;
  /*Init user object*/
  userObj: User = { uid: 'init', name: 'init', phoneNumber: 'init' };
  authstate: AngularFireAuth = null;

  constructor(private router: Router, private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user$ = new Observable<User>();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  loginWithPhoneNumber(phoneNumber: string) {
    this.connecting = true;
    cordova.plugins.firebase.auth.verifyPhoneNumber('+33672979571', 30000).then(function (verificationId) {
      console.log('verificationId', verificationId);
      this.verificationID = verificationId;
      this.router.navigateByUrl(`/verification`);
    }).bind(this);
  }

  verifSmsCode(verificationId: string, smsCode: string, firstName: string) {

    const signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, smsCode);
    console.log('signInCredential: ', signInCredential);

    cordova.plugins.firebase.auth.signInWithVerificationId(verificationId, '123456').then(function (userInfo) {
      this.userObj.uid = userInfo.uid;
      this.userObj.phoneNumber = userInfo.phoneNumber;
      this.userObj.name = firstName;
      this.user$ = of(this.userObj);
      this.updateUserData(this.user$);
      this.router.navigateByUrl(`/tabs/conversations/${userInfo.uid}`);
    }).bind(this);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.value.uid}`);

    const data: User = {
      uid: user.value.uid,
      phoneNumber: user.value.phoneNumber,
      name: user.value.name
    };

    return userRef.set(data, { merge: true });

  }

  logout() {
    this.user$ = of(null);
  }
}
