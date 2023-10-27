import * as admin from "firebase-admin";
import serviceAccount from "./notif-test-94afb-firebase-adminsdk-mjn5p-42f4431b87.json"

export const FIREBASE_CONFIG_ACCOUNT: string | admin.ServiceAccount = {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key
}

export const PRIVATE_KEY = 'AAAA_M09B4w:APA91bGHHFxnXBQ52ljrjjhDAIYXgnLWZzjDQQiP7gMrKGxqkjf0bXXLcqn4ysQDkTd966YE5lv6A8dyv3hKrzmE471PUPrVPQ8abxS3wGHspja4hMQBiz2Qkk895eGa906iepGylGE-'
