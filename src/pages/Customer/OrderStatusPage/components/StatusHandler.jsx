export const FulfillmentStatus = ({ status = '' }) => {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return (
        <span className="pl-3 text-blue-500">
          📭 Open <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'fulfilled':
      return (
        <span className="pl-3 text-yellow-500">
          versendet <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'partially fulfilled':
      return (
        <span className="pl-3 text-yellow-500">
          🟡 Partially Fulfilled{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'restocked':
      return (
        <span className="pl-3 text-purple-500">
          🔄 Restocked{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'archived':
      return (
        <span className="pl-3 text-gray-500">
          📦 Archived <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'pending':
      return (
        <span className="pl-3 text-orange-500">
          ⏳ Pending <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'canceled':
      return (
        <span className="pl-3 text-red-500">
          ❌ Canceled <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'onhold':
      return (
        <span className="pl-3 text-yellow-700">
          ⏸️ On Hold <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'unfulfilled':
    default:
      return (
        <span className="pl-3 text-red-500">
          noch nicht verfügbar{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );
  }
};

//⏳ Unfulfilled            unfullfilled
//⏸️ On Hold
//❌ Canceled
//📦 Archived
//🔄 Restocked
//🟡 Partially Fulfilled
//✅ Fulfilled
//📭 Open

export const OrderShippingStatus = ({ status = '' }) => {
  switch ((status || '').toLowerCase()) {
    // switch (status) {
    case 'transit':
      return (
        <span className="pl-3 text-green-500">
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
          unterwegs
        </span>
      );

    case 'in warehouse':
      return (
        <span className="pl-3 text-purple-500">
          <span className="text-slate-200">{JSON.stringify(status)}</span>
          unterwegs
        </span>
      );

    case 'delivered':
      return (
        <span className="pl-3 text-green-500">
          <span className="text-slate-200">{JSON.stringify(status)}</span>
          zugestellt
        </span>
      );

    case 'warehouse':
      return (
        <span className="pl-3 text-green-500">
          <span className="text-slate-200">{JSON.stringify(status)}</span>
          unterwegs
        </span>
      ); // same as 'in warehouse'

    case 'in progress':
      return (
        <span className="pl-3 text-blue-500">
          🔄 In Progress{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'packed':
      return (
        <span className="pl-3 text-gray-500">
          📦 Packed <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );
    case 'pre-transit':
      return (
        <span className="pl-3 text-yellow-500">
          versendet <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'in waiting':
    default:
      return (
        <span className="pl-3 text-red-500">
          <span className="text-slate-200">{JSON.stringify(status)}</span>
          noch nicht verfügbar
        </span>
      );

    // default:
    //   return (
    //     <span className="pl-3 text-gray-500">
    //       ⚠️ Unknown Status{' '}
    //       <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
    //     </span>
    //   );
  }
};

export const ReturnStatus = ({ status = '' }) => {
  switch ((status || '').toLowerCase()) {
    case 'requested':
      return <span className="pl-3 text-blue-500">Rücksendung erhalten</span>;
    case 'refunded':
      return <span className="pl-3 text-blue-500">Rückerstattung abgeschlossen</span>;

    case 'in progress':
    default:
      return (
        <span className="pl-3 text-blue-500">
          <span className="text-slate-200">{JSON.stringify(status)}</span>
          Rücksendung angemeldet
        </span>
      );
  }
};

export const ShippingStatus = ({ status = '', trackingNumber = null }) => {
  if (trackingNumber) {
    return <span className="pl-3 text-green-500">{trackingNumber}</span>;
  }

  switch ((status || '').toLowerCase()) {
    // switch (status) {
    case 'in transit':
      return (
        <span className="pl-3 text-blue-500">
          🚚 In Transit{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'in warehouse':
      return (
        <span className="pl-3 text-purple-500">
          🏢 In Warehouse{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'delivered':
      return (
        <span className="pl-3 text-green-500">
          📦 Delivered{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'warehouse':
      return (
        <span className="pl-3 text-purple-500">
          🏢 Warehouse{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      ); // same as 'in warehouse'

    case 'in progress':
      return (
        <span className="pl-3 text-blue-500">
          🔄 In Progress{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'packed':
      return (
        <span className="pl-3 text-gray-500">
          📦 Packed <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    case 'in waiting':
    default:
      return (
        <span className="pl-3 text-yellow-500">
          ⏳ In Waiting{' '}
          <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
        </span>
      );

    // default:
    //   return (
    //     <span className="pl-3 text-gray-500">
    //       ⚠️ Unknown Status{' '}
    //       <span className="font-semibold text-slate-300">{JSON.stringify(status)}</span>
    //     </span>
    //   );
  }
};

// export const FulfillmentStatus = ({ status = '' }) => {
//   return <span className="pl-3 text-red-500">{JSON.stringify(status)} <span className="text-slatesemibold400 font-med3um">{JSON.stringify(status)}</span></span>;
// };
// export const ShippingStatus = ({ status = '' }) => {
//   return <span className="pl-3 text-red-500">{JSON.stringify(status)} <span className="text-slatesemibold400 font-med3um">{JSON.stringify(status)}</span></span>;
// };
