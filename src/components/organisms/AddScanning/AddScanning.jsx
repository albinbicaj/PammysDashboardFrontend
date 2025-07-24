import React from 'react';
import { CartonInput } from '../CartonInput/CartonInput';

export const AddScanning = ({
  cartonSize,
  setCartonSize,
  isEditable,
  setIsEditable,
  googleSheetName,
  setGoogleSheetName,
}) => {
  return (
    <div className="border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="md:pr-2">
          <CartonInput
            cartonSize={cartonSize}
            setCartonSize={setCartonSize}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
          />
        </div>
        <div className="md:pl-2">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">
            Name des Google Sheets <span className="text-red-500">*</span>
          </h3>
          <input
            type="text"
            value={googleSheetName}
            onChange={(e) => setGoogleSheetName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            placeholder="Google Sheet Name eingeben"
            required
          />
        </div>
      </div>
    </div>
  );
};
