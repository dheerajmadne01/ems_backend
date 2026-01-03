import admin from "firebase-admin";
import NotificationRepository from "../repositories/notification.repo";
import UserDeviceTokenRepository from "../repositories/user_device_token.repo";
import NotificationInterface, {
  CreateNotificationData,
  // NotificationInterface,
} from "../interfaces/notification.interface";

/**
 * NotificationService - Handles notification creation and push notifications via FCM
 */
class NotificationService {
  private notificationRepo = new NotificationRepository();
  private deviceTokenRepo = new UserDeviceTokenRepository();
  private firebaseApp: admin.app.App | null = null;

  /**
   * Initialize Firebase Admin SDK
   * Should be called once during application startup
   */
  initializeFirebase() {
    try {
      // Check if Firebase is already initialized
      if (admin.apps.length > 0) {
        this.firebaseApp = admin.app();
        return;
      }

      // Initialize Firebase Admin SDK using service account
      // Expects FIREBASE_SERVICE_ACCOUNT_KEY environment variable (JSON string)
      // OR FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      if (serviceAccountKey) {
        // Parse JSON string from environment variable
        const serviceAccount = JSON.parse(serviceAccountKey);
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else if (
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
      ) {
        // Alternative: Use individual environment variables
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
        });
      } else {
        console.warn(
          "⚠️  Firebase Admin SDK not initialized. Push notifications will not work."
        );
        console.warn(
          "Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
        );
      }
    } catch (error: any) {
      console.error("❌ Firebase Admin SDK initialization failed:", error.message);
      // Don't throw - allow app to continue without push notifications
    }
  }

  /**
   * Create a notification record in the database
   */
  async createNotification(data: CreateNotificationData): Promise<NotificationInterface> {
    const notification = await this.notificationRepo.create({
      ...data,
      is_read: false,
    });
    return notification.toJSON() as NotificationInterface;
  }

  /**
   * Send push notification to a user's devices via FCM
   * @param receiver_user_id - UUID of the user receiving the notification
   * @param title - Notification title
   * @param message - Notification message body
   * @param data - Additional data payload (optional)
   */
  async sendPushNotification(
    receiver_user_id: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<void> {
    try {
      if (!this.firebaseApp) {
        this.initializeFirebase();
      }

      if (!this.firebaseApp) {
        console.warn("Firebase not initialized. Skipping push notification.");
        return;
      }

      // Get all FCM tokens for the user
      const tokens = await this.deviceTokenRepo.findByUserId(receiver_user_id);

      if (!tokens || tokens.length === 0) {
        console.log(`No FCM tokens found for user ${receiver_user_id}`);
        return;
      }

      // Extract FCM tokens from Sequelize model instances
      const fcmTokens = tokens.map((token: any) => {
        // Handle Sequelize model instance
        if (token.toJSON) {
          return token.toJSON().fcm_token;
        }
        return token.fcm_token;
      });

      // Prepare FCM message
      const messagePayload: admin.messaging.MulticastMessage = {
        notification: {
          title,
          body: message,
        },
        data: data
          ? Object.keys(data).reduce((acc, key) => {
              acc[key] = String(data[key]);
              return acc;
            }, {} as Record<string, string>)
          : undefined,
        tokens: fcmTokens,
        android: {
          priority: "high" as const,
        },
        apns: {
          headers: {
            "apns-priority": "10",
          },
        },
      };

      // Send notifications to all devices
      const response = await admin.messaging().sendEachForMulticast(messagePayload);

      // Handle failed tokens (remove invalid tokens)
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(fcmTokens[idx]);
            console.error(
              `Failed to send notification to token ${fcmTokens[idx]}:`,
              resp.error?.message
            );
          }
        });

        // Remove invalid tokens from database
        for (const token of failedTokens) {
          await this.deviceTokenRepo.deleteByToken(token);
        }
      }

      console.log(
        `✅ Push notification sent: ${response.successCount} successful, ${response.failureCount} failed`
      );
    } catch (error: any) {
      // Log error but don't throw - notification failures should not break main API
      console.error("❌ Error sending push notification:", error.message);
    }
  }

  /**
   * Create notification and send push notification in one call
   * This is the main method used by other services
   */
  async createAndSendNotification(
    notificationData: CreateNotificationData,
    pushTitle: string,
    pushMessage: string,
    pushData?: Record<string, any>
  ): Promise<NotificationInterface> {
    try {
      // Create notification record in database
      const notification = await this.createNotification(notificationData);

      // Send push notification (non-blocking - failures are logged but don't throw)
      await this.sendPushNotification(
        notificationData.receiver_user_id,
        pushTitle,
        pushMessage,
        pushData
      );

      return notification;
    } catch (error: any) {
      // Log error but don't throw - notification failures should not break main API
      console.error("❌ Error creating/sending notification:", error.message);
      throw error; // Re-throw only if database operation fails
    }
  }
}

export default NotificationService;


