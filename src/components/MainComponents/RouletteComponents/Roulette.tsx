import { useState, useEffect, useContext } from 'react';
import RoulettePro, { RouletteType } from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';
import { nanoid } from 'nanoid';
import { rouletteSettings } from './utils/rouletteConfig';
import RouletteButton from './RouletteButton';
import { Case, CaseOpenResult } from '@/types/types';
import { Context, IStoreContext } from '@/store/StoreProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RouletteProps {
  caseData: Case;
}

const Roulette: React.FC<RouletteProps> = ({ caseData }) => {
  const { cases } = useContext(Context) as IStoreContext;
  const [settings, _setSettings] = useState(rouletteSettings);
  const [prizeList, setPrizeList] = useState<any[]>([]);
  const [start, setStart] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [_wonItemId, setWonItemId] = useState<number | null>(null);
  const [openResult, setOpenResult] = useState<CaseOpenResult | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!caseData?.case_items?.length) return;
    
    // Преобразование элементов кейса в формат для рулетки
    const casePrizes = caseData.case_items.map(item => ({
      id: String(item.id),
      image: item.media_file?.url || item.imageUrl || '/default-item-image.png',
      text: item.name,
      caseItem: item
    }));
    
    // Создаем список призов с дубликатами для эффекта рулетки
    const list = createPrizeList(casePrizes);
    setPrizeList(list);
  }, [caseData]);

  useEffect(() => {
    if (!prizeIndex || start) {
      return;
    }

    setStart(true);
  }, [prizeIndex, start]);

  useEffect(() => {
    if (!spinning || !prizeList.length) {
      return;
    }

    const prepare = async () => {
      try {
        // Открытие кейса через API
        const result = await cases.openCase(caseData.id);
        
        if (result) {
          // Сохраняем результат открытия
          setOpenResult(result);
          
          // Находим индекс выигрышного предмета в списке
          const wonItem = result.wonItem;
          setWonItemId(wonItem.id);
          
          // Находим выигрышный предмет в списке и вычисляем его индекс
          const itemIndex = findPrizeIndex(prizeList, wonItem.id);
          setPrizeIndex(itemIndex);
          setStart(false);
        } else {
          // В случае ошибки останавливаем вращение
          setSpinning(false);
        }
      } catch (error) {
        console.error('Ошибка при открытии кейса:', error);
        setSpinning(false);
      }
    };

    prepare();
  }, [spinning, prizeList, caseData.id, cases]);

  // Поиск индекса приза в списке по ID предмета кейса
  const findPrizeIndex = (prizes: any[], itemId: number): number => {
    // Поиск первого элемента в последней части массива (чтобы рулетка крутилась дольше)
    const prizesList = [...prizes];
    const lastSection = prizesList.slice(prizesList.length / 2);
    
    const index = lastSection.findIndex(
      prize => prize.caseItem && Number(prize.caseItem.id) === itemId
    );
    
    if (index === -1) {
      // Если не найден, возвращаем случайный индекс
      return Math.floor(Math.random() * lastSection.length) + prizesList.length / 2;
    }
    
    return index + prizesList.length / 2;
  };

  const handleStart = () => {
    setSpinning(true);
  };

  const handlePrizeDefined = () => {
    setSpinning(false);
    const winningPrize = prizeList[prizeIndex];
    console.log('Выигранный приз:', winningPrize);
    
    // Показываем диалог с выигрышем
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    
    // Сбрасываем состояние рулетки
    setOpenResult(null);
    setWonItemId(null);
    setPrizeIndex(0);
    setStart(false);
  };

  const type = settings.type.value;
  const stopInCenter = settings.stopInCenter.value;
  const withoutAnimation = settings.withoutAnimation.value;
  const prizesWithText = settings.prizesWithText.value;
  const hideCenterDelimiter = settings.hideCenterDelimiter.value;
  const spinningTime = +settings.spinningTime.value;

  const customPrizeItemRender = (item: any) => {
    return (
      <div className='roulette-pro-regular-prize-item'>
        <div className='roulette-pro-regular-prize-item-wrapper'>
          <div className='roulette-pro-regular-image-wrapper'>
            <img 
              src={item.image} 
              alt={item.text || 'Приз'} 
              className='roulette-pro-regular-prize-item-image' 
            />
          </div>
          <p className='roulette-pro-regular-prize-item-text'>
            {item.text}
          </p>
        </div>
      </div>
    );
  };

  // Функция для создания списка призов с дубликатами
  const createPrizeList = (prizeItems: any[]) => {
    const reproducedArray = [
      ...prizeItems,
      ...reproductionArray(prizeItems, prizeItems.length * 3),
      ...prizeItems,
      ...reproductionArray(prizeItems, prizeItems.length),
    ];

    const list = [...reproducedArray].map((item) => ({
      ...item,
      id: `${item.id}--${nanoid()}`,
    }));

    return list;
  };

  // Вспомогательная функция для создания массива с дубликатами
  const reproductionArray = (array: any[] = [], length = 0) => [
    ...Array(length)
      .fill('_')
      .map(() => array[Math.floor(Math.random() * array.length)]),
  ];

  // Рендер диалога с выигрышем
  const renderPrizeDialog = () => {
    if (!openResult) return null;

    const { wonItem, result } = openResult;
    
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Поздравляем!</DialogTitle>
            <DialogDescription>
              {result?.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center">
              <img 
                src={wonItem.media_file?.url || wonItem.imageUrl || '/default-item-image.png'} 
                alt={wonItem.name || ''} 
                className="w-32 h-32 object-contain mb-2" 
              />
              <p className="text-lg font-medium">{wonItem.name}</p>
              
              {wonItem.type === 'attempts' && (
                <p className="text-sm text-gray-500">+{wonItem.value} попыток</p>
              )}
              
              {wonItem.type === 'tickets' && (
                <p className="text-sm text-gray-500">+{wonItem.value} билетов</p>
              )}
              
              {wonItem.type === 'prize' && wonItem.prize && (
                <p className="text-sm text-gray-500">{wonItem.prize.name}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              onClick={handleCloseDialog} 
              className="w-full"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className='w-full h-full flex flex-col items-center gap-6'>
      <div className='top-40 w-full overflow-hidden'>
        <div className={`roulette ${type}`}>
          <RoulettePro
            type={type as RouletteType}
            prizes={prizeList}
            start={start}
            prizeIndex={prizeIndex}
            onPrizeDefined={handlePrizeDefined}
            spinningTime={spinningTime}
            classes={{
              wrapper: 'roulette-pro-wrapper-additional-styles',
            }}
            options={{ stopInCenter, withoutAnimation }}
            defaultDesignOptions={{ prizesWithText, hideCenterDelimiter }}
            prizeItemRenderFunction={customPrizeItemRender}
          />
        </div>
      </div>
      <RouletteButton onStart={handleStart} disabled={spinning} />
      
      {renderPrizeDialog()}
    </div>
  );
};

export default Roulette;