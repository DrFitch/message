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
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
var ConversationPage = /** @class */ (function () {
    function ConversationPage(router, route, authSvc) {
        this.router = router;
        this.route = route;
        this.authSvc = authSvc;
        this.img = 'https://pbs.twimg.com/profile_images/1034412801341710336/Hr_el9Ra.jpg';
        this.conversations = [
            {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }, {
                id: 1,
                text: 'message'
            }
        ];
    }
    ConversationPage.prototype.ngOnInit = function () {
        var _this = this;
        // console.log('snapshot.paramMap.get("uid")', this.route.snapshot.paramMap.get('uid'));
        /*Get the current user's informations*/
        this.authSvc.user$.subscribe(function (res) {
            _this.userObj = res;
        });
        this.userUid = 'AbfEV7nW8YhOh3BhnxMwbH5iBWe2';
    };
    ConversationPage.prototype.openChat = function (conversationId) {
        this.router.navigateByUrl("tabs/conversations/" + conversationId);
    };
    ConversationPage.prototype.newConversation = function () {
        console.log('new conversation');
        this.router.navigateByUrl("tabs/conversations/new");
    };
    ConversationPage = __decorate([
        Component({
            selector: 'app-conversation',
            templateUrl: 'conversation.page.html',
            styleUrls: ['conversation.page.scss']
        }),
        __metadata("design:paramtypes", [Router, ActivatedRoute, AuthenticationService])
    ], ConversationPage);
    return ConversationPage;
}());
export { ConversationPage };
//# sourceMappingURL=conversation.page.js.map