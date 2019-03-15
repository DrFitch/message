import { User } from './user';

export class Conversation {

    id: string;
    memberIds: any;
    profilePicture: string;
    users: User[];

    constructor(data: any) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
