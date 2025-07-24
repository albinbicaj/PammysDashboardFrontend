import { useState, useCallback, useEffect } from 'react';
import { returnsFilter as defaultSchema } from '../data/schemas/returnsFilter';
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to check if two filter objects are different
// const areFiltersDifferent = (tempFilters, filters) => {
//   return Object.keys(tempFilters).some((key) => tempFilters[key] !== filters[key]);
// };
const areFiltersDifferent = (tempFilters, filters) => {
  return Object.keys(tempFilters).some((key) => {
    const tempVal = tempFilters[key];
    const currVal = filters[key];

    const isTempEmpty = tempVal === '' || (Array.isArray(tempVal) && tempVal.length === 0);
    const isCurrEmpty = currVal === '' || (Array.isArray(currVal) && currVal.length === 0);

    if (isTempEmpty && isCurrEmpty) return false;

    if (Array.isArray(tempVal) && Array.isArray(currVal)) {
      return tempVal.join(',') !== currVal.join(',');
    }

    return tempVal !== currVal;
  });
};

const arrayFields = ['paymentMethod', 'searchTags', 'status'];

const useFilters = (schema = defaultSchema) => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to access the current URL
  // const fullPath = location.pathname + location.search;
  const fullPath = location.pathname;
  const [filters, setFilters] = useState(schema);
  const [tempFilters, setTempFilters] = useState(schema);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true); // Initially disabled

  const initializeFiltersFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = {};
    Object.keys(schema).forEach((key) => {
      const value = searchParams.get(key);

      // Handle array fields like paymentMethod
      // if ((key === 'paymentMethod' || key === 'searchTags') && value) {
      if (arrayFields.includes(key) && value) {
        newFilters[key] = value.split(',');
      } else if (typeof schema[key] === 'boolean') {
        newFilters[key] = value === 'true'; // cast string to boolean
      } else {
        newFilters[key] = value !== null ? value : schema[key];
      }
    });

    setFilters(newFilters);
    setTempFilters(newFilters);
  };

  useEffect(() => {
    initializeFiltersFromURL();
    // }, []);
  }, [location.search]); // Re-run when search parameters change

  useEffect(() => {
    // Check if tempFilters differ from filters and update button state
    const isDifferent = areFiltersDifferent(tempFilters, filters);
    setIsApplyDisabled(!isDifferent); // Enable button if there are differences
    // initializeFiltersFromURL();
  }, [tempFilters, filters]); // Dependencies to track

  // Update the URL with applied filters
  const updateURLWithFilters = (newFilters) => {
    const searchParams = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];

      // Handle array fields by joining them as comma-separated strings
      if (Array.isArray(value) && value.length > 0) {
        searchParams.append(key, value.join(','));
      } else if (typeof value === 'boolean') {
        searchParams.append(key, value.toString());
      } else if (value !== '') {
        searchParams.append(key, value);
      }
    });
    navigate(`${location?.pathname}?${searchParams.toString()}`);
    // navigate(`?${searchParams.toString()}`);
  };

  // Update a specific filter in both filters and tempFilters
  const updateFilter = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    const updatedTempFilters = { ...tempFilters, [key]: value };

    setFilters(updatedFilters);
    setTempFilters(updatedTempFilters);
    updateURLWithFilters(updatedTempFilters);
  };

  // Update multiple filters in both filters and tempFilters
  const updateFilters = (updatesObject) => {
    const updatedFilters = { ...filters };
    const updatedTempFilters = { ...tempFilters };

    Object.keys(updatesObject).forEach((key) => {
      updatedFilters[key] = updatesObject[key];
      updatedTempFilters[key] = updatesObject[key];
    });

    setFilters(updatedFilters);
    setTempFilters(updatedTempFilters);
    updateURLWithFilters(updatedTempFilters);
  };

  // Apply filters function
  const applyFilters = () => {
    const updatedFilters = { ...tempFilters, page: 1 }; // Ensure page is set to 1
    setFilters(updatedFilters);
    updateURLWithFilters(updatedFilters);
  };

  // Update temporary filters
  const updateTempFilters = useCallback((fieldsToUpdate) => {
    setTempFilters((prevTempFilters) => ({
      ...prevTempFilters,
      ...fieldsToUpdate,
    }));
  }, []);

  // Reset filters to default schema
  const resetFilters = () => {
    setFilters(schema);
    setTempFilters(schema);
    updateURLWithFilters(schema);
  };

  // Clear a specific filter field
  const clearFilter = (key) => {
    const updatedTempFilters = { ...tempFilters, [key]: '' };
    setTempFilters(updatedTempFilters);
    updateURLWithFilters(updatedTempFilters);
  };

  // Clear multiple filter fields
  const clearFilters = (keys) => {
    const updatedTempFilters = { ...tempFilters };
    keys.forEach((key) => {
      updatedTempFilters[key] = schema[key] || '';
    });
    setTempFilters(updatedTempFilters);
    updateURLWithFilters(updatedTempFilters);
  };

  return {
    filters,
    tempFilters,
    isApplyDisabled,
    updateFilters,
    updateTempFilters,
    applyFilters,
    resetFilters,
    clearFilter,
    clearFilters,
  };
};

export default useFilters;
