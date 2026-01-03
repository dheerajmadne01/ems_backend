import { FastifyInstance } from "fastify";
import { decodeToken } from "../middleware/authMiddleware";
import NotificationController from "../controllers/notification.controller";

/**
 * Notification routes
 */
export async function notificationRoutes(fastify: FastifyInstance) {
  // Save or update FCM device token
  fastify.post(
    "/user/device-token",
    { preHandler: decodeToken },
    NotificationController.saveDeviceToken
  );

  // Get all notifications for authenticated user
  fastify.get(
    "/user/notifications",
    { preHandler: decodeToken },
    NotificationController.getNotifications
  );

  // Get unread notifications for authenticated user
  fastify.get(
    "/user/notifications/unread",
    { preHandler: decodeToken },
    NotificationController.getUnreadNotifications
  );

  // Mark a notification as read
  fastify.put(
    "/user/notifications/:id/read",
    { preHandler: decodeToken },
    NotificationController.markAsRead
  );

  // Mark all notifications as read for authenticated user
  fastify.put(
    "/user/notifications/read-all",
    { preHandler: decodeToken },
    NotificationController.markAllAsRead
  );
}


