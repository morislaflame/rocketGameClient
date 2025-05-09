import React, { useMemo } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Case } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";
import tonImg from "@/assets/TonIcon.svg";
import { MediaRenderer } from "@/utils/media-renderer";
import { useAnimationLoader } from '@/utils/useAnimationLoader';
import { useTranslate } from '@/utils/useTranslate';
import { observer } from 'mobx-react-lite';

interface CaseContentsProps {
  caseData: Case;
}

const CaseContents: React.FC<CaseContentsProps> = observer(({ caseData }) => {
  const { t } = useTranslate();
  if (!caseData || !caseData.case_items || caseData.case_items.length === 0) {
    return null;
  }

  // Используем новый хук для загрузки анимаций
  const [animations] = useAnimationLoader(
    caseData.case_items,
    (item) => item.type === 'prize' && item.prize?.media_file ? item.prize.media_file : item.media_file,
    [caseData.id]
  );

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

  // Функция для отображения медиа предмета с использованием MediaRenderer
  const renderItemMedia = (item: any) => {
    // Определяем media_file для отображения
    const mediaFile = item.type === 'prize' && item.prize?.media_file 
      ? item.prize.media_file 
      : item.media_file;
    
    const imageUrl = item.type === 'prize' && item.prize?.imageUrl 
      ? item.prize.imageUrl 
      : item.imageUrl;
    
    const name = item.name || (item.prize?.name || '');
    
    return (
      <MediaRenderer
        mediaFile={mediaFile}
        imageUrl={imageUrl}
        animations={animations}
        name={name}
        className="w-10 h-10 object-contain mb-2"
        loop={false}
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
        typeLabel = t('rocket_launches');
        valueLabel = item.isGrouped ? '' : `+${item.value}`;
        break;
      case 'tickets':
        typeLabel = t('tickets_for_raffle');
        valueLabel = item.isGrouped ? '' : `+${item.value}`;
        break;
      case 'prize':
        typeLabel = t('gift');
        valueLabel = item.prize?.name || '';
        break;
      default:
        typeLabel = item.type;
    }
    
    // Проверяем, является ли предмет призом с ценой в TON
    const hasTonPrice = item.type === 'prize' && item.prize?.tonPrice !== null && item.prize?.tonPrice !== undefined;
    
    return (
      <Card key={item.id} className="flex-shrink-0 w-36 mx-2 overflow-hidden bg-[#141414]">
        <CardContent className="p-2">
          <div className="relative">
            {renderItemMedia(item)}
            {hasTonPrice && (
              <div className="absolute top-0 right-0 text-white text-xs px-1 rounded-bl flex items-center">
                <span>{Number(item.prize?.tonPrice).toFixed(1)}</span>
                <img src={tonImg} alt="TON" className="w-3 h-3 ml-1" />
              </div>
            )}
          </div>
          <div className="text-sm font-medium truncate">{item.name}</div>
          <div className="flex items-center justify-between flex-wrap">
            <span className="text-xs text-muted-foreground">{typeLabel}</span>
            {/* <span className="text-xs font-medium">{valueLabel}</span> */}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <h3 className="font-medium text-lg mb-2">Case contents</h3>
      <ScrollArea className="w-[89vw] whitespace-nowrap">
        <div className="flex pb-4">
          {displayItems.map(renderItemCard)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
});

export default CaseContents;