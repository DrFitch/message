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
var FriendsPage = /** @class */ (function () {
    function FriendsPage() {
        this.searchTerms = '';
    }
    FriendsPage.prototype.ngOnInit = function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    };
    FriendsPage.prototype.onDeviceReady = function () {
        this.loadContacts();
    };
    FriendsPage.prototype.loadContacts = function () {
        var options = new ContactFindOptions();
        options.filter = '';
        options.multiple = true;
        var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, this.onSuccess.bind(this), this.onError, options);
    };
    FriendsPage.prototype.onSuccess = function (contacts) {
        this.contacts = contacts;
        this.filteredContacts = this.contacts;
    };
    FriendsPage.prototype.onError = function (contactError) {
        console.log('Contact loading error : ', contactError);
    };
    FriendsPage.prototype.filterContacts = function (searchTerm) {
        this.filteredContacts = this.contacts.filter(function (item) { return item.displayName.toLowerCase().indexOf(searchTerm) !== -1; });
    };
    FriendsPage = __decorate([
        Component({
            selector: 'app-friends',
            templateUrl: './friends.page.html',
            styleUrls: ['./friends.page.scss'],
        }),
        __metadata("design:paramtypes", [])
    ], FriendsPage);
    return FriendsPage;
}());
export { FriendsPage };
//# sourceMappingURL=friends.page.js.map