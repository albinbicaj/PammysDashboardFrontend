import React from 'react';

import { IoSearch } from 'react-icons/io5';
import { MdClear } from 'react-icons/md';
export const FilterSearchBar = ({ searchClick, searchText, updateSearchText, placeholder }) => {
  const handleSearchChange = (event) => {
    updateSearchText(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchClick();
    }
  };
  return (
    <div className="input flex w-[340px] items-center gap-2 border px-3 py-2">
      <div className="filter-search-icon-wrapper cursor-pointer" onClick={searchClick}>
        <IoSearch className="text-gray-400" size={18} />
      </div>
      <input
        value={searchText}
        onChange={handleSearchChange}
        className="block w-full  focus:outline-none"
        placeholder={placeholder}
        onKeyDown={handleInputKeyDown}
      />
      <div
        className={`duration-200 ${searchText.length > 0 ? 'cursor-pointer opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => {
          updateSearchText('');
        }}
      >
        <MdClear size={18} />
      </div>
    </div>
  );
};
