import React from 'react';

interface AvatarProps {
  src?: string;
  editable?: boolean;
  onUpload?: (file: File) => void;
}

const Avatar: React.FC<AvatarProps> = ({ src, editable, onUpload }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };
  return (
    <div className="avatar-wrapper">
      <img src={src || '/default-avatar.png'} alt="Avatar" className="avatar-img" />
      {editable && (
        <label className="avatar-upload">
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
          <span>Edit</span>
        </label>
      )}
    </div>
  );
};

export default Avatar;
