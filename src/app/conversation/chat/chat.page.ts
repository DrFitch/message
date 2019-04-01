import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { orderBy } from 'lodash';
import * as moment from 'moment';
import { MarkdownService } from 'ngx-markdown';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { Conversation } from 'src/core/models/conversation';
import { Message } from 'src/core/models/message';
import { User } from 'src/core/models/user';
import { ConversationService } from '../conversation.service';
import { FriendModalPage } from './friends-modal/friend-modal/friend-modal.page';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  entryComponents: [FriendModalPage]
})
export class ChatPage implements OnInit {

  // @ViewChild('sendButton') sendButton: Button;
  @ViewChild('chat') private myScrollContainer: ElementRef;

  members = [];
  message = '';
  img = 'https://pbs.twimg.com/profile_images/1034412801341710336/Hr_el9Ra.jpg';
  messages: Message[];

  previousSenderId;
  isInterlocutorWritting = true;
  conversationId;
  isLoading: boolean;
  user: User;
  conversation: Conversation;
  interlocutors: User[] = [];

  itemExpandWidth = 80;
  isExpanded = true;
  typers = [];
  membersNonFiltered;
  friendUid: string;

  constructor(
    private route: ActivatedRoute,
    private conversationSvc: ConversationService,
    private markdownService: MarkdownService,
    private menu: MenuController,
    private authSvc: AuthenticationService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('uid');
    if (this.conversationId) {
      this.authSvc.userSubject.subscribe(user => {
        this.user = user;
        this.load();
      });
    }
    document.querySelector('ion-tab-bar').style.display = 'none';
  }

  load(): any {
    this.isLoading = true;
    this.conversationSvc.getConversation(this.conversationId).subscribe(conversation => {
      conversation.members.forEach(uid => {
        this.authSvc.getUser(uid).subscribe(result => {
          if (this.interlocutors.find(x => x.uid === result.uid)) {
            const index = this.interlocutors.findIndex(x => x.uid === result.uid);
            this.interlocutors[index] = result;
          } else {
            this.interlocutors.push(result);
          }
        });
      });
    });
    this.conversationSvc.getMessages(this.conversationId).subscribe(messages => {
      this.messages = orderBy(messages, ['createdAt'], ['asc']);
      this.isLoading = false;
      this.scrollToBottom();
    });
    this.conversationSvc.getTypingUsers(this.conversationId).subscribe(typers => {
      this.typers = typers.filter(x => x !== this.user.uid);
    });
  }

  async openFriendsModal() {
    const modal = await this.modalController.create({
      component: FriendModalPage,
      componentProps: {
        addFriend: true,
        removeFriend: false,
        conversationId: this.conversationId
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.friendUid = data['data']; // Here's your selected user!
        if (this.friendUid) {
          this.conversationSvc.addFriendToConversation(this.conversationId, this.friendUid);
        }
      });
    return await modal.present();
  }

  async openFriendsRemoveModal() {
    const modal = await this.modalController.create({
      component: FriendModalPage,
      componentProps: {
        addFriend: false,
        removeFriend: true,
        conversationId: this.conversationId
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        this.friendUid = data['data']; // Here's your selected user!
        if (this.friendUid) {
          this.conversationSvc.removeFriendFromConversation(this.conversationId, this.friendUid);
        }
      });
    return await modal.present();
  }

  sendMessage() {
    this.scrollToBottom();
    if (this.message !== '') {
      this.conversationSvc.addMessages(this.conversationId, this.user.uid, this.message).subscribe(() => {
        this.conversationSvc.registerDisplayMessage(this.conversationId, this.markdownService.compile(this.message));
        this.message = '';
        this.conversationSvc.unsetUserTyping(this.conversationId, this.user.uid);
      });
    }
  }

  getConversationInterlocutors() {
    let result = '';
    const members = this.interlocutors.filter(x => x.uid !== this.user.uid);
    if (this.interlocutors) {
      members.forEach(interlocutor => {
        result += interlocutor.name + (this.members.length > 1 ? ', ' : '');
      });
    }
    return result;
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight + 600;
      }, 300);
    } catch (err) {
      console.log('err:', err);
    }
  }

  emitUserTyping(): void {
    this.conversationSvc.setUserIsTyping(this.conversationId, this.user.uid);
  }

  unsetUserTyping(): void {
    this.conversationSvc.unsetUserTyping(this.conversationId, this.user.uid);
  }

  displayTabBar() {
    document.querySelector('ion-tab-bar').style.display = 'flex';
  }

  getClasses(senderId: string) {
    const endGroup = senderId !== this.previousSenderId;
    this.previousSenderId = senderId;
    return {
      incoming: this.user.uid !== senderId,
      outgoing: this.user.uid === senderId,
      grouped: endGroup
    };
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  openCollapside() {
    this.isExpanded = true;
  }

  closeCollapside() {
    this.isExpanded = false;
  }

  sendPictures(e) {
    this.scrollToBottom();
    this.conversationSvc.sendPicture(this.conversationId, this.user.uid, e).subscribe(() => {
      this.conversationSvc.registerDisplayMessage(this.conversationId, '(Picture)');
      this.message = '';
      this.conversationSvc.unsetUserTyping(this.conversationId, this.user.uid);
    });
  }

  getLastConnectionStamp() {
    if (this.interlocutors.length > 0) {
      if (this.interlocutors[0].status === 'online') {
        return '';
      }
      return moment(this.interlocutors[0].timestamp).toNow(true) + ' ago';
    }
  }

  isAdmin() {
    this.conversationSvc.getConversation(this.conversationId).subscribe(conversation => {
      if (conversation.admin) {
        if (this.user.uid === conversation.admin) {
          return true;
        }
        return false;
      }
    });
  }

  call() {
    console.log('calling...');
  }

  getProfilePictureTyper(uid) {
    return this.interlocutors.find(x => x.uid === uid).profilePicture;
  }

  typingOversight(message) {
    if (message.detail.value === '') {
      this.unsetUserTyping();
    } else {
      this.emitUserTyping();
    }
  }
}
