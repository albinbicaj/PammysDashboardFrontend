import { ForwardedRef, forwardRef, ReactElement } from 'react';

// mui
import { TextareaAutosize } from '@mui/material';
import Typography from '@mui/material/Typography';

// types

export const TextField = forwardRef(
  ({ className, fieldError, label, id, placeholder, ...rest }, ref) => (
    <div className="flex flex-col items-start justify-start px-2 py-3">
      {label && (
        <label className="comment-label mb-3 text-start font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <TextareaAutosize
        className={'width-available bg-white p-2  text-sm ' + className}
        ref={ref}
        {...rest}
        placeholder={placeholder}
      />

      {fieldError && (
        <p sx={{ color: 'red' }} variant="caption" display="block">
          {fieldError?.message}
        </p>
      )}
    </div>
  ),
);

TextField.displayName = 'TextField';
