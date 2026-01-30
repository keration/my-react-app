import type { FC } from 'react';
import Avatar from './Avatar';
import { useThemeContext } from '@/contexts/ThemeContext';

interface UserProfileProps {
  name: string;
  avatar: string;
  intro: string;
}

const UserProfile: FC<UserProfileProps> = ({ name, avatar, intro }) => {
  const { themeColor } = useThemeContext(); // 直接获取主题色
  const textStyle = themeColor === 'purple' ? 'text-pink-200' : 'text-white';

  return (
    <div className="max-w-sm w-full rounded-lg p-6 flex flex-col items-center text-white">
      <Avatar src={avatar} alt={name} />
      <h1 className={`text-2xl font-bold text-center mb-2 ${textStyle}`}>{name}</h1>
      <p className={`mb-6 text-center ${textStyle}`}>{intro}</p>
    </div>
  );
};

export default UserProfile;
