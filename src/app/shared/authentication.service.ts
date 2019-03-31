import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { User } from 'src/core/models/user';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  connecting = false;
  userSubject = new BehaviorSubject<User>(null);
  userId: string;

  constructor(
    platform: Platform,
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase) {

    platform.ready().then(() => {
      cordova.plugins.firebase.auth.onAuthStateChanged(userInfo => {
        if (userInfo && userInfo.uid) {
          this.userId = userInfo.uid;
          this.afs.firestore.doc(`/users/${userInfo.uid}`).get()
            .then(docSnapshot => {
              if (docSnapshot.exists) {
                this.userSubject.next(new User(docSnapshot.data()));
              } else {
                this.afs.doc(`users/${userInfo.uid}`).set({
                  name: 'Test',
                  phoneNumber: userInfo.phoneNumber,
                  uid: userInfo.uid,
                  friendList: []
                }).then(result => {
                  console.log('result creation', result);
                  this.userSubject.next(new User(result));
                });
              }
              this.router.navigateByUrl(`/tabs/conversations`);
            });
        } else {
          // user was signed out
          return of(null);
        }
      }).bind(this);
    });
    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
  }

  loginWithPhoneNumber(phoneNumber: string) {
    this.connecting = true;
    cordova.plugins.firebase.auth.verifyPhoneNumber(phoneNumber, 30000);
  }

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.value.uid}`);
    return userRef.set({
      uid: user.value.uid,
      phoneNumber: user.value.phoneNumber,
      name: user.value.name,
      status: null,
    }, { merge: true });
  }

  getUser(uid: string): Observable<User> {
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }

  logout() {
    this.userSubject.next(null);
    // this.subjectUser$.next(null);
    this.router.navigateByUrl('/login');
  }

  getPresence(uid: string) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  async setPresence(status: string) {
    this.afs.doc(`users/${this.userId}`).update({
      status,
      timestamp: Date.now()
    });
    return this.db.object(`status/${this.userId}`).update({ status, timestamp: this.timestamp });
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  updateOnUser() {
    const connection = this.db.object('.info/connected').valueChanges().pipe(
      map(connected => {
        console.log('connected ? ', connected);
        return connected ? 'online' : 'offline';
      })
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
