import { convertToDE } from '../../utils';
export const refundColumns = [
  {
    field: 'action',
    headerName: '',
    sort: false,
    width: 45,
  },
  { id: 'id', field: 'barcode_number', headerName: 'Rücksendung', sort: true, width: 320 },
  {
    field: 'created_at',
    headerName: 'Angemeldet',
    type: 'string',
    sort: true,
    width: 10,
    // valueGetter: (params) => {
    //   const formattedDate = dayjs(params.row.created_at).format('MMMM DD YYYY HH:mm');
    //   return `${formattedDate}`;
    // },
  },
  {
    field: 'refund_created_at',
    headerName: 'Bearbeitet',
    type: 'string',
    sort: true,
    width: 10,
    // valueGetter: (params) => {
    //   const formattedDate = dayjs(params.row.created_at).format('MMMM DD YYYY HH:mm');
    //   return `${formattedDate}`;
    // },
  },
  {
    field: 'order_number',
    headerName: 'Bestellung',
    type: 'string',
    sort: true,
    width: 120,
  },
  {
    field: 'full_name',
    headerName: 'Kunde',
    type: 'string',
    sort: true,
    width: 120,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    sort: true,
    width: 120,
  },
  {
    field: 'items',
    headerName: 'Artikel',
    sort: false,
    width: 120,
    valueGetter: (params) => `Items: ${params.row.items}`,
  },
  {
    field: 'total_price',
    headerName: 'Betrag',
    sort: false,
    width: 120,
    valueGetter: (params) => {
      const formattedPrice = convertToDE(params.row.total_price);
      return `${formattedPrice}`;
    },
  },
  {
    field: 'type',
    headerName: 'Rücksendeart',
    type: 'string',
    sort: true,
    width: 160,
  },
  {
    field: 'refund_type',
    headerName: 'Erstattungsart',
    type: 'string',
    sort: false,
    width: 160,
  },
  {
    field: 'payment_method',
    headerName: 'Zahlungsanbieter',
    type: 'string',
  },
];

export const refundTabs = {
  availableTabs: [{ label: 'Alle', value: 'all' }],
  // availableSubTabs: {
  //   approved: [
  //     // Add any relevant subtabs if needed
  //   ],
  //   partially: [
  //     // Add any relevant subtabs if needed
  //   ],
  // },
};
