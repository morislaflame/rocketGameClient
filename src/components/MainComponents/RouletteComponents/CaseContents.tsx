import React, { useMemo, useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Case } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";
import tonImg from "@/assets/TonIcon.svg";
import Lottie from "lottie-react";

interface CaseContentsProps {
  caseData: Case;
}

const CaseContents: React.FC<CaseContentsProps> = ({ caseData }) => {
  if (!caseData || !caseData.case_items || caseData.case_items.length === 0) {
    return null;
  }

  // Состояние для хранения JSON-анимаций
  const [animations, setAnimations] = useState<{ [url: string]: Record<string, unknown> }>({});

  // Загружаем анимации для призов с JSON-медиа
  useEffect(() => {
    const loadAnimations = async () => {
      const newAnimations: { [url: string]: Record<string, unknown> } = {};
      for (const item of caseData.case_items || []) {
        if (item.type === 'prize' && item.prize?.media_file) {
          const mediaFile = item.prize.media_file;
          if (mediaFile.mimeType === 'application/json' && !animations[mediaFile.url]) {
            try {
              const response = await fetch(mediaFile.url);
              const data = await response.json();
              newAnimations[mediaFile.url] = data;
            } catch (error) {
              console.error(`Ошибка загрузки анимации ${mediaFile.url}:`, error);
            }
          }
        }
      }
      if (Object.keys(newAnimations).length > 0) {
        setAnimations(prev => ({ ...prev, ...newAnimations }));
      }
    };
    
    loadAnimations();
  }, [caseData.case_items]);

  // Группируем предметы по типу и обрабатываем для отображения
  const displayItems = useMemo(() => {
    // Ensure case_items exists
    if (!caseData.case_items) return [];
    
    // Сортируем предметы по вероятности (от самой высокой к самой низкой)
    const sortedItems = [...caseData.case_items].sort((a, b) => b.probability - a.probability);
    
    // Получаем все уникальные типы предметов
    const hasAttempts = sortedItems.some(item => item.type === 'attempts');
    const hasTickets = sortedItems.some(item => item.type === 'tickets');
    
    // Фильтруем только призы
    const prizeItems = sortedItems.filter(item => item.type === 'prize');
    
    // Результирующий массив для отображения
    const result = [];
    
    // Добавляем все призы ПЕРВЫМИ
    result.push(...prizeItems);
    
    // Добавляем обобщенный элемент для тикетов
    if (hasTickets) {
      // Находим элемент с тикетами для изображения
      const ticketsItem = sortedItems.find(item => item.type === 'tickets');
      if (ticketsItem) {
        result.push({
          id: 'tickets-group',
          type: 'tickets',
          name: 'Tickets',
          imageUrl: ticketsItem.media_file?.url || ticketsItem.imageUrl,
          media_file: ticketsItem.media_file,
          isGrouped: true
        });
      }
    }
    
    // Добавляем обобщенный элемент для попыток
    if (hasAttempts) {
      // Находим элемент с попытками для изображения
      const attemptsItem = sortedItems.find(item => item.type === 'attempts');
      if (attemptsItem) {
        result.push({
          id: 'attempts-group',
          type: 'attempts',
          name: 'Attempts',
          imageUrl: attemptsItem.media_file?.url || attemptsItem.imageUrl,
          media_file: attemptsItem.media_file,
          isGrouped: true
        });
      }
    }
    
    return result;
  }, [caseData.case_items]);

  // Функция для отображения медиа предмета
  const renderItemMedia = (item: any) => {
    // Для призов с JSON анимацией
    if (item.type === 'prize' && item.prize?.media_file) {
      const mediaFile = item.prize.media_file;
      if (mediaFile.mimeType === 'application/json' && animations[mediaFile.url]) {
        return (
          <Lottie
            animationData={animations[mediaFile.url]}
            loop={false}
            autoplay={true}
            className="w-10 h-10 object-contain mb-2"
          />
        );
      }
    }
    
    // Для обычных изображений
    const imageUrl = item.media_file?.url || item.imageUrl || 
                    (item.prize?.media_file?.url) || 
                    item.prize?.imageUrl || 
                    '/default-item-image.png';
    
    return (
      <img 
        src={imageUrl}
        alt={item.name || ''}
        className="w-10 h-10 object-contain mb-2"
      />
    );
  };

  // Функция для рендеринга карточки предмета
  const renderItemCard = (item: any) => {
    // Определяем метку предмета в зависимости от его типа
    let typeLabel = '';
    let valueLabel = '';
    
    switch (item.type) {
      case 'attempts':
        typeLabel = 'Rocket launches';
        valueLabel = item.isGrouped ? '' : `+${item.value}`;
        break;
      case 'tickets':
        typeLabel = 'Tickets for raffle';
        valueLabel = item.isGrouped ? '' : `+${item.value}`;
        break;
      case 'prize':
        typeLabel = 'Gift';
        valueLabel = item.prize?.name || '';
        break;
      default:
        typeLabel = item.type;
    }
    
    // Проверяем, является ли предмет призом с ценой в TON
    const hasTonPrice = item.type === 'prize' && item.prize?.tonPrice !== null && item.prize?.tonPrice !== undefined;
    
    return (
      <Card key={item.id} className="flex-shrink-0 w-36 mx-2 overflow-hidden">
        <CardContent className="p-2">
          <div className="relative">
            {renderItemMedia(item)}
            {hasTonPrice && (
              <div className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-bl flex items-center">
                <span>{Number(item.prize?.tonPrice).toFixed(1)}</span>
                <img src={tonImg} alt="TON" className="w-3 h-3 ml-1" />
              </div>
            )}
          </div>
          <div className="text-sm font-medium truncate">{item.name}</div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{typeLabel}</span>
            <span className="text-xs font-medium">{valueLabel}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <h3 className="font-medium text-lg mb-2">Case contents</h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex pb-4">
          {displayItems.map(renderItemCard)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CaseContents;