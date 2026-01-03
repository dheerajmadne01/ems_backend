import { FastifyReply, FastifyRequest } from "fastify";
import NotificationService from "../services/notification.service";
import UserDeviceTokenRepository from "../repositories/user_device_token.repo";
import NotificationRepository from "../repositories/notification.repo";

const notificationService = new NotificationService();
const deviceTokenRepo = new UserDeviceTokenRepository();
const notificationRepo = new NotificationRepository();

/**
 * NotificationController - Handles HTTP requests for notifications
 */
class NotificationController {
  /**
   * POST /user/device-token
   * Save or update FCM token for the authenticated user
   */
  saveDeviceToken = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user_id = (req.user as any)?.id;
      if (!user_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      const { fcm_token, platform } = req.body as {
        fcm_token: string;
        platform?: string;
      };

      if (!fcm_token) {
        return reply.status(400).send({
          status_code: 400,
          message: "fcm_token is required",
        });
      }

      // Save or update token (avoid duplicates)
      const token = await deviceTokenRepo.createOrUpdate({
        user_id,
        fcm_token,
        platform: platform || "android",
      });

      // Convert Sequelize model to plain object
      const tokenData = (token as any)?.toJSON ? (token as any).toJSON() : token;

      return reply.send({
        status_code: 200,
        message: "Device token saved successfully",
        data: tokenData,
      });
    } catch (err: any) {
      return reply.status(400).send({
        status_code: 400,
        message: err.message,
      });
    }
  };

  /**
   * GET /user/notifications
   * Get all notifications for the authenticated user
   */
  getNotifications = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user_id = (req.user as any)?.id;
      if (!user_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      const notifications = await notificationRepo.findByReceiverId(user_id);

      // Convert Sequelize models to plain objects
      const notificationsData = notifications.map((n: any) => 
        n.toJSON ? n.toJSON() : n
      );

      return reply.send({
        status_code: 200,
        data: notificationsData,
      });
    } catch (err: any) {
      return reply.status(500).send({
        status_code: 500,
        message: err.message,
      });
    }
  };

  /**
   * GET /user/notifications/unread
   * Get unread notifications for the authenticated user
   */
  getUnreadNotifications = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user_id = (req.user as any)?.id;
      if (!user_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      const notifications = await notificationRepo.findUnreadByReceiverId(user_id);

      // Convert Sequelize models to plain objects
      const notificationsData = notifications.map((n: any) => 
        n.toJSON ? n.toJSON() : n
      );

      return reply.send({
        status_code: 200,
        data: notificationsData,
      });
    } catch (err: any) {
      return reply.status(500).send({
        status_code: 500,
        message: err.message,
      });
    }
  };

  /**
   * PATCH /user/notifications/:id/read
   * Mark a notification as read
   */
  markAsRead = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user_id = (req.user as any)?.id;
      if (!user_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      const notificationId = (req.params as any).id;
      const notification = await notificationRepo.markAsRead(notificationId);

      if (!notification) {
        return reply.status(404).send({
          status_code: 404,
          message: "Notification not found",
        });
      }

      // Convert Sequelize model to plain object
      const notificationData = (notification as any)?.toJSON 
        ? (notification as any).toJSON() 
        : notification;

      return reply.send({
        status_code: 200,
        message: "Notification marked as read",
        data: notificationData,
      });
    } catch (err: any) {
      return reply.status(400).send({
        status_code: 400,
        message: err.message,
      });
    }
  };

  /**
   * PATCH /user/notifications/read-all
   * Mark all notifications as read for the authenticated user
   */
  markAllAsRead = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user_id = (req.user as any)?.id;
      if (!user_id) {
        return reply.status(401).send({
          status_code: 401,
          message: "Unauthorized - invalid token",
        });
      }

      await notificationRepo.markAllAsRead(user_id);

      return reply.send({
        status_code: 200,
        message: "All notifications marked as read",
      });
    } catch (err: any) {
      return reply.status(400).send({
        status_code: 400,
        message: err.message,
      });
    }
  };
}

export default new NotificationController();


