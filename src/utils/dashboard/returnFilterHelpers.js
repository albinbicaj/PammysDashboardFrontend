import React, { useState } from 'react';
import dayjs from 'dayjs';

export const returnQuery = (filters = {}) => {
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
    `requested_type=return`,
    `page=${page}`,
    `pagination=${perPage}`,
    `status=${activeTab == 'rejected' ? 'rejected,partially' : activeTab}`,
    // Date filtering logic
    startDate && startDate.trim() !== ''
      ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}`
      : null,

    endDate && endDate.trim() !== '' ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    // Search text (use encodeURIComponent here since it may contain special characters)
    searchText && searchText.trim() !== '' ? `search=${encodeURIComponent(searchText)}` : null,
    // Payment method filter (encode as it's user input and may contain special characters)
    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,
    // Active sub-tab logic
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

    // return `status=rejected&support_status=rejected&reason=5,7${
    //     activeSubTab === 'customer_contacted'
    //       ? `&rejected_customer_notification='customer_contacted'`
    //       : activeSubTab === 'to_edit'
    //         ? `&rejected_customer_notification='to_edit'`
    //         : activeSubTab === 'sent_back_to_customer'
    //           ? `&rejected_customer_notification='sent_back_to_customer'`
    //           : activeSubTab === 'donated'
    //             ? `&current_status='donated'`
    //             : ''
    //   }`;
    // Sorting logic (no need to encode if these are predefined options)
    sortWith ? `sortBy=${sortBy}&sortWith=${sortWith}` : null,
  ].filter(Boolean); // Filter out null values

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
export const rejectedQuery = (filters = {}) => {
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
    // `requested_type=exchange`,
    `page=${page}`,
    `pagination=${perPage}`,
    activeTab == 'damaged' ? `reason=5,7` : `requested_type=${activeTab}`,
    'status=rejected,partially',
    // `status=${activeTab == 'rejected' ? 'rejected,partially' : activeTab}`,
    // `status=${activeTab == 'rejected' ? 'rejected,partially' : activeTab}`,
    startDate && startDate.trim() !== ''
      ? `start_date=${dayjs(startDate).format('YYYY-MM-DD')}`
      : null,
    endDate && endDate.trim() !== '' ? `end_date=${dayjs(endDate).format('YYYY-MM-DD')}` : null,
    searchText && searchText.trim() !== '' ? `search=${encodeURIComponent(searchText)}` : null,
    paymentMethod.length > 0
      ? `paymentMethods=${encodeURIComponent(paymentMethod.join(','))}`
      : null,
    activeSubTab !== 'alle' ? `rejected_customer_notification=${activeSubTab}` : null,

    // activeSubTab !== 'all'
    //   ? activeSubTab === 'customer_contacted'
    //     ? `rejected_customer_notification=customer_contacted`
    //     : activeSubTab === 'to_edit'
    //       ? `rejected_customer_notification=to_edit`
    //       : activeSubTab === 'sent_back_to_customer'
    //         ? `rejected_customer_notification=sent_back_to_customer`
    //         : activeSubTab === 'donated'
    //           ? `rejected_customer_notification=donated`
    //           : null
    //   : null,
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
