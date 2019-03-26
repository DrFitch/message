import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExpandableComponent } from './expandable.page';
import { GalleryModalPageModule } from './gallery-modal/gallery-modal.module';

const routes: Routes = [
  {
    path: 'proutbizarre',
    component: ExpandableComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    GalleryModalPageModule
  ],
  declarations: [ExpandableComponent],
  exports: [ExpandableComponent]
})

export class ExpandableModule { }
