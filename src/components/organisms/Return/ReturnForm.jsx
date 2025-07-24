import React, { useState } from 'react';
import { Title, Text } from '../../atoms';
import { useTranslation } from 'react-i18next';
import { IconInfoCircle } from '@tabler/icons-react';

export const ReturnForm = ({
  email,
  setEmail,
  orderNumber,
  setOrderNumber,
  fetchOrderDetails,
  emailError,
  setEmailError,
  orderNumberError,
  setOrderNumberError,
}) => {
  const buttonDisabled = !orderNumber || orderNumber.length == 0 || !email || email.length == 0;
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();
  const isValidOrderNumber = (orderNumber) => {
    const orderNumberRegex = /^#\d+$/;
    const isValid = orderNumberRegex.test(orderNumber);

    // Update the order number error state
    setOrderNumberError(
      isValid
        ? ''
        : 'Die Bestellnummer sollte mit # beginnen und nur Zahlen enthalten, z. B. #1001',
    );

    return isValid;
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    // Update the email error state
    setEmailError(
      isValid
        ? ''
        : 'Bitte versuch #Deine-Bestellnummer und deine E-Mail-Adresse erneut einzugeben. Bitte verwende exakt die gleiche E-Mail-Adresse, mit der du die Bestellung getätigt hast. Achte dabei ebenfalls auf die Groß- und Kleinschreibung, die Zahlen und die Satzzeichen.',
    );

    return isValid;
  };
  const handleShowError = (e) => {
    e.preventDefault();
    setShowError(true);
  };
  return (
    <div className="mt-4 flex flex-col items-center justify-start px-2 pb-2">
      <div className="flex items-center">
        <div className="mb-5 mt-5 flex flex-col items-center">
          <Title className="mb-2 text-2xl font-bold">{t('loginForm.title')}</Title>
          <Text className={' max-w-[300px] text-gray-500'}>{t('loginForm.text')} </Text>
          <Text className={' pt-1 text-[13px] text-gray-500'}>{t('loginForm.subText')} </Text>
        </div>
      </div>
      <>
        <form className="flex flex-col items-center pb-12 pt-12">
          <input
            required
            type="text"
            placeholder={t('loginForm.inputPlacehoderText')}
            onChange={(e) => {
              setOrderNumber(e);
              isValidOrderNumber(e.target.value);
            }}
            value={orderNumber}
            className={
              'return-order-input mb-3 ' + (showError && orderNumberError ? 'border-danger' : '')
            }
          />
          {/* {showError && orderNumberError && (
            <div className="error-message w-4/6 text-red-500">{orderNumberError}</div>
          )} */}

          <input
            required
            name="email"
            type="email"
            placeholder={t('loginForm.inputPlacehoderEmail')}
            onChange={(e) => {
              setEmail(e);
              isValidEmail(e.target.value);
            }}
            value={email}
            className={
              'return-email-input mb-3 ' + (showError && emailError ? 'border-danger' : '')
            }
            autoComplete="email"
          />
          {/* <div className="mb-3 flex max-w-[360px] gap-1">
            <IconInfoCircle size={13} className="mt-0.5" />
            <p className={'  text-left text-xs text-gray-500'}>{t('loginForm.subText')} </p>
          </div> */}
          {/* {showError && emailError && <div className="text-red-500">{emailError}</div>} */}
          <button
            className={`start-button duration-300 ${buttonDisabled ? 'disabled' : ''} `}
            disabled={buttonDisabled}
            onClick={
              emailError.length > 0 && orderNumberError.length > 0
                ? handleShowError
                : fetchOrderDetails
            }
          >
            {t('loginForm.submitButtonText')}
          </button>
        </form>
        <a href="https://pammys.com/pages/widerrufsbelehrung" target="_blank">
          {t('loginForm.linkText')}
        </a>
      </>
    </div>
  );
};
