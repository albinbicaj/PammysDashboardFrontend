import React from 'react';
import { Button } from '@mui/material';

export const CustomButton = ({ onClick, variant, text, className, ...res }) => {
  return (
    <div>
      <Button
        style={{ width: '120%', height: '45px' }}
        className={className}
        onClick={onClick}
        variant={variant}
        {...res}
      >
        {text}
      </Button>
    </div>
  );
};
