import mongoose, { Schema, Document, Types } from 'mongoose';

export interface Post extends Document {
  description: string;
  imageUrl: string;
  author: Types.ObjectId;
  likesCount?: number;
  commentsCount?: number;
}

const postSchema = new Schema<Post>(
  {
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for likes count
postSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// Virtual field for comments count
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

const PostModel = mongoose.model<Post>('Post', postSchema);
export default PostModel;
