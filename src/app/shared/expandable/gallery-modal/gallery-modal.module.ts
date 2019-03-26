import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GalleryModalPage } from './gallery-modal.page';
import { CDVPhotoLibraryPipe } from '../../cdvphotolibrary.pipe';

const routes: Routes = [
  {
    path: 'prout',
    component: GalleryModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GalleryModalPage, CDVPhotoLibraryPipe],
  exports: [GalleryModalPage],
})
export class GalleryModalPageModule { }
