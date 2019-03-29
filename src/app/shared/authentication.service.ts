import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
  userObj: User = { uid: 'init', name: 'init', phoneNumber: 'init', status: null };
  authstate: AngularFireAuth = null;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {

    this.user$ = new Observable<User>();
    this.subjectUser$ = new BehaviorSubject<User>(null);

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.subjectUser$.next(new User(user));
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
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
      that.router.navigateByUrl(`/tabs/conversations`);
    });
  }

  updateUserPhoto(photoURL: string, userUID: string) {
    return this.afs.collection<User>('users').doc(userUID).update({
      profilePicture: photoURL
    });
  }

  updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.value.uid}`);

    const data: User = {
      uid: user.value.uid,
      phoneNumber: user.value.phoneNumber,
      name: user.value.name,
      status: null
    };

    return userRef.set(data, { merge: true });

  }

  logout() {
    this.user$ = of(null);
    this.subjectUser$.next(null);
    this.router.navigateByUrl('/login');
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  async setPresence(status: string) {
    // const user = await this.getUser();
    // if (user) {
    this.afs.doc(`users/IGyZdaotm2s87FpWAaVk`).update({
      status,
      timestamp: Date.now()
    });
    return this.db.object(`status/IGyZdaotm2s87FpWAaVk`).update({ status, timestamp: this.timestamp });
    // }
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => connected ? 'online' : 'offline')
    );

    return this.afAuth.authState.pipe(
      switchMap(user => true ? connection : of('offline')),
      tap(status => this.setPresence(status))
    );
  }

  updateOnDisconnect() {
    return this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          this.db.object(`status/${user.uid}`).query.ref.onDisconnect()
            .update({
              status: 'offline',
              timestamp: this.timestamp
            });
        }
      })
    );
  }
}
