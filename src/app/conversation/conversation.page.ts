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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authSvc: AuthenticationService,
    public conversationSvc: ConversationService
  ) { }

  ngOnInit() {
    // console.log('snapshot.paramMap.get("uid")', this.route.snapshot.paramMap.get('uid'));
    this.authSvc.user$.subscribe(res => {
      this.userObj = res;
    });
    this.userUid = 'IGyZdaotm2s87FpWAaVk';
    this.loadConversations();
  }

  loadConversations() {
    this.conversationSvc.getConversationsForUser(this.userUid).subscribe(conversations => {
      this.conversations = conversations;
      console.log('this.conversation', conversations);
    });
  }

  openChat(conversationId: string) {
    this.router.navigateByUrl(`tabs/conversations/${conversationId}`);
  }

  newConversation() {
    this.router.navigateByUrl(`tabs/conversations/new`);
  }


}
