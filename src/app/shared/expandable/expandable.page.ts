import { AfterViewInit, Component, ElementRef, Input, Renderer, ViewChild, Output, EventEmitter } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ModalController } from '@ionic/angular';
import { GalleryModalPage } from './gallery-modal/gallery-modal.page';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'expandable',
  templateUrl: './expandable.page.html',
  styleUrls: ['./expandable.page.scss'],
  providers: [AngularFireStorage],
  entryComponents: [GalleryModalPage]
})

export class ExpandableComponent implements AfterViewInit {

  @Output() pictureUploaded: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('expandWrapper', { read: ElementRef }) expandWrapper;
  // tslint:disable-next-line:no-input-rename
  @Input('expanded') expanded;
  // tslint:disable-next-line:no-input-rename
  @Input('expandWidth') expandWidth;

  library = [];

  constructor(public renderer: Renderer, private modalController: ModalController, private storage: AngularFireStorage) { }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'width', this.expandWidth + 'px');
  }

  async openLibrary() {
    const modal = await this.modalController.create({
      component: GalleryModalPage,
    });
    await modal.present();
    const test = await modal.onDidDismiss();
    console.log('test', test);
    this.uploadFile(test.data[0]);
  }

  uploadFile(picture) {
    // const file = event.target.files[0];
    const filePath = `picture-${this.newGuid()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, picture.imgBlob);
    // this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(result => {
          // this.user.photoURL = result;
          this.pictureUploaded.next(result);
          console.log('result', result);

          // this.isUploading = false;
          // this.auth.updateUserPhoto(user, this.test);
        });
      })).subscribe(() => {
      });
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
