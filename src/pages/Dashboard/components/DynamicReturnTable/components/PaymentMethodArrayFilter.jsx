const paymentMethods = [
  { name: 'Card', field: 'card' },
  { name: 'PayPal', field: 'paypal' },
  { name: 'Klarna', field: 'klarna' },
  { name: 'Gift Card', field: 'gift_card' },
  { name: 'Viva.com', field: 'Viva.com Smart Checkout' },
];

export const PaymentMethodArrayFilter = ({ filters = {}, updateFilters = () => {} }) => {
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
    </div>
  );
};
