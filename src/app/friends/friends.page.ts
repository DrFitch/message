import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  contacts;
  searchTerms = '';
  filteredContacts: any;

  constructor() { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  }

  onDeviceReady() {
    this.loadContacts();
  }

  loadContacts() {
    // const options = new ContactFindOptions();
    // options.filter = '';
    // options.multiple = true;
    // const fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
    // navigator.contacts.find(fields, this.onSuccess.bind(this), this.onError, options);
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

}
