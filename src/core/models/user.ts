export class User {

    public uid: string;
    public name?: string;
    public phoneNumber: string;
    public status: any;


    constructor(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
