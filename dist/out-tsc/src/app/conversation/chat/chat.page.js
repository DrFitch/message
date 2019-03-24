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
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from '../conversation.service';
var ChatPage = /** @class */ (function () {
    function ChatPage(route, conversationSvc) {
        this.route = route;
        this.conversationSvc = conversationSvc;
        this.interlocutors = [];
        this.img = 'https://pbs.twimg.com/profile_images/1034412801341710336/Hr_el9Ra.jpg';
        this.messages = [
            {
                text: 'Hey Peter',
                type: 'incoming'
            },
            {
                text: 'Hey! It was a long time ago!',
                type: 'outgoing'
            },
            {
                text: 'Yes I know, I was in Austria for 2 years and now I\'m back!',
                type: 'incoming'
            },
            {
                text: 'So awesome',
                type: 'incoming'
            },
            {
                text: 'How was it ?',
                type: 'outgoing'
            },
            {
                text: 'Great man ! Very nice country, peope are nice',
                type: 'incoming'
            },
            {
                text: 'Cool! When do we catch up ?',
                type: 'outgoing'
            },
            {
                text: 'I\'m here the whole next week',
                type: 'outgoing'
            }
        ];
        this.isInterlocutorWritting = true;
    }
    ChatPage.prototype.ngOnInit = function () {
        this.conversationId = this.route.snapshot.paramMap.get('uid');
        if (this.conversationId) {
            this.loadMessages();
        }
        console.log('snapshot.paramMap.get("uid")', this.route.snapshot.paramMap.get('uid'));
    };
    ChatPage.prototype.loadMessages = function () {
        var _this = this;
        this.isLoading = true;
        this.conversationSvc.getUsersConversation(this.conversationId).subscribe(function (members) {
            members.forEach(function (member) {
                _this.conversationSvc.getUserInfos(member).subscribe(function (infos) {
                    console.log('infos', infos);
                    _this.interlocutors.push(infos);
                });
            });
            _this.isLoading = false;
        });
    };
    ChatPage.prototype.getConversationInterlocutors = function () {
        var result;
        i;
        this.interlocutors.forEach(function (interlocutor) {
            console.log('interlocutor', interlocutor);
            result += interlocutor.name + ', ';
        });
        return result;
    };
    ChatPage.prototype.getClasses = function (messageType) {
        var endGroup = messageType !== this.previousMessageType;
        this.previousMessageType = messageType;
        return {
            incoming: messageType === 'incoming',
            outgoing: messageType === 'outgoing',
            grouped: endGroup
        };
    };
    ChatPage = __decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.page.html',
            styleUrls: ['./chat.page.scss'],
        }),
        __metadata("design:paramtypes", [ActivatedRoute, ConversationService])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.page.js.map