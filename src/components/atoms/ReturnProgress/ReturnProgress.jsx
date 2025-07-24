import React, { useState } from 'react';
import { Stepper, StepLabel, Step } from '@mui/material';
import { grey } from '@mui/material/colors';
import { stepMap } from '../../../data/step';
import { StatusEnum } from '../../../enums/Status.enum';
export const ReturnProgress = ({ activeStep }) => {
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
    <div className="progress">
      <Stepper
        className="vertical-stepper"
        orientation="vertical"
        activeStep={stepMap[activeStep]}
        sx={stepStyle}
      >
        <Step>
          <StepLabel>Rücksendeantrag gestellt</StepLabel>
        </Step>
        <Step>
          <StepLabel>In Arbeit</StepLabel>
        </Step>
        {activeStep === StatusEnum.APPROVED && (
          <Step>
            <StepLabel>Genehmigt</StepLabel>
          </Step>
        )}
        {activeStep === StatusEnum.REFUNDED && (
          <Step>
            <StepLabel>Erstattet</StepLabel>
          </Step>
        )}
        {activeStep == StatusEnum.REJECTED && (
          <Step>
            <StepLabel>Abgelehnt</StepLabel>
          </Step>
        )}
      </Stepper>
    </div>
  );
};
