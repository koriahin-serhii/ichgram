import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useCreatePost } from '@shared/api/posts';
import useAuth from '@app/providers/useAuth';
import UploadPhotoIcon from '@assets/icons/upload-photo.svg?react';
import styles from './CreatePostModal.module.css';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_DESCRIPTION_LENGTH = 2200;

const EMOJI_LIST = [
  '😀',
  '😂',
  '🥰',
  '😍',
  '🤩',
  '😎',
  '🥳',
  '😇',
  '🙏',
  '👍',
  '❤️',
  '🔥',
  '✨',
  '🎉',
  '💯',
  '🌟',
  '💪',
  '👏',
  '🙌',
  '🎊',
];

export default function CreatePostModal({
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useCreatePost();

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiClick = (emoji: string) => {
    setDescription((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleShare = async () => {
    if (!selectedImage || !description.trim()) {
      alert('Please select an image and add description');
      return;
    }

    try {
      await createPost.mutateAsync({
        image: selectedImage,
        description: description.trim(),
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    }
  };

  const handleClose = () => {
    setDescription('');
    setSelectedImage(null);
    setPreviewUrl(null);
    setShowEmojiPicker(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create new post</h2>
          <button
            onClick={handleShare}
            className={styles.shareBtn}
            disabled={
              !selectedImage || !description.trim() || createPost.isPending
            }
          >
            {createPost.isPending ? 'Sharing...' : 'Share'}
          </button>
        </div>

        <div className={styles.content}>
          {/* Left side - Image upload */}
          <div className={styles.imageSection}>
            {previewUrl ? (
              <div className={styles.preview}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className={styles.previewImage}
                />
                <button
                  onClick={handleSelectClick}
                  className={styles.changeImageBtn}
                >
                  Change photo
                </button>
              </div>
            ) : (
              <div className={styles.uploadArea} onClick={handleSelectClick}>
                <UploadPhotoIcon className={styles.uploadIcon} />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className={styles.fileInput}
            />
          </div>

          {/* Right side - Caption */}
          <div className={styles.captionSection}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarInner}>
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className={styles.username}>{user?.name || 'User'}</span>
            </div>

            <div className={styles.textareaWrapper}>
              <textarea
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Write a caption..."
                className={styles.textarea}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <div className={styles.charCount}>
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>

            <div className={styles.emojiSection}>
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={styles.emojiBtn}
                type="button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 6c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z" />
                </svg>
                <span>Emoji</span>
              </button>

              {showEmojiPicker && (
                <div className={styles.emojiPicker}>
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className={styles.emojiItem}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
