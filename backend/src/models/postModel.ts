import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Post extends Document {
  description: string;
  image: string;
  author: Types.ObjectId;
}

const postSchema = new Schema<Post>(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const PostModel = mongoose.model<Post>('Post', postSchema);
export default PostModel;
