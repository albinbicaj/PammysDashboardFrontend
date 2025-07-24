import React, { useCallback, useState, useRef } from 'react';
import Select from 'react-select';
import ProductSearchModal from './Modal/ProductSearchModal';
import { Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ReturnFilters = ({ updateFilters, filters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [uniqueEntries, setUniqueEntries] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const inputRef = useRef(null);

  const returnTypeOptions = [
    { value: 'return', label: 'Rückgabe' },
    { value: 'exchange', label: 'Umtausch' },
  ];

  const returnReasonOptions = [
    { value: '1', label: 'Zu klein' },
    { value: '2', label: 'Zu groß' },
    { value: '3', label: 'Gefällt mir nicht' },
    { value: '4', label: 'Qualität unzureichend' },
    { value: '5', label: 'Beschädigt' },
    { value: '6', label: 'Lieferung zu spät' },
    { value: '7', label: 'Falschlieferung / fehlender Artikel' },
  ];

  const getTextValue = (item) => {
    switch (filterType) {
      case 'product_title':
        return item.product_name;
      case 'product_id':
        return item.product_id;
      case 'variant_title':
        return item.variant_title;
      case 'sku':
        return item.sku;
      case 'barcode':
        return item.barcode;
      case 'variant_id':
        return item.variant_id;
      default:
        return `${item.product_name} - ${item.variant_title}`;
    }
  };

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsModalOpen(!!value);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const handleSelectChange = (selectedOption, { name }) => {
    updateFilters({
      [name]: selectedOption ? selectedOption.value : '',
    });
  };

  const handleAddSelectedVariants = (selectedItems) => {
    const newItems = [];
    const updatedSet = new Set(uniqueEntries);

    selectedItems.forEach((item) => {
      const textValue = getTextValue(item);
      if (!updatedSet.has(textValue)) {
        updatedSet.add(textValue);
        newItems.push(item);
      }
    });

    const updatedTitles = [...selectedTitles, ...newItems];
    setSelectedTitles(updatedTitles);
    setUniqueEntries(updatedSet);
    updateFilters({ search: updatedTitles, filterType });
    setIsModalOpen(false);
  };

  const handleRemoveTitle = (textToRemove) => {
    const updatedTitles = selectedTitles.filter((item) => getTextValue(item) !== textToRemove);
    const updatedSet = new Set(uniqueEntries);
    updatedSet.delete(textToRemove);

    setSelectedTitles(updatedTitles);
    setUniqueEntries(updatedSet);
    updateFilters({ search: updatedTitles });
  };

  const handleClearAll = () => {
    setSelectedTitles([]);
    setUniqueEntries(new Set());
    updateFilters({ search: [] });
  };

  return (
    <div className="solid flex border-spacing-1 flex-col gap-4 border bg-[#fff] p-4">
      <h2 className="font-poppins text-s font-medium text-[rgb(58,55,55)]">
        Which one are you looking for?
      </h2>
      <div>
        <input
          type="text"
          name="searchQuery"
          placeholder="Search a product or sku of a product"
          onChange={handleSearchChange}
          ref={inputRef}
          className="w-full rounded border p-2"
        />
        {isModalOpen && (
          <ProductSearchModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSearchQuery('');
            }}
            onAdd={handleAddSelectedVariants}
            searchQuery={searchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTitles.map((item) => (
            <Chip
              key={getTextValue(item)}
              label={getTextValue(item)}
              onDelete={() => handleRemoveTitle(getTextValue(item))}
              deleteIcon={<CloseIcon style={{ fontSize: 16, color: '#000' }} />}
              variant="outlined"
              sx={{
                borderRadius: 1,
                border: '2px solid rgb(255 204 102 / 1)',
                backgroundColor: '#fff',
                color: '#000',
                '& .MuiChip-deleteIcon': {
                  color: '#000',
                },
              }}
            />
          ))}
        </div>

        {selectedTitles.length > 0 && (
          <button onClick={handleClearAll} className="btn btn-secondary mt-2">
            Clear All
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <Select
          name="typeId"
          options={returnTypeOptions}
          onChange={handleSelectChange}
          className="w-full"
          classNamePrefix="select"
          isSearchable
          isClearable
          placeholder="Select Return Type"
          value={returnTypeOptions.find((opt) => opt.value === filters?.typeId) || null}
        />
        <Select
          name="reasonId"
          options={returnReasonOptions}
          onChange={handleSelectChange}
          className="w-full"
          classNamePrefix="select"
          isSearchable
          isClearable
          placeholder="Select Return Reason"
          value={returnReasonOptions.find((opt) => opt.value === filters?.reasonId) || null}
        />
      </div>
    </div>
  );
};

export default ReturnFilters;
