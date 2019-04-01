import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConversationService } from 'src/app/conversation/conversation.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { User } from 'src/core/models/user';

@Component({
  selector: 'app-friend-modal',
  templateUrl: './friend-modal.page.html',
  styleUrls: ['./friend-modal.page.scss'],
})
export class FriendModalPage implements OnInit {

  user: User;
  friendsList: User[] = [];
  addFriend: boolean;
  removeFriend: boolean;
  conversationId: string;
  members: string[];
  membersList: User[] = [];

  constructor(private authSvc: AuthenticationService,
    private modalController: ModalController,
    private conversationSvc: ConversationService) { }

  ngOnInit() {
    this.authSvc.userSubject.subscribe(user => {
      this.user = user;
      if (user.friendList) {
        user.friendList.forEach(friendUid => {
          this.authSvc.getUserInfos(friendUid).subscribe(friendInfo => {
            this.friendsList.push(friendInfo);
          });
        });
      }

      this.conversationSvc.getConversation(this.conversationId).subscribe(conv => {
        conv.members.forEach(member => {
          this.authSvc.getUserInfos(member).subscribe(memberInfo => {
            this.membersList.push(memberInfo);
          });
        });
      });
    });
  }

  selectUser(userUID: string): void {
    this.modalController.dismiss(userUID);
  }

  isInConv(userUID: string) {
    this.friendsList.forEach(friend => {
      this.membersList.forEach(member => {
        if (friend === member) {
          return true;
        }
        return false;
      });
    });

    this.membersList.forEach(member => {
      if (member.uid === userUID) {
        return true;
      }
      return false;
    });
  }

}
