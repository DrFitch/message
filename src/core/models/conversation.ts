import { User } from './user';

export class Conversation {

    id: string;
    memberIds: [];
    profilePicture: string;
    displayMessage: string;
    users: User[];
    status: any;

    constructor(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
