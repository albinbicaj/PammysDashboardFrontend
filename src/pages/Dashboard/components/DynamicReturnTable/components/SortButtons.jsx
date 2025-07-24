import { IconCaretUpFilled } from '@tabler/icons-react';

export const SortButtons = ({ filters = {}, updateFilters = () => {}, column = {} }) => {
  const handleSortBy = (sort) => {
    console.log(sort);
    if (filters.sortBy === sort.sortBy && filters.sortWith === sort.sortWith) {
      updateFilters({ sortBy: 'asc', sortWith: '' });
    } else {
      // If it doesn't match, update with the new sort
      updateFilters({
        sortBy: sort.sortBy,
        sortWith: sort.sortWith,
      });
    }
  };
  return (
    <div className="cursor-pointer">
      {/* Sort descending */}
      <div
        className={
          filters.sortBy === 'desc' && filters.sortWith === column.field
            ? 'rounded-md bg-accent text-black'
            : ''
        }
        onClick={() =>
          handleSortBy({
            sortBy: 'desc',
            sortWith: column.field,
          })
        }
      >
        <IconCaretUpFilled size={16} />
      </div>
      {/* Sort ascending */}
      <div
        className={
          filters.sortBy === 'asc' && filters.sortWith === column.field
            ? 'rounded-md bg-accent text-black'
            : ''
        }
        onClick={() =>
          handleSortBy({
            sortBy: 'asc',
            sortWith: column.field,
          })
        }
      >
        <IconCaretUpFilled className="rotate-180" size={16} />
      </div>
    </div>
  );
};
