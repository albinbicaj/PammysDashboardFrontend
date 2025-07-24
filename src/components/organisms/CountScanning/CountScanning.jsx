import { useState } from 'react';
import { CartonInput } from '../CartonInput/CartonInput';
import { Tabs, Tab, Box } from '@mui/material';

export const CountScanning = ({
  cartonSize,
  setCartonSize,
  isEditable,
  setIsEditable,
  googleSheetName,
  setGoogleSheetName,
  subActiveTab,
  setSubActiveTab,
  logs,
}) => {
  const handleSubTabChange = (event, newValue) => {
    setSubActiveTab(newValue);
  };

  return (
    <div className="border bg-white p-5 shadow-sm">
      <Tabs
        className="flex w-full items-center border bg-white shadow"
        value={subActiveTab}
        onChange={handleSubTabChange}
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#4b5563' },
          '& .Mui-selected': { color: '#4b5563 !important' },
        }}
      >
        <Tab
          className="mr-10 w-max text-sm font-medium leading-5 focus:outline-none"
          label="Aktualisieren mit Scannen"
          value={0}
          sx={{ textTransform: 'none' }}
          disabled={subActiveTab !== 0 && logs.length > 0}
        />
        <Tab
          className="mr-10 w-max text-sm font-medium leading-5 focus:outline-none"
          label="Hinzufügen mit Scannen einer Variante"
          value={1}
          sx={{ textTransform: 'none' }}
          disabled={subActiveTab !== 1 && logs.length > 0}
        />
      </Tabs>
      <Box hidden={subActiveTab !== 0}>
        <div className="mt-4 grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="md:pr-2">
            <CartonInput
              cartonSize={cartonSize}
              setCartonSize={setCartonSize}
              isEditable={isEditable}
              setIsEditable={setIsEditable}
              subActiveTab={subActiveTab}
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
      </Box>
      <Box hidden={subActiveTab !== 1}>
        <div className="mt-4 grid grid-cols-1 gap-0 md:grid-cols-2">
          <div className="md:pr-2">
            <CartonInput
              cartonSize={'1'}
              setCartonSize={setCartonSize}
              isEditable={false}
              setIsEditable={setIsEditable}
              subActiveTab={subActiveTab}
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
      </Box>
    </div>
  );
};
