import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var cordova: any;

@Component({
  selector: 'app-conversation',
  templateUrl: 'conversation.page.html',
  styleUrls: ['conversation.page.scss']
})

export class ConversationPage implements OnInit {

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

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('snapshot.paramMap.get("uid")', this.route.snapshot.paramMap.get('uid'));
  }
  openChat(conversationId: number) {
    this.router.navigateByUrl(`chat/${conversationId}`);
  }


}
