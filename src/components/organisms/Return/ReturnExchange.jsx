import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from '../../atoms';

import { AddressStep } from './AddressStep';
import { useOrderContext } from '../../../context/Order.context';
import { MixedProductsStep } from './MixedProductsStep';
import { Step, StepLabel, Stepper } from '@mui/material';
import { grey } from '@mui/material/colors';

export const ReturnExchangeOrder = () => {
  const [currentStep, setStep] = useState(1);

  const navigate = useNavigate();
  const { orderContext } = useOrderContext();

  const showStep = (step) => {
    switch (step) {
      case 1:
        return <MixedProductsStep />;
      case 2:
        return <AddressStep productsType={'mixedProducts'} operationType={'Exchange / Return'} />;
    }
  };

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
  return (
    <div className="mt-12  flex flex-col  items-center">
      <>
        <Stepper
          className="stepper"
          orientation="horizontal"
          activeStep={currentStep - 1}
          sx={stepStyle}
        >
          <Step>
            <StepLabel></StepLabel>
          </Step>
          <Step>
            <StepLabel></StepLabel>
          </Step>
        </Stepper>

        {currentStep === 1 && (
          <Text className={'header-text mt-2 mb-2 text-2xl'}>Return | Exchange</Text>
        )}
        {showStep(currentStep)}
        <div className="mt-10 mb-10  flex items-center justify-around">
          <div className="mr-2">
            <button
              disabled={currentStep == 1}
              className={`${currentStep == 1 ? 'disabled' : ''} nav-button`}
              onClick={handlePreviousStep}
            >
              Vorheriger Schritt
            </button>
          </div>
          <div>
            <button
              onClick={currentStep === 1 ? handleNextStep : handleSubmit}
              // disabled={currentStep === 1 ? orderContext.productsForExchange.length === 0 : false}
              className={`${orderContext.products.length === 0 ? 'disabled' : ''} nav-button`}
              disabled={orderContext.products.length === 0}
            >
              {currentStep === 1 ? 'Nächster Schritt' : 'Einreichen'}
            </button>
          </div>
        </div>
      </>
    </div>
  );
};
