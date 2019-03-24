import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/core/models/user';
import { FriendsSvcService } from '../shared/friends-svc.service';

declare var navigator;
declare var ContactFindOptions;

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  contacts;
  searchTerms = '';
  filteredContacts: any;
  usersList: User[];
  macthingContact: any;
  searchedContact: any;

  constructor(private afs: AngularFirestore, private friendSvc: FriendsSvcService) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    this.friendSvc.getUserInfos().subscribe(user => {
      this.usersList = user;
      this.matchContactOnPhone();
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
    this.macthingContact = new Array();
    this.filteredContacts.forEach(element => {
      this.usersList.forEach(elementDB => {
        if (element.phoneNumbers[0].value === elementDB.phoneNumber) {
          this.macthingContact.push(element);
        }
      });
    });
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
  }

}
