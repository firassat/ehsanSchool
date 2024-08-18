// import { getMessaging } from "firebase-admin/messaging";
// import admin from "firebase-admin";

// export function notification(req, res, next) {
//   const serviceAccount = "./ehsan-notification.json";
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
//   //   const receivedToken = req.body.fcmToken;

//   const message = {
//     notification: {
//       title: "Notif",
//       body: "This is a Test Notification",
//     },
//     topic: "all",
//   };

//   getMessaging()
//     .send(message)
//     .then((response) => {
//       res.status(200).json({
//         message: "Successfully sent message",
//         token: response,
//       });
//       console.log("Successfully sent message:", response);
//     })
//     .catch((error) => {
//       res.status(400);
//       res.send(error);
//       console.log("Error sending message:", error);
//     });
// }
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = "./ehsan-notification.json"; // Replace with your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// Define your API endpoint
export async function notification(req, res, next, message, title, token) {
  try {
    // const { token, message } = req.body;

    // Construct the message payload
    const messagePayload = {
      notification: {
        title,
        body: message,
      },
      data: { title, body: message },
      tokens: token,
    };

    // Send the message using the Firebase Admin SDK
    const response = await admin
      .messaging()
      .sendEachForMulticast(messagePayload);
    next();
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
}
