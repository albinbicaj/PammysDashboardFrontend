import { IconArrowUp, IconX } from '@tabler/icons-react';
import { t } from 'i18next';
import React from 'react';

const ActiveFilters = ({ className = '', filters = {}, updateFilters = () => {} }) => {
  return (
    <div className={className}>
      <div className="col-span-2 ">
        {/* <p className="mb-3 text-xl"> Active Filters</p> */}
        <div className="flex flex-wrap gap-3">
          {/* <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
            Page: <span className="pl-2 font-medium">{filters.page}</span>
          </div> */}

          {filters?.sortWith !== '' ? (
            <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
              Sort:
              <span className="pl-2 font-medium">{t(`filters.${filters?.sortWith}`)}</span>
              <IconArrowUp
                size={20}
                className={`${filters.sortBy == 'asc' ? 'rotate-180' : ''}  ml-2 duration-100`}
              />
              <button
                className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                onClick={() => updateFilters({ sortWith: '' })}
              >
                <IconX size={20} />
              </button>
            </div>
          ) : null}
          {/*<div className="rounded-full border-2 border-accent bg-white px-4 py-2">Capsule</div> */}

          {filters?.startDate?.trim() !== '' || filters?.endDate?.trim() !== '' ? (
            <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
              Date: <span className="px-2 font-medium">{filters.startDate}</span> -
              <span className="pl-2 font-medium">{filters.endDate}</span>
              <button
                className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                onClick={() => updateFilters({ startDate: '', endDate: '' })}
              >
                <IconX size={20} />
              </button>
            </div>
          ) : null}
          {filters?.searchText?.trim() !== '' ? (
            <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
              Search text: <span className="pl-2 font-medium">{filters.searchText}</span>
              <button
                className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                onClick={() => updateFilters({ searchText: '' })}
              >
                <IconX size={20} />
              </button>
            </div>
          ) : null}
          {filters?.paymentMethod?.length > 0 ? (
            <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
              Payment:
              <div className="flex flex-wrap gap-2  divide-x font-medium">
                {filters.paymentMethod.map((item, index) => (
                  <span className="pl-2 pr-1" key={`tYJ3bb4kG-${index}`}>
                    {t(`filters.${item}`)}
                  </span>
                ))}
              </div>
              <button
                className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                onClick={() => updateFilters({ paymentMethod: [] })}
              >
                <IconX size={20} />
              </button>
            </div>
          ) : null}
          {filters?.searchTags?.length > 0 ? (
            <div className="flex items-center rounded-md border-2 border-accent bg-white px-3 py-1.5">
              Search tags:
              <div className="flex flex-wrap gap-2  divide-x font-medium">
                {filters.searchTags.map((item, index) => (
                  <span className="pl-2 pr-1" key={`tYJ3bb4kG-${index}`}>
                    {t(`${item}`)}
                  </span>
                ))}
              </div>
              <button
                className="translate-x-1.5 cursor-pointer text-gray-300 duration-150 hover:text-gray-800"
                onClick={() => updateFilters({ searchTags: [] })}
              >
                <IconX size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;
