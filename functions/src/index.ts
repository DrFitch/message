import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

export const notifyUserNewMessage = functions.firestore.document('conversations/{document}/messages/{messageId}').onCreate((snapshot, context) => {
    console.log('change :', snapshot);
    console.log('context :', context);
    const payload = {
        notification: {
            title: 'Nouveau message',
            body: snapshot.data().text,
            icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png'
        }
    }
    return admin.messaging().sendToTopic('all', payload);
});