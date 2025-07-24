import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { TiDelete } from 'react-icons/ti';

const FiltersSearchBar = ({ useStateText = '', updateFilters = () => {} }) => {
  const [searchText, setSearchText] = useState(useStateText);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
    updateFilters({ searchText: searchText, page: 1 }); // Apply the filters after submit
    setSearchText('');
  };
  const handleClear = () => {
    setSearchText('');
    updateFilters({ searchText: '' });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center gap-3 ">
          <input
            type="text"
            placeholder="Suchbegriff"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            // onKeyDown={handleKeyPress}
            className="min-w-[350px] rounded-md border-2 py-2 pl-10 pr-3 outline-none duration-150 focus:border-accent "
          />
          <IoSearch className="absolute left-3 text-gray-400" size={20} />
          <button
            type="button"
            className="rounded-md border bg-slate-100 px-3 py-2 duration-150 hover:bg-slate-200  active:scale-[0.95]"
            onClick={handleClear}
          >
            <TiDelete size={24} className="text-gray-700" />
          </button>
          <button
            type="submit"
            className="rounded-md border bg-slate-100 px-3 py-2 duration-150 hover:bg-slate-200  active:scale-[0.95]"
            // onClick={() => {
            //   handleKeyPress({ key: 'Enter' });
            // }}
          >
            Suchen
          </button>
        </div>
      </form>
    </div>
  );
};

export default FiltersSearchBar;
