import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/core/models/user';
import { FriendsSvcService } from '../shared/friends-svc.service';
import { AuthenticationService } from '../shared/authentication.service';
import * as _ from 'lodash';

declare var navigator;
declare var ContactFindOptions;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  contacts: User;
  searchTerm = '';
  filteredContacts: any;
  firestoreUsers: User[];
  matchingContacts: any;
  searchedContact: any;
  myUser: User;
  useruid: string;
  index: any;
  haveFriend = false;

  constructor(private friendSvc: FriendsSvcService, private authSvc: AuthenticationService) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    this.friendSvc.getUserList().subscribe(users => {
      this.firestoreUsers = users;
    });
    this.authSvc.user$.subscribe(user => {
      this.useruid = user.uid;
      this.friendSvc.getUserInfos(this.useruid).subscribe(userInfo => {
        this.myUser = userInfo;
      });
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

  matchContactOnPhone() {
    this.matchingContacts = [];
    this.filteredContacts = this.contacts;
    this.filteredContacts.forEach(contact => {
      if (contact.phoneNumbers) {
        const phoneNumber = contact.phoneNumbers[0].value.replace(/\s/g, '');
        const user = this.firestoreUsers.find(x => x.phoneNumber === phoneNumber);
        if (user) {
          this.matchingContacts.push(user);
        }
      }
      console.log('this.match', this.matchingContacts);
    });









    // this.filteredContacts.forEach(element => {
    //   this.firestoreUsers.forEach(elementDB => {
    //     if (element.phoneNumbers[0].value === elementDB.phoneNumber) {
    //       this.matchingContacts.push(elementDB);
    //     }
    //   });
    // });
    // if (this.myUser) {
    //   this.myUser.friendList.forEach(friendUID => {
    //     this.friendSvc.getUserInfos(friendUID).subscribe(friend => {
    //       this.matchingContacts.push(friend);
    //     });
    //   });
    // }
  }

  addFriend(userFriendUID: string) {
    this.myUser.friendList.push(userFriendUID);
    this.friendSvc.addFriend(this.myUser.friendList, this.myUser.uid);
    this.matchContactOnPhone();
    this.searchTerm = '';
  }

  removeFriend(userFriendUID: string) {
    this.index = this.myUser.friendList.indexOf(userFriendUID);
    if (this.index > -1) {
      this.myUser.friendList.splice(this.index, 1);
    }
    this.friendSvc.addFriend(this.myUser.friendList, this.myUser.uid);
    this.matchContactOnPhone();
  }

  isFriend(friendUID: string) {
    if (this.myUser.friendList.indexOf(friendUID) > -1) {
      return true;
    }
    return false;
  }

  haveFriends() {
    if (this.myUser) {
      if (this.myUser.friendList) {
        this.haveFriend = true;
      }
    }
    this.haveFriend = false;
  }

  onSuccess(contacts) {
    this.contacts = contacts;
    this.matchContactOnPhone();
  }

  onError(contactError) {
    console.log('Contact loading error : ', contactError);
  }

  searchContacts(searchTerm) {
    console.log(searchTerm);
    this.searchedContact = this.firestoreUsers.filter(x => x.name.match(searchTerm));
  }

}
