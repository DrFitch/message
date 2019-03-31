import { Component, OnInit } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.page.html',
  styleUrls: ['./gallery-modal.page.scss'],
  providers: [PhotoLibrary, ImagePicker, File],
})
export class GalleryModalPage implements OnInit {

  library;
  imageResponse: any;
  options: any;

  constructor(
    private imagePicker: ImagePicker,
    private modalCtrl: ModalController,
    private file: File) { }

  ngOnInit() {
    this.getImages();
  }

  getImages() {
    this.options = {
      quality: 60,
      outputType: 0
    };
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.makeFileIntoBlob(results[i]).then(result => {
          this.imageResponse.push(result);
        }).finally(() => {
          this.modalCtrl.dismiss(this.imageResponse);
        });
      }
    }, (err) => {
      alert(err);
    });
  }

  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      let fileName = '';
      this.file.resolveLocalFilesystemUrl(_imagePath).then(fileEntry => {
        const { name, nativeURL } = fileEntry;
        const path = nativeURL
          .substring(0, nativeURL.lastIndexOf('/'));
        fileName = name;
        return this.file.readAsArrayBuffer(path, name);
      })
        .then(buffer => {
          const imgBlob = new Blob([buffer], {
            type: 'image/jpeg'
          });
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

}
