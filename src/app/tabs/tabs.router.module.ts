import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'conversations',
        children: [
          {
            path: '',
            loadChildren: '../conversation/conversation.module#ConversationPageModule'
          },
          {
            path: ':uid',
            loadChildren: '../conversation/chat/chat.module#ChatPageModule'
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: '../friends/friends.module#FriendsPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/conversations',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/conversations',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
