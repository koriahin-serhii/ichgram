import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Notification extends Document {
  type: 'like' | 'comment' | 'follow';
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  post?: Types.ObjectId;
  comment?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<Notification>(
  {
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const NotificationModel = mongoose.model<Notification>(
  'Notification',
  notificationSchema
);
export default NotificationModel;
