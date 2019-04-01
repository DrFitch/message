import { Component, OnInit } from '@angular/core';
import { User } from 'src/core/models/user';
import { AuthenticationService } from '../shared/authentication.service';
import { FriendsService } from './friends.service';

declare var navigator;
declare var ContactFindOptions;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  contacts: any[];
  firestoreUsers: User[];
  searchResults = [];
  searchTerm = '';
  matchingContacts = [];
  searchedContact: any;
  user: User;
  useruid: string;
  index: any;
  haveFriend = false;

  suggestions = [];
  friends = [];

  constructor(private friendSvc: FriendsService, private authSvc: AuthenticationService) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.loadContacts.bind(this), false);
    this.authSvc.getUser(this.authSvc.userSubject.value.uid).subscribe(user => {
      this.user = user;
      this.friendSvc.getFriends(user.uid).subscribe(result => {
        this.friends = result;
      });
    });
  }

  searchContacts(searchTerm) {
    this.searchTerm = searchTerm;
    this.searchResults = this.firestoreUsers.filter(x => x.name.match(searchTerm));
  }

  loadContacts() {
    const options = new ContactFindOptions();
    options.filter = '';
    options.multiple = true;
    const fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    navigator.contacts.find(fields, this.onSuccess.bind(this), this.onError, options);
  }

  loadFirestoreUsers() {
    this.friendSvc.getUserList().subscribe(
      (users) => {
        this.firestoreUsers = users;
        this.findSuggestions();
      }
    );
  }

  findContactsAlreadyOnPhone() {
    this.contacts.forEach(contact => {
      if (contact.phoneNumbers) {
        const phoneNumber = contact.phoneNumbers[0].value.replace(/\s/g, '');
        const user = this.firestoreUsers.find(x => x.phoneNumber === phoneNumber);
        if (user) {
          // this.filteredContacts.push(user);
        }
      }
    });
  }

  findSuggestions() {
    this.contacts.map(contact => {
      if (contact.phoneNumbers) {
        const suggestion = this.firestoreUsers.find(user => user.phoneNumber === contact.phoneNumbers[0].value.replace(/\s/g, ''));
        if (suggestion) {
          if (!this.isFriend(suggestion.uid)) {
            this.suggestions.push(suggestion);
          }
        }
      }
    });
  }

  isFriend(uid: string) {
    return this.user.friendList.includes(uid) ? true : false;
  }

  addFriend(friendUid: string) {
    this.friendSvc.addFriend(this.user.uid, friendUid);
  }

  removeFriend(friendUid: string) {
    this.friendSvc.removeFriend(this.user.uid, friendUid);
  }

  onSuccess(contacts) {
    this.contacts = contacts;
    this.loadFirestoreUsers();
  }

  onError(contactError) {
  }

}
