import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Comment extends Document {
  content: string;
  user: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<Comment>(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
export default CommentModel;
