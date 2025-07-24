import React, { forwardRef } from 'react';
import { Select } from '@mui/material';
import Typography from '@mui/material/Typography';

export const SelectField = forwardRef(
  ({ fieldError, onSelect, value, label, id, options, ...rest }, ref) => {
    return (
      <div className="my-3 flex w-full flex-col items-start justify-start">
        {label && <label htmlFor={id}>{label}</label>}
        <Select
          onSelect={onSelect}
          sx={{ width: '100%', my: 1 }}
          ref={ref}
          error={!!fieldError}
          {...rest}
          value={value}
        >
          {options.map((option) => (
            <option
              className="cursor-pointer hover:bg-blue-500 hover:text-white"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </Select>

        {fieldError && (
          <p sx={{ color: 'red' }} variant="caption" display="block">
            {fieldError?.message}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
