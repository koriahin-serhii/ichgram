import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Message extends Document {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<Message>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const MessageModel = mongoose.model<Message>('Message', messageSchema);
export default MessageModel;
