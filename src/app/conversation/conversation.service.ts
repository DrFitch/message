import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take, first, flatMap, switchMap } from 'rxjs/operators';
import { Conversation } from 'src/core/models/conversation';
import { User } from 'src/core/models/user';
import { AuthenticationService } from '../shared/authentication.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private afs: AngularFirestore, private authSvc: AuthenticationService) { }

  getUserInfos(userId: string): Observable<User> {
    return this.afs.collection<User>('users').doc(userId).get().pipe(
      map(data => new User(data.data()))
    );
  }

  getConversationInterlocutors(conversationId): Observable<any> {
    // flatMap((conversation: Conversation) => {
    //   const users: User[] = [];
    //   conversation.members.forEach(uid => {
    //     this.authSvc.getUser(uid).pipe(
    //       map((result) => {
    //         users.push(result);
    //       }));
    //   });
    //   return users;
    // })
    return this.afs.doc(`conversations/${conversationId}`).valueChanges().pipe(
      map((conversation: Conversation) => {
        const user: User[] = [];
        conversation.members.map(uid => {
          this.authSvc.getUser(uid).subscribe(result => {
            user.push(result);
          });
        });
        return user;
      })
    );
  }

  getTypingUsers(conversationId: string): Observable<string[]> {
    return this.afs.doc(`conversations/${conversationId}`).valueChanges().pipe(
      map((conversation: Conversation) => conversation.typingUsers)
    );
  }

  getConversationsForUser(uid: string): Observable<Conversation[]> {
    return this.afs.collection('conversations', ref => ref.where('members', 'array-contains', uid)).snapshotChanges().pipe(
      map(conversations => {
        const result: Conversation[] = [];
        conversations.map(c => {
          const conversation = c.payload.doc.data() as Conversation;
          conversation.id = c.payload.doc.id;
          conversation.users = [];
          conversation.members.forEach(id => {
            this.getUserById(id).subscribe(user => {
              this.authSvc.getPresence(user.uid).pipe(take(1)).subscribe(status => {
                user.status = status;
                conversation.users.push(new User(user));
              });
            });
          });
          result.push(conversation);
        });
        return result;
      })
    );
  }

  createConversation(creatorId: string, members: any[]): Observable<any> {
    return from(this.afs.collection('users').doc(creatorId).collection('conversations').add({
      members: members
    })).pipe(
      map(document => {
        this.afs.collection('conversations').doc(document.id).set({
          members: members,
          admin: creatorId
        });
        return document.id;
      })
    );
  }

  getConversationMembersFormatted(members: User[], connectedUserId = null) {
    let result = '';
    if (members.length === 2) {
      members = members.filter(x => x.uid !== connectedUserId);
    }
    members.forEach((member, index) => {
      result += member.name + (index === members.length - 1 ? '' : ', ');
    });
    return result;
  }

  getUserById(userId): Observable<User> {
    return this.afs.collection<User>('users').doc(userId).get().pipe(
      map(data => new User(data.data()))
    );
  }

  getConversation(conversationId): Observable<Conversation> {
    return this.afs.doc<Conversation>(`conversations/${conversationId}`).valueChanges();
  }

  getMessages(conversationId): Observable<any> {
    return this.afs.collection(`conversations/${conversationId}/messages`).valueChanges().pipe(
      map(messages => messages)
    );
  }

  setUserIsTyping(conversationId, userId: string) {
    const typersArray = [];
    typersArray.push(userId);
    this.afs.collection(`conversations`).doc(conversationId).set({
      typingUsers: typersArray
    }, { merge: true });
  }

  addMessages(conversationId, senderId, message) {
    return from(this.afs.collection(`conversations/${conversationId}/messages`).add({
      text: message,
      senderId: senderId,
      createdAt: new Date()
    }));
  }

  sendPicture(conversationId, senderId, pictureUrl) {
    return from(this.afs.collection(`conversations/${conversationId}/messages`).add({
      imageUrl: pictureUrl,
      senderId: senderId,
      createdAt: new Date()
    }));
  }

  registerDisplayMessage(conversationId, message) {
    this.afs.collection(`conversations`).doc(conversationId).set({
      displayMessage: message
    }, { merge: true });
  }

  unsetUserTyping(conversationId, userId: string) {
    let typersArray = [];
    this.afs.collection(`conversations`).doc(conversationId).valueChanges().pipe(
      map((conversation: Conversation) => {
        typersArray = conversation.typingUsers;
        this.afs.collection(`conversations`).doc(conversationId).update({
          typingUsers: typersArray.filter(typer => typer.id !== userId)
        });
      })
    );
    this.afs.collection(`conversations`).doc(conversationId).update({
      typingUsers: typersArray.filter(typer => typer.id !== userId)
    });
  }

  getProfilePictureByUid(uid: string): Promise<any> {
    return this.afs.firestore.doc(`users/${uid}`).get();
  }

  deleteConversation(conversationId: string) {
    return this.afs.doc(`conversations/${conversationId}`).delete();
  }
}
