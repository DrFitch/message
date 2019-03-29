export class User {

    uid: string;
    name?: string;
    phoneNumber?: string;
    status: any;
    friendList?: string[];
    photoUrl?: string;


    constructor(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
