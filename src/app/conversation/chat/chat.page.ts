import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { orderBy } from 'lodash';
import { MarkdownService } from 'ngx-markdown';
import { Message } from 'src/core/models/message';
import { ConversationService } from '../conversation.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
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
  userUid: string;

  constructor(private route: ActivatedRoute, private conversationSvc: ConversationService, private markdownService: MarkdownService) { }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('uid');
    if (this.conversationId) {
      this.loadMessages();
      this.userUid = 'cw1jmSYNk3Yh4wR8C0k1anvNFet2';
    }

  }

  loadMessages(): any {
    this.isLoading = true;
    this.conversationSvc.getMessages(this.conversationId).subscribe(messages => {
      this.messages = orderBy(messages, ['createdAt'], ['asc']);
      this.isLoading = false;
      this.scrollToBottom();
    });
  }

  sendMessage() {
    this.scrollToBottom();
    this.conversationSvc.addMessages(this.conversationId, this.userUid, this.message).subscribe(() => {
      this.conversationSvc.registerDisplayMessage(this.conversationId, this.markdownService.compile(this.message));
      this.message = '';
      this.conversationSvc.unsetUserIsTyping(this.conversationId, this.userUid);
    });
  }

  getConversationInterlocutors() {
    let result = '';
    if (this.members) {
      this.members.forEach(interlocutor => {
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
    this.conversationSvc.setUserIsTyping(this.conversationId, this.userUid);
  }

  registerDisplayMessage() {

  }

  getClasses(senderId: string) {
    const endGroup = senderId !== this.previousSenderId;
    this.previousSenderId = senderId;
    return {
      incoming: this.userUid !== senderId,
      outgoing: this.userUid === senderId,
      grouped: endGroup
    };
  }

}
