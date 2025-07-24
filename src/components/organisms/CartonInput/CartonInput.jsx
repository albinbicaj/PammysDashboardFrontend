import React, { useEffect } from 'react';
import { BlackCheckbox } from '../../UI/BlackCheckbox';

export const CartonInput = ({
  cartonSize,
  setCartonSize,
  isEditable,
  setIsEditable,
  subActiveTab,
}) => {
  const handleCartonSizeChange = (e) => {
    const val = e.target.value;
    if (!isNaN(val) && Number(val) >= 0) {
      setCartonSize(val);
    } else if (val === '') {
      setCartonSize('');
    }
  };

  const increment = () => {
    if (isEditable) {
      setCartonSize((prev) => String(Number(prev || 0) + 1));
    }
  };

  const decrement = () => {
    if (isEditable) {
      setCartonSize((prev) => {
        const newVal = Math.max(0, Number(prev || 0) - 1);
        return String(newVal);
      });
    }
  };

  useEffect(() => {
    if (!isEditable) setCartonSize('50');
  }, [isEditable]);

  return (
    <div className="bg-white">
      <h3 className="mb-2 text-sm font-semibold text-gray-800">Kartongröße hinzufügen</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={!isEditable}
          className="h-8 w-8 rounded border border-gray-300 text-base text-gray-600 hover:bg-gray-100"
          type="button"
        >
          −
        </button>
        <input
          type="text"
          value={cartonSize}
          onChange={handleCartonSizeChange}
          disabled={!isEditable}
          className="w-40 rounded border border-gray-300 px-3 py-2 text-center text-sm focus:border-red-500 focus:outline-none"
        />
        <button
          onClick={increment}
          disabled={!isEditable}
          className="h-8 w-8 rounded border border-gray-300 text-base text-gray-600 hover:bg-gray-100"
          type="button"
        >
          +
        </button>
        {subActiveTab !== 1 && (
          <div className="flex items-center gap-2 text-sm">
            <BlackCheckbox checked={isEditable} onChange={(e) => setIsEditable(e.target.checked)} />
            <label>Benutzerdefinierte Kartongröße aktivieren</label>
          </div>
        )}
      </div>
    </div>
  );
};
