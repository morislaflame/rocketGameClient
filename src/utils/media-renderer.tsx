import React from "react";
import { getPlanetImg } from "@/utils/getPlanetImg";
import VisibleLottie from "./visible-lottie";

interface MediaRendererProps {
  mediaFile?: {
    url: string;
    mimeType: string;
  } | null;
  imageUrl?: string | null;
  animations: { [url: string]: Record<string, unknown> };
  name?: string;
  className?: string;
  loop?: boolean;
}

// Универсальный компонент для отображения медиа (изображения или Lottie-анимации)
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  mediaFile,
  imageUrl,
  animations,
  name = "",
  className = "",
  loop = false
}) => {
  const tokenImg = getPlanetImg();

  if (mediaFile) {
    const { url, mimeType } = mediaFile;
    
    if (mimeType === 'application/json' && animations[url]) {
      return (
        <VisibleLottie
          animationData={animations[url]}
          className={className}
          loop={loop}
        />
      );
    } else if (mimeType.startsWith('image/')) {
      return <img src={url} alt={name} className={className} />;
    }
  } 
  
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={className} />;
  }
  
  // Запасное изображение, если ничего не найдено
  return <img src={tokenImg} alt="Default image" className={className} />;
};

export default MediaRenderer;