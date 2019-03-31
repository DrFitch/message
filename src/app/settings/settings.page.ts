import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HelperService } from '../core/services/helper.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { User } from 'src/core/models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  providers: [AngularFireStorage, Camera],
})
export class SettingsPage implements OnInit {

  @Output() pictureUploaded: EventEmitter<any> = new EventEmitter<any>();
  userUID: string;
  firstName: string;
  photoUrl: string;
  myUser: User;

  constructor(private authSvc: AuthenticationService, private camera: Camera,
    private helperSvc: HelperService,
    private storage: AngularFireStorage, ) { }

  ngOnInit() {
    this.authSvc.user$.subscribe(user => {
      this.userUID = user.uid;
      this.myUser = user;
      this.photoUrl = user.profilePicture;
      this.firstName = user.name;
    });
  }

  logout() {
    this.authSvc.logout();
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.helperSvc.makeFileIntoBlob(imageData).then(result => {
        this.uploadFile(result);
      });
    }, (err) => {
      // Handle error
    });
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
          if (this.userUID) {
            this.authSvc.updateUserPhoto(result, this.userUID);
            this.photoUrl = result;
          }
          // this.isUploading = false;
          // this.auth.updateUserPhoto(user, this.test);
        });
      })).subscribe(() => {
      });
  }

  setUserNameAndPicture() {
    this.myUser.name = this.firstName;
    this.myUser.profilePicture = this.photoUrl;
    this.authSvc.updateUserData(this.myUser);
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
