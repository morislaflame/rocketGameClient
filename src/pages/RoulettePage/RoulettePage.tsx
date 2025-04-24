import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
import { nanoid } from 'nanoid';

import RoulettePro, { RouletteType } from 'react-roulette-pro';
import 'react-roulette-pro/dist/index.css';

// Импортируем настройки и функции из конфигурационного файла
import { 
  prizes, 
  rouletteSettings, 
  getDesignOptions, 
  isArrayOf, 
  getOptionsAsString, 
  API, 
  createPrizeList 
} from './utils/rouletteConfig';

import styles from './RoulettePage.module.css';

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'bottom-end',
//   showConfirmButton: false,
//   timer: 3000,
//   timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.addEventListener('mouseenter', Swal.stopTimer);
//     toast.addEventListener('mouseleave', Swal.resumeTimer);
//   },
// });

const RoulettePage = () => {
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

      const { id } = prizeList[newPrizeIndex];

      // Toast.fire({ icon: 'info', title: `Must win id - ${id}` });
    };

    prepare();
  }, [spinning, prizeList]);

  const handleStart = () => {
    setSpinning(true);
  };

  const handlePrizeDefined = () => {
    // Toast.fire({ icon: 'success', title: '🥳 Prize defined 🥳', timer: 1500 });

    setSpinning(false);
    const winningPrize = prizeList[prizeIndex];
    console.log('Выигранный приз:', winningPrize);
  };

  const type = settings.type.value;
  const design = settings.design.value;
  const soundWhileSpinning = settings.soundWhileSpinning.value;
  const stopInCenter = settings.stopInCenter.value;
  const withoutAnimation = settings.withoutAnimation.value;
  const prizesWithText = settings.prizesWithText.value;
  const hideCenterDelimiter = settings.hideCenterDelimiter.value;
  const spinningTime = +settings.spinningTime.value;

  const designOptions = getDesignOptions(settings);

  // Создаем строку настроек для отображения в UI
  const designOptionsString = getOptionsAsString(settings, design);
  const options = Object.entries({
    stopInCenter,
    withoutAnimation,
  });
  const availableOptions = options.filter((item) => Boolean(item[1]));

  const optionsString = availableOptions
    .map(([key, value]) => `${key}: ${value}, `)
    .join('');

  // Отображаем компонент рулетки с настройками из конфигурационного файла
  return (
    <div className='w-full h-full'>
      <div >
        <div className={`roulette ${type}`}>
          <RoulettePro
            type={type as RouletteType}
            prizes={prizeList}
            // design={design}
            // designOptions={designOptions}
            start={start}
            prizeIndex={prizeIndex}
            onPrizeDefined={handlePrizeDefined}
            spinningTime={spinningTime}
            classes={{
              wrapper: 'roulette-pro-wrapper-additional-styles',
            }}
            // soundWhileSpinning={soundWhileSpinning ? sound : null}
            options={{ stopInCenter, withoutAnimation }}
            defaultDesignOptions={{ prizesWithText, hideCenterDelimiter }}
          />
        </div>
        <div
          className={`roulette-actions ${
            // settings.replaceBottomArrowWithTopArrow.value ? 'down' : ''
            ''
          }`}
        >
          <div className="gray-block">
            <div className="button-wrapper">
              <button onClick={handleStart} className="spin-button" type="button">
                Spin
              </button>
            </div>
          </div>
        </div>

        {/* Для отладки можно показать текущие настройки */}
        
      </div>
    </div>
  );
};

export default RoulettePage;