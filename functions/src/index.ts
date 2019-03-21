import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const firestore = admin.firestore();
admin.initializeApp();

export const notifyUserNewMessage2 = functions.firestore.document('conversations/{document}/messages').onCreate((change, context) => {
    // const db = admin.firestore();
    const snapshot = change.data();
    console.log('snapshot', snapshot);
    console.log('change', change);
    console.log('context', context);

    // db.collection('conversations').doc(context.params.document).collection('messages').doc(context.params.message).get().then(test => {
    //     console.log('test', test);
    // }).catch(err => {
    //     console.log('error while getting message sended');
    // })

    const payload = {
        notification: {
            title: 'Nouveau message',
            body: `body du message`,
            icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png'
        }
    }
    return admin.messaging().sendToTopic('all', payload);
});