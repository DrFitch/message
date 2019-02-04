import { Component } from '@angular/core';
import { Router } from '@angular/router';

declare var cordova: any;

@Component({
  selector: 'app-conversation',
  templateUrl: 'conversation.page.html',
  styleUrls: ['conversation.page.scss']
})

export class ConversationPage {

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

  constructor(private router: Router) { }

  openChat(conversationId: number) {
    this.router.navigateByUrl(`chat/${conversationId}`);
  }

  loginWithPhoneNumber() {
    console.log('loginWithPhoneNumber call !');
    cordova.plugins.firebase.auth.verifyPhoneNumber('+33688911341', 30000).then(function (verificationId) {
      console.log('verificationId', verificationId);
      cordova.plugins.firebase.auth.signInWithVerificationId(verificationId, '123456').then(function (userInfo) {
        console.log('userInfo', userInfo);
      });
    });
  }
}