import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Follow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<Follow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const FollowModel = mongoose.model<Follow>('Follow', followSchema);
export default FollowModel;
