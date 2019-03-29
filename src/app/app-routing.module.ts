import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from './shared/auth-guard.guard';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuardGuard] },
  { path: 'chat', loadChildren: './conversation/chat/chat.module#ChatPageModule', canActivate: [AuthGuardGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'verification', loadChildren: './verification/verification.module#VerificationPageModule' },
  {
    path: 'new-conversation',
    loadChildren: './conversation/new-conversation/new-conversation.module#NewConversationPageModule'
  },
  { path: 'gallery-modal', loadChildren: './shared/expandable/gallery-modal/gallery-modal.module#GalleryModalPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
