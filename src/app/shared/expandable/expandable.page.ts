import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HelperService } from 'src/app/core/services/helper.service';
import { GalleryModalPage } from './gallery-modal/gallery-modal.page';

@Component({
  selector: 'expandable',
  templateUrl: './expandable.page.html',
  styleUrls: ['./expandable.page.scss'],
  providers: [AngularFireStorage, Camera],
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

  constructor(
    public renderer: Renderer,
    private modalController: ModalController,
    private storage: AngularFireStorage,
    private camera: Camera,
    private helperSvc: HelperService) { }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'width', this.expandWidth + 'px');
  }

  async openLibrary() {
    const modal = await this.modalController.create({
      component: GalleryModalPage,
    });
    await modal.present();
    const test = await modal.onDidDismiss();
    this.uploadFile(test.data[0]);
  }

  uploadFile(picture) {
    const filePath = `picture-${this.helperSvc.newGuid()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, picture.imgBlob);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(result => {
          this.pictureUploaded.next(result);
        });
      })
    ).subscribe(() => {
    });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.helperSvc.makeFileIntoBlob(imageData).then(result => {
        this.uploadFile(result);
      });
    }, (err) => {
      // Handle error
    });
  }

}
