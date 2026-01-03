import UserDeviceTokenModel from "../models/user_device_token.model";
import { UserDeviceTokenInterface } from "../interfaces/notification.interface";

/**
 * UserDeviceTokenRepository - Handles database operations for FCM tokens
 */
class UserDeviceTokenRepository {
  model = UserDeviceTokenModel;

  /**
   * Create or update FCM token for a user
   * Updates if token exists, creates if not
   */
  async createOrUpdate(data: Partial<UserDeviceTokenInterface>) {
    const existing = await this.model.findOne({
      where: { fcm_token: data.fcm_token },
    });

    if (existing) {
      // Update existing token with new user_id and platform if changed
      await this.model.update(
        {
          user_id: data.user_id,
          platform: data.platform || existing.platform,
          updated_at: new Date(),
        },
        { where: { fcm_token: data.fcm_token } }
      );
      return this.model.findOne({ where: { fcm_token: data.fcm_token } });
    }

    // Create new token
    return this.model.create(data as any);
  }

  /**
   * Find all tokens for a user
   */
  async findByUserId(user_id: string) {
    return this.model.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });
  }

  /**
   * Find token by FCM token string
   */
  async findByFcmToken(fcm_token: string) {
    return this.model.findOne({ where: { fcm_token } });
  }

  /**
   * Delete a token
   */
  async deleteByToken(fcm_token: string) {
    return this.model.destroy({ where: { fcm_token } });
  }

  /**
   * Delete all tokens for a user
   */
  async deleteByUserId(user_id: string) {
    return this.model.destroy({ where: { user_id } });
  }
}

export default UserDeviceTokenRepository;


