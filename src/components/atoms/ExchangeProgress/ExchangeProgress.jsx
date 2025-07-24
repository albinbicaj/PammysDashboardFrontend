import React, { useState } from 'react';
import { Stepper, StepLabel, Step } from '@mui/material';
import { grey } from '@mui/material/colors';
export const ExchangeProgress = ({ activeStep }) => {
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
    <div className="border-2">
      <Stepper
        className="vertical-stepper"
        orientation="vertical"
        activeStep={activeStep}
        sx={stepStyle}
      >
        <Step>
          <StepLabel>Exchange request raised</StepLabel>
        </Step>
        <Step>
          <StepLabel>In progress</StepLabel>
        </Step>
        <Step>
          <StepLabel>Approved</StepLabel>
        </Step>
        <Step>
          <StepLabel>Refunded</StepLabel>
        </Step>
        <Step>
          <StepLabel>Rejected</StepLabel>
        </Step>
        <Step>
          <StepLabel>Canceled</StepLabel>
        </Step>
      </Stepper>
    </div>
  );
};
