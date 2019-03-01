import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from 'src/core/models/user';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  phoneNumber: string;
  connecting = false;
  user$: Observable<User>;
  /*Init user object*/
  userObj: User = { uid: 'init', name: 'init', phoneNumber: 'init' };

  constructor(private router: Router, private afs: AngularFirestore) {
    this.user$ = new Observable<User>();
  }

  loginWithPhoneNumber(phoneNumber: string, firstName: string) {
    console.log('fdp#2');

    const that = this;
    that.connecting = true;
    this.user$.subscribe(result => {
      console.log('result obs', result);
    });
    cordova.plugins.firebase.auth.verifyPhoneNumber(phoneNumber, 30000).then(function (verificationId) {
      console.log('verificationId', verificationId);
      cordova.plugins.firebase.auth.signInWithVerificationId(verificationId, '123456').then(function (userInfo) {
        console.log('userInfo', userInfo);
        that.userObj.uid = userInfo.uid;
        that.userObj.phoneNumber = userInfo.phoneNumber;
        that.userObj.name = firstName;
        that.user$ = of(that.userObj);
        that.updateUserData(that.user$);
        that.router.navigateByUrl(`/tabs/conversations/${userInfo.uid}`);
      });
    });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    console.log('user', user);
    const userRef: AngularFirestoreDocument<any> = this.afs.collection('users').doc(user.value.uid); // doc(`users/${user.value.uid}`);

    const data: User = {
      uid: user.value.uid,
      phoneNumber: user.value.phoneNumber,
      name: user.value.name
    };

    return userRef.set(data, { merge: true });

  }

  logout() {
    const that = this;
    that.user$ = of(null);
  }
}
