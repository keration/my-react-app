// src/components/Avatar.tsx
interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} className="w-24 h-24 rounded-full border-4 border-white/50" />;
};

export default Avatar;
