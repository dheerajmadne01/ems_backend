import NotificationModel from "../models/notification.model";
import NotificationInterface from "../interfaces/notification.interface";

/**
 * NotificationRepository - Handles database operations for notifications
 */
class NotificationRepository {
  model = NotificationModel;

  /**
   * Create a new notification record
   */
  async create(data: Partial<NotificationInterface>) {
    return this.model.create(data as any);
  }

  /**
   * Find notification by ID
   */
  async findById(id: string) {
    return this.model.findByPk(id);
  }

  /**
   * Get all notifications for a user
   */
  async findByReceiverId(receiver_user_id: string) {
    return this.model.findAll({
      where: { receiver_user_id },
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Get unread notifications for a user
   */
  async findUnreadByReceiverId(receiver_user_id: string) {
    return this.model.findAll({
      where: { receiver_user_id, is_read: false },
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    await this.model.update({ is_read: true }, { where: { id } });
    return this.model.findByPk(id);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(receiver_user_id: string) {
    return this.model.update(
      { is_read: true },
      { where: { receiver_user_id, is_read: false } }
    );
  }
}

export default NotificationRepository;


