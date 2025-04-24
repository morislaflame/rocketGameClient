import { useState, useEffect } from 'react';

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

const Roulette = () => {
  // Используем настройки из конфигурационного файла
  const [settings, setSettings] = useState(rouletteSettings);
  const [prizeList, setPrizeList] = useState<any[]>([]);
  const [start, setStart] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  useEffect(() => {
    // Используем функцию из конфигурационного файла для создания списка призов
    const list = createPrizeList(prizes);
    setPrizeList(list);
  }, []);

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
      // Используем API из конфигурационного файла
      const newPrizeIndex = await API.getPrizeIndex(prizes.length);
      setPrizeIndex(newPrizeIndex);
      setStart(false);
    };

    prepare();
  }, [spinning, prizeList]);

  const handleStart = () => {
    setSpinning(true);
  };

  const handlePrizeDefined = () => {

    setSpinning(false);
    const winningPrize = prizeList[prizeIndex];
    console.log('Выигранный приз:', winningPrize);
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