import { useState, useCallback, useEffect } from 'react';
import { returnsFilter as defaultSchema } from '../data/schemas/returnsFilter';
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to check if two filter objects are different
const areFiltersDifferent = (tempFilters, filters) => {
  return Object.keys(tempFilters).some((key) => tempFilters[key] !== filters[key]);
};

const useReturnsFilter = (schema = defaultSchema) => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to access the current URL
  const [filters, setFilters] = useState(schema);
  const [tempFilters, setTempFilters] = useState(schema);
  const [isApplyDisabled, setIsApplyDisabled] = useState(true); // Initially disabled

  const initializeFiltersFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = {};
    Object.keys(schema).forEach((key) => {
      const value = searchParams.get(key);

      // Handle array fields like paymentMethod
      if ((key === 'paymentMethod' || key === 'searchTags') && value) {
        newFilters[key] = value.split(',');
      } else {
        newFilters[key] = value !== null ? value : schema[key];
      }
    });

    setFilters(newFilters);
    setTempFilters(newFilters);
  };

  useEffect(() => {
    initializeFiltersFromURL();
  }, []);
  // }, [location.search]); // Re-run when search parameters change

  useEffect(() => {
    // Check if tempFilters differ from filters and update button state
    const isDifferent = areFiltersDifferent(tempFilters, filters);
    setIsApplyDisabled(!isDifferent); // Enable button if there are differences
  }, [tempFilters, filters]); // Dependencies to track

  // Update the URL with applied filters
  const updateURLWithFilters = (newFilters) => {
    const searchParams = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];

      // Handle array fields by joining them as comma-separated strings
      if (Array.isArray(value) && value.length > 0) {
        searchParams.append(key, value.join(','));
      } else if (value) {
        searchParams.append(key, value);
      }
    });

    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  // // Update the URL with applied filters
  // const updateURLWithFilters = (newFilters) => {
  //   const searchParams = new URLSearchParams();

  //   Object.keys(newFilters).forEach((key) => {
  //     if (newFilters[key]) {
  //       searchParams.append(key, newFilters[key]);
  //     }
  //   });

  //   navigate(`?${searchParams.toString()}`, { replace: true });
  // };

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
    const updatedFilters = { ...tempFilters, page: 1, filterOn: false }; // Ensure page is set to 1
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

export default useReturnsFilter;

// import { useState, useCallback } from 'react';
// import { returnsFilter as defaultSchema } from '../data/schemas/returnsFilter';
// import { useNavigate } from 'react-router-dom';

// const useReturnsFilter = (schema = defaultSchema) => {
//   const navigate = useNavigate();
//   // State to hold the current filters and temporary filters
//   const [filters, setFilters] = useState(schema);
//   const [tempFilters, setTempFilters] = useState(schema);

//   // Update the URL with applied filters
//   const updateURLWithFilters = (newFilters) => {
//     // Create a new URLSearchParams object
//     const searchParams = new URLSearchParams();

//     // Iterate through newFilters and append to searchParams
//     Object.keys(newFilters).forEach((key) => {
//       if (newFilters[key]) {
//         searchParams.append(key, newFilters[key]);
//       }
//     });

//     // Use navigate to replace the current history entry with the new filters
//     navigate(`?${searchParams.toString()}`, { replace: true });
//   };

//   // Update a specific filter in both filters and tempFilters
//   const updateFilter = (key, value) => {
//     const updatedFilters = { ...filters, [key]: value };
//     const updatedTempFilters = { ...tempFilters, [key]: value };

//     setFilters(updatedFilters);
//     setTempFilters(updatedTempFilters);
//     updateURLWithFilters(updatedTempFilters); // Optionally, update the URL
//   };

//   // Update multiple filters in both filters and tempFilters
//   const updateFilters = (updatesObject) => {
//     // Create copies of the current filters and tempFilters
//     const updatedFilters = { ...filters };
//     const updatedTempFilters = { ...tempFilters };

//     // Loop through the object to apply each key-value update
//     Object.keys(updatesObject).forEach((key) => {
//       updatedFilters[key] = updatesObject[key];
//       updatedTempFilters[key] = updatesObject[key];
//     });

//     // Set the updated filters and tempFilters
//     setFilters(updatedFilters);
//     setTempFilters(updatedTempFilters);

//     // Optionally update the URL with the new tempFilters
//     updateURLWithFilters(updatedTempFilters);
//   };

//   // Apply filters function
//   const applyFilters = () => {
//     setFilters(tempFilters);
//     updateURLWithFilters(tempFilters);

//     // if (onApplyFilters) {
//     //   onApplyFilters(tempFilters); // Call parent handler if provided
//     // }
//   };

//   // Update temporary filters
//   const updateTempFilters = useCallback((fieldsToUpdate) => {
//     setTempFilters((prevTempFilters) => ({
//       ...prevTempFilters,
//       ...fieldsToUpdate,
//     }));
//   }, []);

//   // Reset filters to default schema
//   const resetFilters = () => {
//     setFilters(schema);
//     setTempFilters(schema);
//     updateURLWithFilters(schema);

//     // if (onApplyFilters) {
//     //   onApplyFilters(schema); // Reset in parent if needed
//     // }
//   };

//   // Clear a specific filter field
//   const clearFilter = (key) => {
//     const updatedTempFilters = { ...tempFilters, [key]: '' };
//     setTempFilters(updatedTempFilters);
//     updateURLWithFilters(updatedTempFilters);
//   };

//   // Clear multiple filter fields
//   const clearFilters = (keys) => {
//     const updatedTempFilters = { ...tempFilters };
//     keys.forEach((key) => {
//       updatedTempFilters[key] = schema[key] || ''; // Reset to default schema value or empty string
//     });
//     setTempFilters(updatedTempFilters);
//     updateURLWithFilters(updatedTempFilters);
//   };

//   return {
//     filters,
//     tempFilters,
//     // setTempFilters,
//     updateFilters,
//     updateTempFilters,
//     applyFilters,
//     resetFilters,
//     clearFilter,
//     clearFilters,
//   };
// };

// export default useReturnsFilter;
