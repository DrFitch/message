import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FriendModalPage } from './friend-modal.page';



const routes: Routes = [
  {
    path: 'prout',
    component: FriendModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FriendModalPage],
  exports: [FriendModalPage],
})
export class FriendModalPageModule { }
