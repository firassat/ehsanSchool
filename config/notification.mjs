import admin from "firebase-admin";

const serviceAccount = "./ehsan-notification.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
export async function notification(req, res, next, message, title, token) {
  try {
    if (!token || token.length < 1) {
      return;
    }

    const messagePayload = {
      notification: {
        title: "ادراة معهد الاحسان",
        body: message,
      },
      android: {
        notification: {
          body: message,
          title: "ادراة معهد الاحسان",
          sound: "default",
        },
      },

      data: { title: "ادراة معهد الاحسان", body: message, sound: "default" },
      tokens: token,
    };
    const response = await admin
      .messaging()
      .sendEachForMulticast(messagePayload);
    return response;
  } catch (error) {
    return error;
  }
}
