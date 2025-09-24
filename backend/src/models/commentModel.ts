import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Comment extends Document {
  text: string;
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<Comment>(
  {
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
export default CommentModel;
