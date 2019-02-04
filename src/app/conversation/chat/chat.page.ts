import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  interlocutor = 'Pierre Cicuto';
  img = 'https://pbs.twimg.com/profile_images/1034412801341710336/Hr_el9Ra.jpg';
  messages = [
    {
      text: 'Hey bruh',
      type: 'incoming'
    },
    {
      text: 'Holy moly !!',
      type: 'outgoing'
    },
    {
      text: 'How are you going bruh ?',
      type: 'outgoing'
    },
    {
      text: 'Well well my boy ! what\'s your plans for tomorrow night ?',
      type: 'incoming'
    },
    {
      text: 'Nothing planned yet and you bruh ? Was thinking about going to a nice cafe place, what doing think about that ?',
      type: 'outgoing'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  getClasses(messageType) {
    return {
      incoming: messageType === 'incoming',
      outgoing: messageType === 'outgoing',
    };
  }

}
