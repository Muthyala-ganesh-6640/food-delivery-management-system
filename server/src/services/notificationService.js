const Notification = require('../models/Notification');
const { getIO } = require('../socket/socket');

const createNotification = async ({ userId, title, message, type = 'INFO', link = '' }) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
    });

    const io = getIO();
    if (io) {
      io.to(userId.toString()).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
  }
};

module.exports = { createNotification };
