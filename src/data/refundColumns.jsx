import dayjs from 'dayjs';
import { convertToDE } from '../utils';
export const refundColumns = [
  {
    field: 'action',
    headerName: '',
    width: 45,
  },
  { id: 'id', field: 'barcode_number', headerName: 'Rücksendung', width: 320 },
  {
    field: 'created_at',
    headerName: 'Angemeldet',
    type: 'string',
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
    width: 120,
  },
  {
    field: 'full_name',
    headerName: 'Kunde',
    type: 'string',
    width: 120,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'string',
    width: 120,
  },
  {
    field: 'items',
    headerName: 'Artikel',
    width: 120,
    valueGetter: (params) => `Items: ${params.row.items}`,
  },
  {
    field: 'total_price',
    headerName: 'Betrag',
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
    width: 160,
  },
  {
    field: 'refund_type',
    headerName: 'Erstattungsart',
    type: 'string',
    width: 160,
  },
  {
    field: 'payment_method',
    headerName: 'Zahlungsanbieter',
    type: 'string',
  },
];
