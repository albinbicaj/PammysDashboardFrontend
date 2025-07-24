const statusOptions = [
  // { field: '', name: 'Alle' },
  { name: 'Canceled', field: 'canceled' },
  { name: 'Open', field: 'open' },
  { name: 'Abgeschlossen', field: 'completed' },
];

export const StatusArrayFilter = ({ filters = {}, updateFilters = () => {} }) => {
  const handleCheck = (status) => {
    console.log('handleCheck');
    console.log(status);
    const selectedIndex = filters.status.indexOf(status);
    let newSelected = [...filters.status];
    console.log('newSelected');
    console.log(newSelected);
    if (selectedIndex === -1) {
      newSelected.push(status);
    } else {
      newSelected.splice(selectedIndex, 1);
    }
    console.log('newSelected');
    console.log(newSelected);
    updateFilters({ status: newSelected });
  };

  const handleCheckAll = () => {
    const allStatusOptions = statusOptions.map((status) => status.field);
    console.log('allStatusOptions');
    console.log(allStatusOptions);
    if (allStatusOptions.length === filters.status.length) {
      updateFilters({ status: [] });
    } else {
      updateFilters({ status: [] });
    }
  };

  return (
    <div>
      <p className="pb-4 font-semibold">Status:</p>
      <div className="flex  flex-wrap items-center gap-2 ">
        <div
          onClick={() => {
            handleCheckAll();
          }}
          className={`btn btn-sm border ${
            filters.status.length === 0 || filters.status.length === statusOptions.length
              ? 'btn-primary'
              : ''
          }`}
        >
          Alle
        </div>
        {statusOptions.map((item, index) => (
          <div
            key={`tYJ3bb4kG5bbob1a-${index}`}
            className={`btn btn-sm border ${
              filters.status.indexOf(item.field) !== -1 || filters.status.length === 0
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
    </div>
  );
};
