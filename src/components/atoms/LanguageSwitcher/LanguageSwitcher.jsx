import React, { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import { PammysLoading } from '../PammysLoading/PammysLoading';
import { IconX } from '@tabler/icons-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [menu, setMenu] = useState(false);

  const handleClose = () => {
    setMenu(false);
  };

  const languageOptions = [
    {
      value: 'de',
      flagImg: 'https://flagcdn.com/w20/de.png',
      name: 'Deutsch',
    },
    {
      value: 'en',
      flagImg: 'https://flagcdn.com/w20/gb.png',
      name: 'English',
    },
  ];

  const changeLanguageBtn = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const currentLang = languageOptions.find((option) => option.value === i18n.language);

  return (
    <>
      <button
        className="flex w-full items-center justify-center gap-2 border border-t-0 bg-white px-4 py-2"
        onClick={() => setMenu(true)}
      >
        <div>
          <img src={currentLang.flagImg} />
        </div>
        {currentLang.name}
      </button>
      <div
        className={`fixed inset-0 left-0 backdrop-blur-sm transition-opacity duration-150 ${menu === true ? 'opacity-100' : 'pointer-events-none opacity-0'} item  flex items-center justify-center  bg-gray-400 bg-opacity-75 p-4`}
        onClick={() => handleClose()}
      >
        <div
          className="flex max-h-[800px] min-w-[300px] max-w-[600px] flex-col gap-3 rounded-xl bg-white p-4 shadow-xl hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            // handleChildClick();
          }}
        >
          <div className="flex items-center justify-between pb-3">
            <p className="font-bold"> {t('Wählen Sie Ihre Sprache')}</p>
            <div onClick={() => setMenu(false)}>
              <IconX />
            </div>
          </div>
          {languageOptions.map((lg) => (
            <button
              key={`96F5M3MPZeBtYVru${lg.value}`}
              className={`btn flex items-center gap-2  duration-150 ${lg.value === i18n.language ? 'bg-slate-100' : ''}`}
              onClick={() => changeLanguageBtn(lg.value)}
            >
              <div>
                <img src={lg.flagImg} />
              </div>
              {lg.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LanguageSwitcher;
