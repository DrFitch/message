
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
        return new Promise((resolve, reject) => {
            let fileName = '';
            this.file.resolveLocalFilesystemUrl(_imagePath).then(fileEntry => {
                const { name, nativeURL } = fileEntry;
                const path = nativeURL
                    .substring(0, nativeURL.lastIndexOf('/'));
                fileName = name;
                return this.file.readAsArrayBuffer(path, name);
            }).then(buffer => {
                const imgBlob = new Blob([buffer], {
                    type: 'image/png'
                });
                resolve({
                    fileName,
                    imgBlob
                });
            }).catch(e => reject(e));
        });
    }
}
