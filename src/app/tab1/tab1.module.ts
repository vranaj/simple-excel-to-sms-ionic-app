import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {SMS} from '@ionic-native/sms/ngx';
import {Sim} from '@ionic-native/sim/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  providers: [AndroidPermissions,
    SMS, Sim],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
