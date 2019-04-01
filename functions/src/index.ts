import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp();

export const notifyUserNewMessage = functions.firestore.document('conversations/{document}/messages/{messageId}').onCreate(async (snapshot, context) => {
    console.log('context', context);
    console.log('context.params.document', context.params.document);
    const results = await Promise.all([admin.firestore().doc(`users/${snapshot.data().senderId}`).get()]);
    const payload = {
        notification: {
            title: results[0].data().name,
            body: snapshot.data().text,

        },
        data: {
            conversationId: context.params.document
        }
    }
    return await admin.messaging().sendToTopic('all', payload);
});