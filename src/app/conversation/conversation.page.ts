import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/core/models/user';
import { AuthenticationService } from '../shared/authentication.service';

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
  conversations = [
    {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }, {
      id: 1,
      text: 'message'
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute, private authSvc: AuthenticationService) { }

  ngOnInit() {
    // console.log('snapshot.paramMap.get("uid")', this.route.snapshot.paramMap.get('uid'));
    /*Get the current user's informations*/
    this.authSvc.user$.subscribe(res => {
      this.userObj = res;
    });
    this.userUid = 'AbfEV7nW8YhOh3BhnxMwbH5iBWe2';
  }

  openChat(conversationId: number) {
    this.router.navigateByUrl(`tabs/conversations/${conversationId}`);
  }

  newConversation() {
    console.log('new conversation');
    this.router.navigateByUrl(`tabs/conversations/new`);
  }


}
