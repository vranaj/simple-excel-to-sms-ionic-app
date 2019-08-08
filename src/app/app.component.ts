import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions,
    private sms: SMS
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.sendSmsToSelectedNumber();
      this.checkSimPermission();
    });
  }



  sendSmsToSelectedNumber() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
        result => {
          if (result.hasPermission) {
            // this.sms.send('0776621206', 'message1');
            console.log('has sms permission');
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
                .then(
                    () => {
                      // call method to turn on GPS
                      //   this.sms.send('0776621206', 'message2');
                        console.log('has sms permission 1');
                    },
                    error => {

                      alert('requestPermission Error requesting location permissions ' + error);
                    }
                );
          }
        },
        err => {
          alert(err);
        }
    );
  }

    checkSimPermission() {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
            result => {
                if (result.hasPermission) {
                    // this.sms.send('0776621206', 'message1');
                    console.log('has sim permission');
                } else {
                    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
                        .then(
                            () => {
                                // call method to turn on GPS
                                //   this.sms.send('0776621206', 'message2');
                                console.log('has sim permission 1');
                            },
                            error => {

                                alert('requestPermission Error requesting location permissions ' + error);
                            }
                        );
                }
            },
            err => {
                alert(err);
            }
        );
    }
}
