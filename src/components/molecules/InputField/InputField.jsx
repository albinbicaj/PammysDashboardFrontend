import { ForwardedRef, forwardRef, ReactElement } from 'react';

// mui
import { OutlinedInput } from '@mui/material';
import Typography from '@mui/material/Typography';

// types

export const InputField = forwardRef(({ fieldError, label, id, variant, ...rest }, ref) => (
  <div className="my-3 flex w-full flex-col items-start justify-start">
    {label && <label htmlFor={id}>{label}</label>}
    <OutlinedInput
      sx={{ width: '100%', my: 1 }}
      ref={ref}
      error={!!fieldError}
      {...rest}
      style={{
        height: '45px',
      }}
    />

    {fieldError && (
      <p sx={{ color: 'red' }} variant="caption" display="block">
        {fieldError?.message}
      </p>
    )}
  </div>
));

InputField.displayName = 'InputField';
