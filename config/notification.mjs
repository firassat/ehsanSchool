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
