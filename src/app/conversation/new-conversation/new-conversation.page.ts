import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private conversationSvc: ConversationService, private router: Router) { }

  ngOnInit() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
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
    const selectedContact = this.contacts.filter(contact => contact.isSelected === true);
    console.log('create conversation with members : ', selectedContact);
    this.members.push('cw1jmSYNk3Yh4wR8C0k1anvNFet2');
    this.conversationSvc.createConversation('id87jYN51zeBei5azwel2IoYzR93', this.members).subscribe(documentId => {
      this.router.navigateByUrl(`tabs/conversations/${documentId}`);
    });
  }

}
