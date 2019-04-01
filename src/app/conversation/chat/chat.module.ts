import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { ExpandableModule } from 'src/app/shared/expandable/expandable.module';
import { ChatPage } from './chat.page';
import { FriendModalPageModule } from './friends-modal/friend-modal/friend-modal.module';

const routes: Routes = [
  {
    // path: ':id',
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MarkdownModule.forChild(),
    ExpandableModule,
    FriendModalPageModule
  ],
  declarations: [
    ChatPage
  ]
})
export class ChatPageModule { }
