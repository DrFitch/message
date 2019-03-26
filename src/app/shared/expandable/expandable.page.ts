import { AfterViewInit, Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ModalController } from '@ionic/angular';
import { GalleryModalPage } from './gallery-modal/gallery-modal.page';

@Component({
  selector: 'expandable',
  templateUrl: './expandable.page.html',
  styleUrls: ['./expandable.page.scss'],
  providers: [PhotoLibrary],
  entryComponents: [GalleryModalPage]
})

export class ExpandableComponent implements AfterViewInit {

  @ViewChild('expandWrapper', { read: ElementRef }) expandWrapper;
  // tslint:disable-next-line:no-input-rename
  @Input('expanded') expanded;
  // tslint:disable-next-line:no-input-rename
  @Input('expandWidth') expandWidth;

  library = [];

  constructor(public renderer: Renderer, private photoLibrary: PhotoLibrary, private modalController: ModalController) { }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'width', this.expandWidth + 'px');
  }

  async openLibrary() {
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: async (result) => {
          const library = result['library'];
          this.library = library;

          const modal = await this.modalController.create({
            component: GalleryModalPage,
            componentProps: { value: this.library }
          });
          return await modal.present();

          library.forEach(function (libraryItem) {
            // console.log(libraryItem.id);          // ID of the photo
            // console.log(libraryItem.photoURL);    // Cross-platform access to photo
            // console.log(libraryItem.thumbnailURL); // Cross-platform access to thumbnail
            // console.log(libraryItem.fileName);
            // console.log(libraryItem.width);
            // console.log(libraryItem.height);
            // console.log(libraryItem.creationDate);
            // console.log(libraryItem.latitude);
            // console.log(libraryItem.longitude);
            // console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
      .catch(err => console.log('permissions weren\'t granted'));
  }


}
