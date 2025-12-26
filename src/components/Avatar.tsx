// src/components/Avatar.tsx
import type { FC } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: FC<AvatarProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} className="w-24 h-24 rounded-full border-4 border-white/50" />;
};

export default Avatar;
