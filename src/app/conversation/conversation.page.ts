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

  user: User;
  isLoading = false;
  conversations: Conversation[];

  constructor(
    private router: Router,
    private authSvc: AuthenticationService,
    public conversationSvc: ConversationService) { }

  ngOnInit() {
    this.authSvc.userSubject.subscribe(user => {
      this.user = user;
      this.loadConversations();
    });
  }

  loadConversations() {
    this.isLoading = true;
    this.conversationSvc.getConversationsForUser(this.user.uid).subscribe(conversations => {
      this.conversations = conversations;
      this.isLoading = false;
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
    const listOfUsersInConversation = conversation.users.filter(x => x.uid !== this.user.uid);
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

  deleteConversation(conversation: Conversation) {
    this.conversationSvc.deleteConversation(conversation.id);
  }

}
