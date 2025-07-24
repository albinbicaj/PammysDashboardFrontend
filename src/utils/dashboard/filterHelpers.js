import dayjs from 'dayjs';

export const filterQuery = (filters = {}) => {
  const {
    startDate = '',
    endDate = '',
    sortBy = '',
    sortWith = '',
    paymentMethod = [],
    searchText = '',
    role = '',
    startTime = '',
    endTime = '',
    page = 1, // Default to the first page
    perPage = 15, // Default items per page
    // activeTab = 'all', // Default active tab
    // activeSubTab = 'all', // Default active sub-tab
    sku = '',
    barcode = '',
    product = '',
    commited = '',
    inventory = '',
    picklistStock = '',
    inPicklist = '',
  } = filters;

  const queryParts = [
    `page=${page}`,
    `pagination=${perPage}`,
    startDate ? `startDate=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    endDate ? `endDate=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    searchText && searchText.trim() !== '' ? `search=${encodeURIComponent(searchText)}` : null,
    role !== '' ? `role=${encodeURIComponent(role)}` : null,
    startTime !== '' && endTime !== '' ? `hours=${startTime},${endTime}` : null,
    sku.trim() !== '' ? `sku=${encodeURIComponent(sku)}` : null,
  ].filter(Boolean); // Filter out null values

  return queryParts.join('&');
};

export const filterQueryV2 = (filters = {}) => {
  const queryParts = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined) continue;

    const paramKey = key === 'perPage' ? 'paginate' : key;

    if (Array.isArray(value) && value.length > 0) {
      queryParts.push(`${paramKey}=${value.map(encodeURIComponent).join(',')}`);
    } else if (typeof value === 'string' && value.trim() !== '') {
      queryParts.push(`${paramKey}=${encodeURIComponent(value.trim())}`);
    } else if (typeof value === 'number' && !isNaN(value)) {
      queryParts.push(`${paramKey}=${value}`);
    } else if (key.toLowerCase().includes('date') && value) {
      queryParts.push(`${paramKey}=${dayjs(value).format('YYYY-MM-DD')}`);
    }
  }

  return queryParts.join('&');
};

// http://localhost:8000/api/product/all?
// &page=1
// &paginate=10
// &sku=a
// &barcode_number=a
// &title=b
// &reserved_stock=c
// &physical_stock=INVEN
// &picklist_stock=PICKLISTsTOC
// &reserved_picklist_stock=INpICKLIST
