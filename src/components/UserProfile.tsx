import React from 'react';
import Avatar from './Avatar';

interface UserProfileProps {
  name: string;
  avatar: string;
  intro: string;
}
const UserProfile: React.FC<UserProfileProps> = ({ name, avatar, intro }) => {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <Avatar src={avatar} alt="用户头像" />
      <h1 className="text-2xl font-bold text-center mb-2">{name}</h1>
      <p className="mb-6 text-center">{intro}</p>
    </div>
  );
};
export default UserProfile;
