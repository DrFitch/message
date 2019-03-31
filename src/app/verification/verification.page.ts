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
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT
    };
    this.camera.getPicture(options).then((imageData) => {
      this.helperSvc.makeFileIntoBlob(imageData).then(result => {
        this.uploadFile(result);
      });
    }, (err) => {
      // Handle error
    });
  }

  uploadFile(picture) {
    const filePath = `picture-${this.helperSvc.newGuid()}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, picture.imgBlob);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(result => {
          this.pictureUploaded.next(result);
          if (this.userUID) {
            this.authSvc.updateUserPhoto(result, this.userUID);
            this.photoUrl = result;
          }
        });
      })
    ).subscribe(() => {
    });
  }

}
