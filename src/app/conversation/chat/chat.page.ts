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
      text: 'Hey Peter',
      type: 'incoming'
    },
    {
      text: 'Hey! It was a long time ago!',
      type: 'outgoing'
    },
    {
      text: 'Yes I know, I was in Austria for 2 years and now I\'m back!',
      type: 'incoming'
    },
    {
      text: 'So awesome',
      type: 'incoming'
    },
    {
      text: 'How was it ?',
      type: 'outgoing'
    },
    {
      text: 'Great man ! Very nice country, peope are nice',
      type: 'incoming'
    },
    {
      text: 'Cool! When do we catch up ?',
      type: 'outgoing'
    },
    {
      text: 'I\'m here the whole next week',
      type: 'outgoing'
    }
  ];

  previousMessageType;
  isInterlocutorWritting = true;

  constructor() { }

  ngOnInit() {
  }

  getClasses(messageType: string) {
    const endGroup = messageType !== this.previousMessageType;
    this.previousMessageType = messageType;
    return {
      incoming: messageType === 'incoming',
      outgoing: messageType === 'outgoing',
      grouped: endGroup
    };
  }

}
