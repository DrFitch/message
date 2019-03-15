
export class Message {

    createdAt: Date;
    senderId: string;
    text: string;

    constructor(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
