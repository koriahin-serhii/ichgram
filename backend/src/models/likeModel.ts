import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Like extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<Like>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const LikeModel = mongoose.model<Like>('Like', likeSchema);
export default LikeModel;
