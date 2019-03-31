import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';
import { User } from 'src/core/models/user';
import { HelperService } from '../core/services/helper.service';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
  providers: [AngularFireStorage, Camera],
})
export class VerificationPage implements OnInit {

  smsCode: string;
  firstName: string;
  photoUrl: string;
  @Output() pictureUploaded: EventEmitter<any> = new EventEmitter<any>();
  userUID: string;
  myUser: User;

  constructor(private authSvc: AuthenticationService, private router: Router, private camera: Camera,
    private helperSvc: HelperService,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    this.authSvc.userSubject.subscribe(user => {
      this.userUID = user.uid;
      this.myUser = user;

      // this.authSvc.getUserInfos(this.userUID).subscribe(userInfo => {
      //   this.myUser = userInfo;
      // });
    });
  }

  setUserNameAndPicture() {
    this.myUser.name = this.firstName;
    this.myUser.profilePicture = this.photoUrl;
    this.authSvc.updateUserData(this.myUser);
    this.router.navigateByUrl(`/tabs/conversations`);
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 70,
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

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
