import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressStep } from '../Return/AddressStep';
import { ExchangeProductsStep } from './ExchangeProductsStep';
import { Stepper, StepLabel, Step, Button } from '@mui/material';
import { Text } from '../../atoms';
import { useOrderContext } from '../../../context/Order.context';
import { grey } from '@mui/material/colors';
export const ExchangeOrder = () => {
  const { orderContext } = useOrderContext();
  const navigate = useNavigate();
  const [currentStep, setStep] = useState(1);

  const handleNextStep = () => {
    setStep(currentStep + 1);
  };
  const handlePreviousStep = () => {
    setStep(currentStep - 1);
  };
  const handleSubmit = () => {};
  const stepStyle = {
    '& .Mui-active': {
      '&.MuiStepIcon-root': {
        color: grey[900],
      },
    },
    '& .Mui-completed': {
      '&.MuiStepIcon-root': {
        color: grey[900],
      },
    },
  };
  const showStep = (step) => {
    switch (step) {
      case 1:
        return <ExchangeProductsStep />;
      case 2:
        return <AddressStep productsType={'productsForExchange'} operationType={'Exchange'} />;
    }
  };
  return (
    <div className="mt-12 flex flex-col items-center">
      {currentStep === 1 && <Text className={'header-text mt-2 mb-2 text-2xl'}>Exchange</Text>}
      {showStep(currentStep)}
      <div className="mt-10 mb-10   flex items-center justify-center">
        <div className="mr-2">
          <button
            className={`${currentStep == 1 ? 'disabled' : ''} nav-button`}
            disabled={currentStep == 1}
            onClick={handlePreviousStep}
          >
            Vorheriger Schritt
          </button>
        </div>
        <div>
          <button
            onClick={currentStep === 1 ? handleNextStep : handleSubmit}
            disabled={currentStep === 1 ? orderContext.productsForExchange.length === 0 : false}
            className={`${
              orderContext.productsForExchange.length === 0 ? 'disabled' : ''
            } nav-button`}
          >
            {currentStep === 1 ? 'Nächster Schritt' : 'Einreichen'}
          </button>
        </div>
      </div>
    </div>
  );
};
