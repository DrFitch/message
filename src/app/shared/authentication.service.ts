import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
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
  subjectUser$: BehaviorSubject<User>;
  userObj: User = { uid: 'init', name: 'init', phoneNumber: 'init' };
  authstate: AngularFireAuth = null;

  constructor(private router: Router, private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.user$ = new Observable<User>();
    this.subjectUser$ = new BehaviorSubject<User>(null);
    this.subjectUser$.next(null);

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.subjectUser$.next(user);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  get loggedIn() {
    return !!this.subjectUser$.value;
  }

  loginWithPhoneNumber(phoneNumber: string) {
    const that = this;
    this.connecting = true;
    cordova.plugins.firebase.auth.verifyPhoneNumber('+1 650-555-3434', 30000).then(function (verificationId) {
      console.log('verificationId', verificationId);
      that.verificationID = verificationId;
      that.router.navigateByUrl(`/verification`);
    });
  }

  verifSmsCode(verificationId: string, smsCode: string, firstName: string) {
    const that = this;
    const signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, '111222');
    console.log('signInCredential: ', signInCredential);

    cordova.plugins.firebase.auth.signInWithVerificationId(verificationId, '111222').then(function (userInfo) {
      that.userObj.uid = userInfo.uid;
      that.userObj.phoneNumber = '+1 650-555-3434'; // userInfo.phoneNumber
      that.userObj.name = 'UserTest'; // firstName
      that.subjectUser$.next(that.userObj);
      that.updateUserData(that.subjectUser$);
      that.router.navigateByUrl(`/tabs/conversations/${userInfo.uid}`);
    });
  }

  updateUserData(user) {
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
