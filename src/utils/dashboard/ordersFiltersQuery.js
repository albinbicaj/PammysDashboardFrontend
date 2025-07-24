import dayjs from 'dayjs';
import { formatDate } from '../dateAndTime/formatDate';

export const ordersFiltersQuery = (filters = {}) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'asc',
    sortWith = '',
    monitor = false,

    order_name = '',
    from = '',
    costumer = '',

    startDate = '',
    endDate = '',
    date_exclude = false,

    tags = '',
    tag_exclude = false,

    barcode = '',
    barcode_exclude = false,
    barcode_strict = false,

    filter_address = '',
    filter_inventory = '',

    paymentMethod = [],
    payment = '',
    payment_exclude = false,

    status = [],
    status_exclude = false,

    shipping_method = '',
    shipping_method_exclude = false,

    incoming_inventory = false,
    address_exclude = false,
  } = filters;

  const queryParts = [
    `page=${page}`,
    `paginate=${perPage}`,

    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,

    order_name ? `order_name=${encodeURIComponent(order_name)}` : null,
    from ? `from=${encodeURIComponent(from)}` : null,
    costumer ? `costumer=${encodeURIComponent(costumer)}` : null,

    tags ? `tags=${encodeURIComponent(tags)}` : null,
    tags && tag_exclude ? `tag_exclude=true` : null,

    // startDate ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    // endDate ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    startDate ? `start_date=${formatDate(startDate, 'YYYY-MM-DD')}` : null,
    endDate ? `end_date=${formatDate(endDate, 'YYYY-MM-DD')}` : null,
    (startDate || endDate) && date_exclude ? `date_exclude=true` : null,

    barcode ? `barcode=${encodeURIComponent(barcode)}` : null,
    barcode && barcode_exclude ? `barcode_exclude=true` : null,
    barcode && barcode_strict ? `barcode_strict=true` : null,

    filter_address !== '' ? `filter_address=${filter_address}` : null,
    address_exclude ? `address_exclude=1` : null,

    filter_inventory !== '' ? `filter_inventory=${filter_inventory}` : null,

    paymentMethod.length > 0 ? `payment=${encodeURIComponent(paymentMethod.join(','))}` : null,
    paymentMethod.length > 0 && payment_exclude == true ? `payment_exclude=true` : null,

    status.length > 0 ? `statuses=${encodeURIComponent(status.join(','))}` : null,
    status.length > 0 && status_exclude ? `status_exclude=true` : null,

    shipping_method ? `shipping_method=${encodeURIComponent(shipping_method)}` : null,
    shipping_method && shipping_method_exclude ? `shipping_method_exclude=true` : null,

    incoming_inventory !== '' ? `incoming_inventory=${incoming_inventory}` : null,

    monitor ? `monitor=true` : null,
  ].filter(Boolean);

  return queryParts.join('&');
};
export const ordersFiltersQueryPrev = (filters = {}) => {
  const {
    // filterOn = false, // include only backend neccessary filters, this is for front state management
    page = 1,
    perPage = 10,
    sortBy = 'asc',
    sortWith = '',
    monitor = false,

    order_name = '',
    from = '',
    costumer = '',
    tags = '',
    shipping_method = '',
    status = [],
    payment = '',
    paymentMethod = [],

    startDate = '',
    endDate = '',
    date_exclude = false,

    tag_exclude = false,
    barcode = '',
    barcode_exclude = false,
    barcode_strict = false,
    filter_address = false,

    payment_exclude = false,
    address_exclude = false,
  } = filters;

  const queryParts = [
    `page=${page}`,
    `paginate=${perPage}`,

    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,

    order_name ? `order_name=${encodeURIComponent(order_name)}` : null,
    from ? `from=${encodeURIComponent(from)}` : null,
    costumer ? `costumer=${encodeURIComponent(costumer)}` : null,
    tags ? `tags=${encodeURIComponent(tags)}` : null,
    shipping_method ? `shipping_method=${encodeURIComponent(shipping_method)}` : null,
    // status ? `status=${encodeURIComponent(status)}` : null,
    payment ? `payment=${encodeURIComponent(payment)}` : null,
    // status.length > 0 ? `status=${encodeURIComponent(status.join(','))}` : null,

    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,

    startDate ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    endDate ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,

    date_exclude ? `date_exclude=true` : null,
    tag_exclude ? `tag_exclude=true` : null,

    barcode ? `barcode=${encodeURIComponent(barcode)}` : null,
    barcode_exclude ? `barcode_exclude=true` : null,
    barcode_strict ? `barcode_strict=true` : null,

    payment_exclude ? `payment_exclude=true` : null,
    address_exclude ? `address_exclude=1` : null,

    filter_address == true ? `filter_address=true` : null,
    monitor ? `monitor=true` : null,

    // filterOn ? `filter_on=true` : null,
  ].filter(Boolean);

  return queryParts.join('&');
};

export const exchangeQuery = (filters = {}) => {
  const {
    startDate = '',
    endDate = '',
    sortBy = '',
    sortWith = '',
    paymentMethod = [],
    searchText = '',
    page = 1, // Default to the first page
    perPage = 10, // Default items per page
    activeTab = 'all', // Default active tab
    activeSubTab = 'all', // Default active sub-tab
  } = filters;

  const queryParts = [
    `requested_type=exchange`,
    `page=${page}`,
    `pagination=${perPage}`,
    `status=${activeTab == 'rejected' ? 'rejected,partially' : activeTab}`,
    startDate && startDate.trim() !== ''
      ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}`
      : null,
    endDate && endDate.trim() !== '' ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    searchText && searchText.trim() !== '' ? `search=${encodeURIComponent(searchText)}` : null,
    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,
    activeSubTab !== 'all'
      ? activeSubTab === 'customer_contacted'
        ? `rejected_customer_notification=customer_contacted`
        : activeSubTab === 'to_edit'
          ? `rejected_customer_notification=to_edit`
          : activeSubTab === 'sent_back_to_customer'
            ? `rejected_customer_notification=sent_back_to_customer`
            : activeSubTab === 'donated'
              ? `rejected_customer_notification=donated`
              : null
      : null,
    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,
  ].filter(Boolean); // Filter out null values

  return queryParts.join('&');
};

export const damagedQuery = (filters = {}) => {
  const {
    startDate = '',
    endDate = '',
    sortBy = '',
    sortWith = '',
    paymentMethod = [],
    searchText = '',
    page = 1, // Default to the first page
    perPage = 10, // Default items per page
    activeTab = 'all', // Default active tab
    activeSubTab = 'all', // Default active sub-tab
  } = filters;

  const tabParams = (() => {
    switch (activeTab) {
      case 'support':
        return `status=all&support_status=approved&reason=5`;
      case 'rejected_support':
        return `status=rejected&support_status=${activeSubTab === '5' || activeSubTab === '7' ? 'rejected' : 'requested'}&reason=${activeSubTab}`;
      case 'all':
        return `status=all&reason=5,7`;
      case 'requested':
        return activeSubTab === 'package_damaged'
          ? 'status=requested&reason=5,7&package_damaged=true'
          : `status=requested&reason=${activeSubTab}`;
      case 'contacted':
        return activeSubTab === 'package_damaged'
          ? 'status=contacted&reason=5,7&package_damaged=true'
          : `status=contacted&reason=${activeSubTab}`;
      case 'approved':
        return 'status=approved&reason=5';
      case 'partially':
        return 'status=partially&reason=5';
      case 'refunded':
        return 'status=refunded&reason=5';
      case 'rejected_lager':
        return activeSubTab !== 'all'
          ? `status=rejected&support_status=rejected&reason=5,7&${
              activeSubTab === 'customer_contacted'
                ? `rejected_customer_notification=customer_contacted`
                : activeSubTab === 'to_edit'
                  ? `rejected_customer_notification=to_edit`
                  : activeSubTab === 'sent_back_to_customer'
                    ? `rejected_customer_notification=sent_back_to_customer`
                    : activeSubTab === 'donated'
                      ? `rejected_customer_notification=donated`
                      : null
            }`
          : null;
      default:
        return '';
    }
  })();

  const queryParts = [
    `page=${page}`,
    `pagination=${perPage}`,
    tabParams,
    startDate ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    endDate ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    searchText ? `search=${encodeURIComponent(searchText)}` : null,
    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,
    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,
  ].filter(Boolean);

  return `${queryParts.join('&')}`;
};

export const giftCardQuery = (filters = {}) => {
  const {
    startDate = '',
    endDate = '',
    sortBy = '',
    sortWith = '',
    paymentMethod = [],
    searchText = '',
    page = 1, // Default to the first page
    perPage = 10, // Default items per page
    activeTab = 'approved', // Default active tab
  } = filters;
  const queryParts = [
    `gift_card_offer=true`,
    `page=${page}`,
    `pagination=${perPage}`,
    `status=${activeTab}`,
    startDate ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    endDate ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    searchText ? `search=${encodeURIComponent(searchText)}` : null,
    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,
    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,
  ].filter(Boolean);

  return `${queryParts.join('&')}`;
};

export const refundQuery = (filters = {}) => {
  const {
    startDate = '',
    endDate = '',
    sortBy = '',
    sortWith = '',
    paymentMethod = [],
    searchText = '',
    page = 1, // Default to the first page
    perPage = 10, // Default items per page
    searchTags = [], // New property for search tags
  } = filters;
  const cleanedSearchText = searchText.startsWith('#') ? searchText.slice(1) : searchText;
  const queryParts = [
    `page=${page}`,
    `pagination=${perPage}`,
    cleanedSearchText.length > 0 ? `search=${encodeURIComponent(cleanedSearchText)}` : '',
    searchTags.length > 0 ? `tags=${encodeURIComponent(searchTags.join(','))}` : '',
    startDate ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}` : null,
    endDate ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    paymentMethod.length > 0 ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}` : '',
    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : '',
  ].filter(Boolean);

  return `${queryParts.join('&')}`;
};

export const archivedQuery = (filters = {}) => {
  const {
    sortBy = '',
    sortWith = '',
    searchText = '',
    page = 1, // Default to the first page
    pageSize = 10, // Default items per page
  } = filters;

  const queryParts = [
    `page=${page}`,
    `pagination=${pageSize}`,
    searchText ? `search=${encodeURIComponent(searchText)}` : '',
  ].filter(Boolean);

  return queryParts.join('&');
};
