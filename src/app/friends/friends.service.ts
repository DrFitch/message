import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/core/models/user';
import { map, first } from 'rxjs/operators';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private afs: AngularFirestore) { }

  getUserList(): Observable<User[]> {
    return this.afs.collection<User>('users').valueChanges();
  }

  getFriends(uid): Observable<User[]> {
    return this.afs.collection<User>('users').doc(uid).valueChanges().pipe(
      map((user: User) => {
        const friends: User[] = [];
        user.friendList.forEach(friendUid => {
          this.getUser(friendUid).subscribe(result => {
            friends.push(result);
          });
        });
        return friends;
      })
    );
  }

  getUser(userId: string): Observable<User> {
    return this.afs.collection<User>('users').doc(userId).valueChanges().pipe(
      map(data => new User(data))
    );
  }

  addFriend(uid: string, friendUid: string) {
    return this.afs.collection<User>('users').doc(uid).update({
      friendList: firestore.FieldValue.arrayUnion(friendUid)
    });
  }

  removeFriend(uid: string, friendUid: string) {
    return this.afs.collection<User>('users').doc(uid).update({
      friendList: firestore.FieldValue.arrayRemove(friendUid)
    });
  }

}
