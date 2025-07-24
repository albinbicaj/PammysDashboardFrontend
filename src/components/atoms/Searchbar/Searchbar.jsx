import React, { useEffect, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchIcon } from '../SearchIcon/SearchIcon';
export const Searchbar = ({ updateOrderNumber, currentOrderNumber }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    const newOrderNumber = event.target.value;
    setSearchValue(newOrderNumber);
  };
  const handleSearch = () => {
    navigate(`/dashboard/order?return_id=` + encodeURIComponent(searchValue));
    setSearchValue('');
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Call your function here that needs to be triggered on Enter press
      // For example, you can trigger a search function
      handleSearch(event.target.value);
    }
  };

  return (
    <div className="flex items-center   rounded-full border-2">
      <div className="search-icon-wrapper cursor-pointer px-4 py-2">
        <SearchIcon />
      </div>
      <InputBase
        className="searchbar-input block w-full focus:outline-none"
        placeholder="Retoure suchen"
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleSearchChange}
        value={searchValue}
        onKeyDown={handleKeyPress}
        classes={{
          input: 'search-input', // You can add a custom class to the input for additional styling
          placeholder: 'search-placeholder', // Add a custom class for styling the placeholder
          placeholderTypography: 'placeholder-text', // Add a custom class for
        }}
      />
      <div className="p-2 ">
        <div
          className="cursor-pointer rounded-full border px-2 py-0.5 text-xs text-gray-400"
          onClick={() => handleSearch(searchValue)}
        >
          Enter
        </div>
      </div>
    </div>
  );
};
