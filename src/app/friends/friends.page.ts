import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/core/models/user';
import { FriendsSvcService } from '../shared/friends-svc.service';
import { AuthenticationService } from '../shared/authentication.service';

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
  usersList: User[];
  macthingContact: any;
  searchedContact: any;
  myUser: User;
  uidstring: string;
  index: any;
  haveFriend: boolean = false;

  constructor(private afs: AngularFirestore, private friendSvc: FriendsSvcService, private authSvc: AuthenticationService) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    this.friendSvc.getUserList().subscribe(userListObj => {
      this.usersList = userListObj;
      console.log('1 - user list: ', userListObj);
      // this.matchContactOnPhone();
    });
    this.authSvc.subjectUser$.subscribe(user => {
      this.uidstring = user.uid;
    });

    this.friendSvc.getUserInfos(this.uidstring).subscribe(userInfo => {
      this.myUser = userInfo;
      console.log('2 - myUser', this.myUser);
      if (this.usersList) {
        console.log('3 - matching method');
        this.matchContactOnPhone();
      }
    });

    console.log('stringUID', this.uidstring);
    console.log('userInfo', this.myUser);

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
    this.macthingContact = new Array();
    this.filteredContacts.forEach(element => {
      this.usersList.forEach(elementDB => {
        if (element.phoneNumbers[0].value === elementDB.phoneNumber) {
          this.macthingContact.push(elementDB);
        }
      });
    });
    console.log('4 - inside');
    if (this.myUser) {
      this.myUser.friendList.forEach(friendUID => {
        this.friendSvc.getUserInfos(friendUID).subscribe(friend => {
          console.log('friend added', friend);
          this.macthingContact.push(friend);
        });
      });
    }
    console.log('matchingContacList: ', this.macthingContact);
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
    this.filteredContacts = this.contacts;
  }

  onError(contactError) {
    console.log('Contact loading error : ', contactError);
  }

  filterContacts(searchTerm) {
    console.log(searchTerm);
    this.searchedContact = this.usersList.filter(x => x.name.match(searchTerm));
    console.log('searchlisteeeuh:', this.searchedContact);
  }

}
