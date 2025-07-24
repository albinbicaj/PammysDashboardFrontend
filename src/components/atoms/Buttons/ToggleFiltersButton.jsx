export const ToggleFiltersButton = ({ filterOn, updateFilters }) => {
  return (
    <div
      className={'btn ' + (filterOn ? 'btn-primary' : 'btn-secondary')}
      onClick={() => {
        updateFilters({ filterOn: !filterOn });
      }}
    >
      {filterOn ? 'Filter ausblenden' : 'Filter einblenden'}
    </div>
  );
};
