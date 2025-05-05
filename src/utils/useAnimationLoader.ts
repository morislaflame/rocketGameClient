import { useState, useEffect, useContext } from 'react';
import { Context, IStoreContext } from '../store/StoreProvider';

export type AnimationsObject = { [url: string]: Record<string, unknown> };

interface MediaFile {
  url: string;
  mimeType: string;
}

type MediaExtractor<T> = (item: T) => MediaFile | undefined | null;

// Улучшенный хук для загрузки Lottie анимаций
export function useAnimationLoader<T>(
  items: Array<T> | null | undefined,
  extractor?: MediaExtractor<T>,
  dependencies: any[] = []
): [AnimationsObject, boolean, () => void] {
  const { animation } = useContext(Context) as IStoreContext;
  const [isLoading, setIsLoading] = useState(false);
  const [loadCounter, setLoadCounter] = useState(0);


  // Извлечение медиа из элемента (дефолтная функция)
  const defaultExtractor = (item: any): MediaFile | undefined | null => {
    if (!item) return undefined;
    
    return 'prize' in item && item.prize 
      ? item.prize.media_file 
      : 'raffle_prize' in item && item.raffle_prize
        ? item.raffle_prize.media_file
        : 'media_file' in item 
          ? item.media_file
          : undefined;
  };

  const getMediaFile = extractor || defaultExtractor;

  useEffect(() => {
    const loadAnimations = async () => {
      if (!items || items.length === 0) return;
      
      setIsLoading(true);
      
      for (const item of items) {
        const mediaFile = getMediaFile(item);
            
        if (mediaFile && mediaFile.mimeType === 'application/json') {
          // Проверяем, есть ли анимация в кэше
          if (!animation.hasAnimation(mediaFile.url)) {
            try {
              const response = await fetch(mediaFile.url);
              const data = await response.json();
              animation.setAnimation(mediaFile.url, data);
            } catch (error) {
              console.error(`Ошибка загрузки анимации ${mediaFile.url}:`, error);
            }
          }
        }
      }
      
      setIsLoading(false);
    };
    
    loadAnimations();
  }, [items, loadCounter, animation, ...dependencies]);

  return [animation.animations, isLoading, () => setLoadCounter(c => c + 1)];
}