import dayjs from 'dayjs';
import { convertToDE } from '../../utils';
export const damagedTable = [
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
  // {
  //   field: 'refund_type',
  //   headerName: 'Erstattungsart',
  //   //   headerName: 'Erstattungsart',
  //   type: 'string',
  //   width: 160,
  // },

  {
    field: 'payment_method',
    headerName: 'Zahlungs',
    type: 'string',
    sort: true,
  },
];

export const damagedTabs = {
  availableTabs: [
    { label: 'Alle', value: 'all', subValue: 'all' },
    { label: 'Offen', value: 'requested', subValue: '5' },
    { label: 'Support bestätigt', value: 'support' },
    { label: 'Akzeptiert', value: 'approved' },
    { label: 'Teilweise Akzeptiert', value: 'partially' },
    { label: 'Erstattet', value: 'refunded' },
    { label: 'Abgelehnt Support', value: 'rejected_support', subValue: '5' },
    { label: 'Abgelehnt Lager', value: 'rejected_lager', subValue: 'customer_contacted' },
    { label: 'Kontaktiert', value: 'contacted', subValue: '7' },
  ],
  availableSubTabs: {
    requested: [
      { label: 'Reklamation', value: '5' },
      { label: 'Falschlieferung', value: '7' },
      { label: 'Schadensanzeige', value: 'package_damaged' },
    ],
    rejected_support: [
      { label: 'Reklamation', value: '5' },
      { label: 'Falschlieferung', value: '7' },
    ],
    rejected_lager: [
      // { label: 'Kunde kontaktiert', value: 'all' },
      // { label: 'zu bearbeiten', value: 'customer_contacted' },
      // { label: 'An Kunden zurückgesendet', value: 'sent_back_to_customer' },
      // { label: 'Gespendet', value: 'donated' },
      { label: 'Kunde kontaktiert', value: 'customer_contacted' },
      { label: 'zu bearbeiten', value: 'to_edit' },
      { label: 'An Kunden zurückgesendet', value: 'sent_back_to_customer' },
      { label: 'Gespendet', value: 'donated' },
    ],
    rejected: [
      { label: 'Alle Abgelehnt', value: 'all' },
      { label: 'Kunde kontaktiert', value: 'customer_contacted' },
      { label: 'An Kunden zurückgesendet', value: 'sent_back_to_customer' },
      { label: 'Gespendet', value: 'donated' },
    ],
    contacted: [
      { label: 'Falschlieferung', value: '7' },
      { label: 'Reklamation', value: '5' },
      { label: 'Schadensanzeige', value: 'package_damaged' },
    ],
  },
};

// export const damagedTabs = {
//   availableTabs: [
//     { label: 'Alle', value: 'all', subValue: 'all' },
//     { label: 'Offen', value: 'requested', subValue: '5' },
//     { label: 'Support bestätigt', value: 'support' },
//     { label: 'Akzeptiert', value: 'approved' },
//     { label: 'Teilweise Akzeptiert', value: 'partially' },
//     { label: 'Erstattet', value: 'refunded' },
//     { label: 'Abgelehnt Support', value: 'rejected_support', subValue: '5' },
//     { label: 'Abgelehnt Lager', value: 'rejected_lager', subValue: 'customer_contacted' },
//   ],
//   availableSubTabs: {
//     requested: [
//       { label: 'Reklamation', value: '5' },
//       { label: 'Falschlieferung', value: '7' },
//       { label: 'Schadensanzeige', value: 'package_damaged' },
//     ],
//     rejected_support: [
//       { label: 'Reklamation', value: '5' },
//       { label: 'Falschlieferung', value: '7' },
//     ],
//     rejected_lager: [
//       { label: 'Kunde kontaktiert', value: 'customer_contacted' },
//       { label: 'zu bearbeiten', value: 'to_edit' },
//       { label: 'An Kunden zurückgesendet', value: 'sent_back_to_customer' },
//       { label: 'Gespendet', value: 'donated' },
//     ],
//     rejected: [
//       { label: 'Alle Abgelehnt', value: 'all' },
//       { label: 'Kunde kontaktiert', value: 'customer_contacted' },
//       { label: 'An Kunden zurückgesendet', value: 'sent_back_to_customer' },
//       { label: 'Gespendet', value: 'donated' },
//     ],
//   },
// };
