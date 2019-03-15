import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

export const notifyUserNewMessage = functions.firestore.document('conversations/{document}/messages').onCreate((change, context) => {
    console.log('change', change);
    console.log('context', context);
    const payload = {
        notification: {
            title: 'Nouveau message',
            body: `body du message`,
            icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png'
        }
    }
    return admin.messaging().sendToTopic('all', payload);
});