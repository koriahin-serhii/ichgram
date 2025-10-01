import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyProfile, useUpdateProfile } from '@shared/api/users';
import { UserAvatar } from '@shared/components';
import styles from './EditProfile.module.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileData, isLoading: profileLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Обновляем форму при получении данных профиля
  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || '',
        bio: profileData.bio || '',
      });
    }
  }, [profileData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        fullName: formData.fullName,
        bio: formData.bio,
        profileImage: selectedImage || undefined,
      });

      navigate('/my-profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    navigate('/my-profile');
  };

  if (profileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Edit profile</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.avatarSection}>
          <UserAvatar
            src={previewUrl || profileData?.profileImage}
            alt={profileData?.fullName}
            size="large"
          />
          <div className={styles.avatarActions}>
            <h2>{profileData?.name}</h2>
            <button
              type="button"
              className={styles.changePhotoButton}
              onClick={() => fileInputRef.current?.click()}
            >
              New photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className={styles.hiddenInput}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Username
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="bio" className={styles.label}>
            About
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="About"
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
