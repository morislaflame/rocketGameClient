import React from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Case, CaseItem } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";

interface CaseContentsProps {
  caseData: Case;
}

const CaseContents: React.FC<CaseContentsProps> = ({ caseData }) => {
  if (!caseData || !caseData.case_items || caseData.case_items.length === 0) {
    return null;
  }

  // Сортируем предметы по вероятности (от самой высокой к самой низкой)
  const sortedItems = [...caseData.case_items].sort((a, b) => b.probability - a.probability);

  // Функция для рендеринга карточки предмета
  const renderItemCard = (item: CaseItem) => {
    // Определяем URL изображения предмета
    const imageUrl = item.media_file?.url || item.imageUrl || '/default-item-image.png';
    
    // Определяем метку предмета в зависимости от его типа
    let typeLabel = '';
    let valueLabel = '';
    
    switch (item.type) {
      case 'attempts':
        typeLabel = 'Attempts';
        valueLabel = `+${item.value}`;
        break;
      case 'tickets':
        typeLabel = 'Tickets';
        valueLabel = `+${item.value}`;
        break;
      case 'prize':
        typeLabel = 'Gift';
        valueLabel = item.prize?.name || '';
        break;
      default:
        typeLabel = item.type;
    }

    return (
      <Card key={item.id} className="flex-shrink-0 w-36 mx-2 overflow-hidden">
        <CardContent className="p-2">
          <div className="relative">
            <img 
              src={imageUrl}
              alt={item.name || ''}
              className="w-10 h-10 object-contain mb-2"
            />
            <div className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-bl">
              {item.probability}%
            </div>
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
      <ScrollArea className=" whitespace-nowrap">
        <div className="flex pb-4">
          {sortedItems.map(renderItemCard)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CaseContents;