var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/core/models/user';
var ConversationService = /** @class */ (function () {
    function ConversationService(afs) {
        this.afs = afs;
    }
    ConversationService.prototype.getUserInfos = function (userId) {
        return this.afs.collection('users').doc(userId).get().pipe(map(function (data) { return new User(data.data()); }));
    };
    ConversationService.prototype.getUsersConversation = function (conversationId) {
        return this.afs.collection('conversations').doc(conversationId).get().pipe(map(function (conversation) { return conversation.data().members; }));
    };
    ConversationService.prototype.createConversation = function (creatorId, members) {
        var _this = this;
        return from(this.afs.collection('users').doc(creatorId).collection('conversations').add({
            members: members
        })).pipe(map(function (document) {
            _this.afs.collection('conversations').doc(document.id).set({
                members: members
            });
            return document.id;
        }));
    };
    ConversationService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [AngularFirestore])
    ], ConversationService);
    return ConversationService;
}());
export { ConversationService };
//# sourceMappingURL=conversation.service.js.map