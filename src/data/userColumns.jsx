import dayjs from 'dayjs';

export const userColumns = [
  {
    field: 'first_name',
    headerName: 'Vochname',
    type: 'string',
    sort: false,
    width: 160,
  },
  {
    field: 'last_name',
    headerName: 'Nachname',
    type: 'string',
    sort: false,
    width: 160,
  },
  {
    field: 'email',
    headerName: 'EMAIL',
    type: 'string',
    sort: false,
    width: 160,
  },
  {
    field: 'ip',
    headerName: 'IP ADDRESS',
    type: 'string',
    sort: false,
    width: 30,
  },
  {
    field: 'role_id',
    headerName: 'ROLLE',
    type: 'string',
    sort: false,
    width: 160,
  },
  {
    field: 'personio_employee_id',
    headerName: 'Personio ID',
    type: 'string',
    sort: false,
    // width: 160,
  },
  {
    field: 'action',
    headerName: 'ACTION',
  },
];
