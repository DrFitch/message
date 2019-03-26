import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { ExpandableComponent } from 'src/app/shared/expandable/expandable.page';
import { ChatPage } from './chat.page';
import { ExpandableModule } from 'src/app/shared/expandable/expandable.module';

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
    ExpandableModule
  ],
  declarations: [
    ChatPage
  ]
})
export class ChatPageModule { }
