import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { HelperService } from './core/services/helper.service';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [Vibration, LocalNotifications]
})

export class AppComponent {

  showSplash = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private firebase: Firebase,
    private toastCtrl: ToastController,
    private vibration: Vibration,
    private localNotifications: LocalNotifications,
    private helperSvc: HelperService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        this.firebase.subscribe('all');
        this.firebase.onNotificationOpen().subscribe(async res => {
          if (res.tap) {
            console.log('notification ouverte avec appli en bg');
          } else {
            this.vibration.vibrate(300);
            await this.localNotifications.schedule({
              id: 1,
              led: { color: '#FF00FF', on: 500, off: 500 },
              icon: 'https://cdn0.iconfinder.com/data/icons/twitter-ui-flat/48/Twitter_UI-18-512.png',
              title: res.title,
              text: res.body,
              sound: 'file://sound.mp3',
            });
          }
        });
      }
      this.statusBar.backgroundColorByHexString('#f2f6fa');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      timer(6000).subscribe(() => {
        this.showSplash = false;
        this.statusBar.backgroundColorByHexString('#fffff');
      });
    });
  }
}
