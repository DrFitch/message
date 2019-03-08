import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor(private afs: AngularFirestore) { }

  createConversation(creatorId, members) {
    const conversationRef = this.afs.firestore.collection('users').doc(creatorId).collection('conversations').doc();
  }

}
