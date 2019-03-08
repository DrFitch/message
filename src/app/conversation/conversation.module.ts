import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AvatarModule } from 'ngx-avatar';
import { ConversationPage } from './conversation.page';
import { NewConversationPage } from './new-conversation/new-conversation.page';

const routes: Routes = [
  {
    path: '',
    component: ConversationPage
  },
  {
    path: 'new',
    component: NewConversationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AvatarModule
  ],
  declarations: [
    ConversationPage,
    NewConversationPage
  ]
})
export class ConversationPageModule { }
