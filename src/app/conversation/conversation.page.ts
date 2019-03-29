import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation } from 'src/core/models/conversation';
import { User } from 'src/core/models/user';
import { AuthenticationService } from '../shared/authentication.service';
import { ConversationService } from './conversation.service';

declare var cordova: any;

@Component({
  selector: 'app-conversation',
  templateUrl: 'conversation.page.html',
  styleUrls: ['conversation.page.scss']
})

export class ConversationPage implements OnInit {

  userObj: User;
  userUid: string;

  img = 'https://pbs.twimg.com/profile_images/1034412801341710336/Hr_el9Ra.jpg';

  conversations: Conversation[] = [];

  constructor(
    private router: Router,
    private authSvc: AuthenticationService,
    public conversationSvc: ConversationService) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(res => {
      this.userObj = res;
    });

    this.authSvc.user$.subscribe(result => {
      console.log('result', result);
      this.userUid = result.uid;
      this.loadConversations();
    });
  }

  loadConversations() {
    this.conversationSvc.getConversationsForUser(this.userUid).subscribe(conversations => {
      this.conversations = conversations;
      console.log('this.conversation', conversations);
    });
  }

  displayLastMessage(conversation: Conversation) {
    return conversation.displayMessage.replace(/<\/?[^>]+>/ig, ' ');
  }

  openChat(conversationId: string) {
    this.router.navigateByUrl(`tabs/conversations/${conversationId}`);
  }

  newConversation() {
    this.router.navigateByUrl(`tabs/conversations/new`);
  }

  getPresenceLightColor(conversation: Conversation) {
    const listOfUsersInConversation = conversation.users.filter(x => x.uid !== this.userUid);
    // ? si il n'y a que deux utilisateurs dans la conversation on fait en sorte d'afficher le status de connexion du partenaire
    if (listOfUsersInConversation.length === 1) {
      if (listOfUsersInConversation[0].status) {
        // ! on gere les trois etats pour une discussion avec un seul destinataire
        return {
          online: listOfUsersInConversation[0].status.status === 'online',
          away: listOfUsersInConversation[0].status.status === 'away',
          offline: listOfUsersInConversation[0].status.status === 'offline',
        };
      }
    } else { // ? si il s'agit d'un groupe d'utilisateur on vérifie qu'il y ai au moins un utilisateur de connecté
      if (conversation.users.find(x => x.status.status === 'online')) {
        return {
          online: true
        };
      }
    }
  }

}
