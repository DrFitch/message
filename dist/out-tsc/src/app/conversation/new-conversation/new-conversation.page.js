var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConversationService } from '../conversation.service';
var NewConversationPage = /** @class */ (function () {
    function NewConversationPage(conversationSvc, router) {
        this.conversationSvc = conversationSvc;
        this.router = router;
        this.searchTerms = '';
        this.members = [];
    }
    NewConversationPage.prototype.ngOnInit = function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };
    NewConversationPage.prototype.onDeviceReady = function () {
        this.loadContacts();
    };
    NewConversationPage.prototype.loadContacts = function () {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, this.onSuccess.bind(this), this.onError, options);
    };
    NewConversationPage.prototype.onSuccess = function (contacts) {
        this.contacts = contacts;
        this.filteredContacts = this.contacts;
    };
    NewConversationPage.prototype.onError = function (contactError) {
        console.log('Contact loading error : ', contactError);
    };
    NewConversationPage.prototype.filterContacts = function (searchTerm) {
        this.filteredContacts = this.contacts.filter(function (item) { return item.displayName.toLowerCase().indexOf(searchTerm) !== -1; });
    };
    NewConversationPage.prototype.createConversation = function () {
        var _this = this;
        var selectedContact = this.contacts.filter(function (contact) { return contact.isSelected === true; });
        console.log('create conversation with members : ', selectedContact);
        this.members.push('cw1jmSYNk3Yh4wR8C0k1anvNFet2');
        this.conversationSvc.createConversation('id87jYN51zeBei5azwel2IoYzR93', this.members).subscribe(function (documentId) {
            _this.router.navigateByUrl("tabs/conversations/" + documentId);
        });
    };
    NewConversationPage = __decorate([
        Component({
            selector: 'app-new-conversation',
            templateUrl: './new-conversation.page.html',
            styleUrls: ['./new-conversation.page.scss'],
        }),
        __metadata("design:paramtypes", [ConversationService, Router])
    ], NewConversationPage);
    return NewConversationPage;
}());
export { NewConversationPage };
//# sourceMappingURL=new-conversation.page.js.map