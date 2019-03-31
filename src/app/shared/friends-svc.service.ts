import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/core/models/user';
import { map, first, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsSvcService {

  constructor(private afs: AngularFirestore) { }

  getUserList(): Observable<User[]> {
    return this.afs.collection<User>('users').valueChanges();
  }

  getUserInfos(userId: string): Observable<User> {
    return this.afs.collection<User>('users').doc(userId).valueChanges().pipe(
      map(data => new User(data))
    );
  }

  addFriend(newFriendList: string[], userUID: string) {
    return this.afs.collection<User>('users').doc(userUID).update({
      friendList: newFriendList
    });
  }

}
