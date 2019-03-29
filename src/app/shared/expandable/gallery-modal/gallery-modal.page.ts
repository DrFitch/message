import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ConversationService } from 'src/app/conversation/conversation.service';
import { NavParams } from '@ionic/angular';
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
  
  constructor(private imagePicker: ImagePicker, private conversationSvc: ConversationService, private modalCtrl: ModalController, private file: File) { }
  
  ngOnInit() {
    this.getImages();
  }

  getImages() {
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      //maximumImagesCount: 3,
 
      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      // width: 200,
      //height: 200,
 
      // quality of resized image, defaults to 100
      quality: 100,
 
      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 0
    };
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.makeFileIntoBlob(results[i]).then(result => {
          this.imageResponse.push(result);
        }).finally(() => {
          this.modalCtrl.dismiss(this.imageResponse);
        })
        console.log('this.imageResponse', this.imageResponse);
      }
    }, (err) => {
      alert(err);
    });
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file.resolveLocalFilesystemUrl(_imagePath).then(fileEntry => {
          let { name, nativeURL } = fileEntry;
          // get the path..
          let path = nativeURL
                      .substring(0, nativeURL.lastIndexOf("/"));
          fileName = name;
          // we are provided the name, so now read the file 
          // into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          
          // pass back blob and the name of the file for saving
          // into fire base
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  // sendMessage() {
  //   if (this.message !== '') {
  //     this.conversationSvc.addMessages(this.conversationId, this.userUid, this.message).subscribe(() => {
  //       this.conversationSvc.registerDisplayMessage(this.conversationId, this.markdownService.compile(this.message));
  //       this.message = '';
  //       this.conversationSvc.unsetUserIsTyping(this.conversationId, this.userUid);
  //     });
  //   }
  // }

}
