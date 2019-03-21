import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'src/core/models/user';

@Injectable({
  providedIn: 'root'
})
export class FriendsSvcService {

  constructor(private afs: AngularFirestore) { }

  getUserInfos(): Observable<User[]> {
    return this.afs.collection<User>('users').valueChanges();
  }
}
