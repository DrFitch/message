import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'conversations', loadChildren: './tabs/tabs.module#ConversationPageModule' },
  { path: 'chat', loadChildren: './conversation/chat/chat.module#ChatPageModule', canActivate: [AuthGuardGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  // { path: 'friends', loadChildren: './friends/friends.module#FriendsPageModule' },
  // { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
  // tslint:disable-next-line:max-line-length
  { path: 'new-conversation', loadChildren: './conversation/new-conversation/new-conversation.module#NewConversationPageModule', canActivate: [AuthGuardGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
