import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HelperService } from './services/helper.service';
import { File } from '@ionic-native/file/ngx';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers: [
        File
    ],
    exports: [
    ],
    entryComponents: [
    ]
})

export class CoreModule { }
