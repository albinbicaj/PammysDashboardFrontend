import dayjs from 'dayjs';

export const stockColumns = [
  { id: 'id', field: 'id', headerName: 'ID', sort: true, width: 100 },
  { field: 'product_id', headerName: 'Produkt ID', width: 135 },
  {
    field: 'name',
    headerName: 'Produktname',
    type: 'string',
    sort: true,
    width: 160,
  },
  {
    field: 'variant_title',
    headerName: 'Variant',
    sort: true,
    width: 140,
  },
  {
    field: 'variant_id',
    headerName: 'Variant ID',
    type: 'string',
    sort: true,
    width: 160,
  },
  {
    field: 'quantity',
    headerName: 'Menge',
    type: 'string',
    sort: true,
    width: 160,
  },
  {
    field: 'created_at',
    headerName: 'Datum',
    type: 'string',
    sort: true,
    width: 380,
    valueGetter: (params) => {
      const formattedDate = dayjs(params.row.created_at).format('MMMM DD YYYY HH:mm');
      return `${formattedDate}`;
    },
  },
];
