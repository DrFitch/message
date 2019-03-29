
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';

@Injectable({
    providedIn: 'root'
})

export class HelperService {

    constructor(private file: File) { }

    public newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public makeFileIntoBlob(_imagePath) {
        // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
        return new Promise((resolve, reject) => {
            let fileName = '';
            this.file.resolveLocalFilesystemUrl(_imagePath).then(fileEntry => {
                const { name, nativeURL } = fileEntry;
                // get the path..
                const path = nativeURL
                    .substring(0, nativeURL.lastIndexOf('/'));
                fileName = name;
                // we are provided the name, so now read the file
                // into a buffer
                return this.file.readAsArrayBuffer(path, name);
            })
                .then(buffer => {
                    // get the buffer and make a blob to be saved
                    const imgBlob = new Blob([buffer], {
                        type: 'image/jpeg'
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
}
