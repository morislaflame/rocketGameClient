import { useState, useEffect, useContext } from 'react';

import RoulettePro, { RouletteType } from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';

// Импортируем настройки и функции из конфигурационного файла
import { 
  prizes, 
  rouletteSettings, 
  API, 
  createPrizeList 
} from './utils/rouletteConfig';

// Импортируем новый компонент RouletteButton
import RouletteButton from './RouletteButton';
import { Case } from '@/types/types';
import { Context, IStoreContext } from '@/store/StoreProvider';

interface RouletteProps {
  caseData?: Case;
}

const Roulette: React.FC<RouletteProps> = ({ caseData }) => {
  const { cases } = useContext(Context) as IStoreContext;
  
  // Используем настройки из конфигурационного файла
  const [settings, setSettings] = useState(rouletteSettings);
  const [prizeList, setPrizeList] = useState<any[]>([]);
  const [start, setStart] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  useEffect(() => {
    // Если есть данные о кейсе, используем их, иначе дефолтные призы
    if (caseData && caseData.case_items && caseData.case_items.length > 0) {
      // Конвертируем элементы кейса в формат призов
      const casePrizes = caseData.case_items.map(item => ({
        id: `${item.id}`,
        image: item.media_file?.url || item.imageUrl || (item.prize?.media_file?.url || item.prize?.imageUrl) || '/default-item-image.png',
        text: item.name || 'Prize'
      }));
      
      // Используем функцию из конфигурационного файла для создания списка призов
      const list = createPrizeList(casePrizes);
      setPrizeList(list);
    } else {
      // Используем дефолтные призы
      const list = createPrizeList(prizes);
      setPrizeList(list);
    }
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
      // Если есть данные о кейсе, используем API для открытия кейса
      if (caseData) {
        try {
          const result = await cases.openCase(caseData.id);
          if (result) {
            // Найдем индекс выигранного предмета в списке
            const winningItemId = result.wonItem.id;
            
            // Находим все вхождения выигранного предмета в списке
            const itemIndices = prizeList.map((prize, index) => 
              prize.id.split('--')[0] === `${winningItemId}` ? index : -1
            ).filter(index => index !== -1);
            
            if (itemIndices.length > 0) {
              // Выбираем случайное вхождение из найденных
              const randomIndex = Math.floor(Math.random() * itemIndices.length);
              const selectedIndex = itemIndices[randomIndex];
              
              // Смещаем индекс для лучшей анимации
              const offsetIndex = selectedIndex + (prizeList.length / 4);
              
              setPrizeIndex(offsetIndex);
            } else {
              // Если не нашли приз в списке, используем случайный
              const newPrizeIndex = await API.getPrizeIndex(prizeList.length / 4);
              setPrizeIndex(newPrizeIndex);
            }
          } else {
            // Если ошибка, используем случайный индекс
            const newPrizeIndex = await API.getPrizeIndex(prizeList.length / 4);
            setPrizeIndex(newPrizeIndex);
            console.error("Failed to open case");
          }
        } catch (error) {
          console.error("Error opening case:", error);
          // В случае ошибки, используем случайный индекс
          const newPrizeIndex = await API.getPrizeIndex(prizeList.length / 4);
          setPrizeIndex(newPrizeIndex);
        }
      } else {
        // Используем API из конфигурационного файла для дефолтных призов
        const newPrizeIndex = await API.getPrizeIndex(prizes.length);
        setPrizeIndex(newPrizeIndex);
      }
      
      setStart(false);
    };

    prepare();
  }, [spinning, prizeList, caseData, cases]);

  const handleStart = () => {
    setSpinning(true);
  };

  const handlePrizeDefined = () => {
    setSpinning(false);
    
    // Получаем выигранный приз
    const winningPrize = prizeList[prizeIndex];
    console.log('Выигранный приз:', winningPrize);
    
    // Если был открыт кейс, выводим сообщение в консоль
    if (caseData) {
      console.log(`You won: ${winningPrize.text}`);
    }
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


  // Отображаем компонент рулетки с настройками из конфигурационного файла
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
    </div>
  );
};

export default Roulette;