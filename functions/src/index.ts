import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

export const notifyUserNewMessage = functions.firestore.document('conversations/{document}/messages/{messageId}').onCreate(async (snapshot, context) => {
    const results = await Promise.all([admin.firestore().doc(`users/${snapshot.data().senderId}`).get()]);
    const payload = {
        notification: {
            title: results[0].data().name,
            body: snapshot.data().text,
            icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png'
        }
    }
    console.log('payload :', payload);
    const response = await admin.messaging().sendToTopic('all', payload);
    return response; //await admin.messaging().sendToTopic('all', payload);
});