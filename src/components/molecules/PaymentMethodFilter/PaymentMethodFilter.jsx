import React, { useState } from 'react';
import { Chip } from '@mui/material';

const paymentMethods = [
  { name: 'Card', field: 'card' },
  { name: 'PayPal', field: 'paypal' },
  { name: 'Klarna', field: 'klarna' },
  { name: 'Gift Card', field: 'gift_card' },
  { name: 'Viva.com', field: 'Viva.com Smart Checkout' },
];

export const PaymentMethodFilter = ({ filters = {}, updateFilters = () => {}, hasTag = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const newTags = [...(filters.searchTags || []), inputValue.trim()];
      setInputValue('');
      updateFilters({ ...filters, searchTags: newTags });
    }
  };

  const handleTagDelete = (tagToDelete) => {
    const updatedTags = (filters.searchTags || []).filter((tag) => tag !== tagToDelete);
    updateFilters({ ...filters, searchTags: updatedTags });
  };

  const handleCheck = (payment) => {
    const selectedIndex = filters.paymentMethod.indexOf(payment);
    let newSelected = [...filters.paymentMethod];
    if (selectedIndex === -1) {
      newSelected.push(payment);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    updateFilters({ paymentMethod: newSelected });
  };

  const handleCheckAll = () => {
    const allPaymentMethods = paymentMethods.map((payment) => payment.field);
    if (allPaymentMethods.length === filters.paymentMethod.length) {
      updateFilters({ paymentMethod: [] });
    } else {
      updateFilters({ paymentMethod: allPaymentMethods });
    }
  };

  return (
    <div>
      <p className="pb-4 font-semibold">Zahlungsmethode:</p>
      <div className="flex  flex-wrap items-center gap-2 ">
        <div
          onClick={() => {
            handleCheckAll();
          }}
          className={`btn btn-sm border ${
            filters.paymentMethod.length === 0 ||
            filters.paymentMethod.length === paymentMethods.length
              ? 'btn-primary'
              : ''
          }`}
        >
          Alle
        </div>
        {paymentMethods.map((item, index) => (
          <div
            key={`tYJ3bb4kG5bbob1a-${index}`}
            className={`btn btn-sm border ${
              filters.paymentMethod.indexOf(item.field) !== -1 || filters.paymentMethod.length === 0
                ? 'bg-accent'
                : ''
            }`}
            //ktu osht opcioni me e bo me field value edhe me e track me event.value ne funksion
            onClick={() => {
              handleCheck(item.field);
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
      {hasTag && (
        <div className="mt-5 flex items-start justify-start">
          <input
            type="text"
            placeholder="Tags"
            className="tag-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
          <div className="flex flex-wrap gap-3 ps-5">
            {(Array.isArray(filters.searchTags) ? filters.searchTags : []).map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} />
            ))}
          </div>
          {/* <pre>{JSON.stringify(filters.searchTags)}</pre> */}
        </div>
      )}
    </div>
  );
};
