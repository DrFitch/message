import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/friends/friends.service';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { User } from 'src/core/models/user';
import { ConversationService } from '../conversation.service';

declare var navigator;
declare var ContactFindOptions;

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.page.html',
  styleUrls: ['./new-conversation.page.scss'],
})
export class NewConversationPage implements OnInit {

  contacts;
  searchTerms = '';
  filteredContacts: any;
  members = [];
  user: User;
  friends: User[] = [];

  constructor(
    private conversationSvc: ConversationService,
    private router: Router,
    private authSvc: AuthenticationService,
    private friendSvc: FriendsService) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    this.authSvc.userSubject.subscribe(user => {
      console.log('user', user);
      this.user = user;
      this.getFriendsList();
    });
  }

  getFriendsList() {
    this.friendSvc.getFriends(this.user.uid).subscribe(friends => {
      this.friends = friends;
    });
  }

  onDeviceReady() {
    this.loadContacts();
  }

  loadContacts() {
    const options = new ContactFindOptions();
    options.filter = '';
    options.multiple = true;
    const fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fields, this.onSuccess.bind(this), this.onError, options);
  }

  onSuccess(contacts) {
    this.contacts = contacts;
    this.filteredContacts = this.contacts;
  }

  onError(contactError) {
    console.log('Contact loading error : ', contactError);
  }

  filterContacts(searchTerm) {
    this.filteredContacts = this.contacts.filter(item => item.displayName.toLowerCase().indexOf(searchTerm) !== -1);
  }

  createConversation() {
    const selectedFriends = this.friends.filter(friend => friend['isSelected'] === true);
    console.log('create conversation with members : ', selectedFriends);
    selectedFriends.forEach((friend: User) => {
      console.log('selectedFriends', friend);
      this.members.push(friend.uid);
    });
    this.members.push(this.user.uid);
    this.conversationSvc.createConversation(this.user.uid, this.members).subscribe(documentId => {
      this.router.navigateByUrl(`tabs/conversations/${documentId}`);
    });
  }

}
