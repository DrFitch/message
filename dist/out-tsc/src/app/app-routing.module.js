var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
var routes = [
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
    // { path: 'conversations', loadChildren: './tabs/tabs.module#ConversationPageModule' },
    { path: 'chat', loadChildren: './conversation/chat/chat.module#ChatPageModule' },
    { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
    // { path: 'friends', loadChildren: './friends/friends.module#FriendsPageModule' },
    // { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
    { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
    { path: 'new-conversation', loadChildren: './conversation/new-conversation/new-conversation.module#NewConversationPageModule' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [
                RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
            ],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map