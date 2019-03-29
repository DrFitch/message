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
  user$ = new BehaviorSubject<User>(null);

  userObj: User = { uid: 'init', name: 'init', phoneNumber: 'init', status: null };
  authstate: AngularFireAuth = null;

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {

    cordova.plugins.firebase.auth.onAuthStateChanged(userInfo => {
      if (userInfo && userInfo.uid) {
        this.afs.firestore.doc(`/users/${userInfo.uid}`).get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              this.user$.next(new User(docSnapshot.data()));
            } else {
              this.afs.doc(`users/${userInfo.uid}`).set({
                name: 'Test',
                phoneNumber: userInfo.phoneNumber,
                uid: userInfo.uid
              }).then(result => {
                console.log('result creation', result);
                this.user$.next(new User(result));
              });
            }
            this.router.navigateByUrl(`/tabs/conversations`);
          });
      } else {
        // user was signed out
      }
    }).bind(this);

    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
  }

  loginWithPhoneNumber(phoneNumber: string) {
    this.connecting = true;
    cordova.plugins.firebase.auth.verifyPhoneNumber(phoneNumber, 40000);
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

  getUser(uid: string): Observable<any> {
    return this.afs.collection(`users/${uid}`).valueChanges();
  }

  logout() {
    this.user$.next(null);
    // this.subjectUser$.next(null);
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
