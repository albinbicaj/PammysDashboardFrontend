import React from 'react';
import { TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useHistory from react-router-dom
import { DeleteIcon, DeleteModal } from '../../atoms';
import { useAuthContext } from '../../../context/Auth.context';
import axiosInstance from '../../../utils/axios';
import { IconQrcode } from '@tabler/icons-react';
import { handleGenerateQRCode } from '../../../utils/qrCodeUtils';
export const UsersTable = ({
  page,
  setPage,
  setPageSize,
  pageSize,
  rows,
  columns,
  deleteUser,
  updateUserList,
}) => {
  const handleRoleChange = async (user_id, role_id) => {
    try {
      const response = await axiosInstance.put(`/dashboard/edit-role/${user_id}`, {
        role_id,
      });
      updateUserList();
    } catch (error) {}
  };
  const { user } = useAuthContext();
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // Call the onPageChange prop if provided
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
  };
  // const handleDelete = (row) => {
  //   deleteUser();
  //   //
  //   // Set userId as a query parameter and navigate to the same route
  //   navigate(`?userId=${row.id}`);
  // };
  return (
    <>
      <table className="w-full border-collapse  border bg-white text-sm">
        <thead className="text-left">
          <tr key="jPY6kNft">
            {columns.map((column, index) => (
              <th className="border  p-4" key={`6Uu9Pn13-${index}`}>
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`jPY6kNft-${index}`} className="border-b">
              {columns.map((column) => (
                <td key={`cell-${row.id}-${column.field}`} className="px-4 py-1">
                  {column.field === 'role_id' && user?.role_id == '1' ? (
                    <select
                      onChange={(e) => {
                        handleRoleChange(row.id, e.target.value);
                      }}
                      className="border-box border border-gray-300 px-2 py-2 text-xs font-medium leading-4 text-gray-800 focus:border-blue-600"
                      value={row[column.field]}
                    >
                      <option value="1">Admin</option>
                      <option value="2">User</option>
                      <option value="3">Support</option>
                      <option value="4">Lagerleiter</option>
                      <option value="5">Pick</option>
                      <option value="6">Pack</option>
                      <option value="7">Retoure</option>
                      <option value="8">IEM</option>
                    </select>
                  ) : column.field === 'role_id' && user?.role_id == '2' ? (
                    row[column.field] == '1' ? (
                      'Admin'
                    ) : (
                      'User'
                    )
                  ) : column.field === 'action' ? (
                    <div className="flex justify-between gap-3">
                      <div>
                        <button
                          className="btn border bg-gray-100 p-1"
                          onClick={() =>
                            handleGenerateQRCode(
                              row?.id,
                              `${row?.first_name}_${row?.last_name}_qr_code`,
                              row?.first_name,
                              row?.last_name,
                            )
                          }
                        >
                          <IconQrcode size={20} />
                        </button>
                      </div>
                      {user?.role_id == '1' && user?.id != row.id && (
                        <DeleteModal
                          buttonText={<DeleteIcon />}
                          confirmButton={() => deleteUser(row.id)}
                          className=""
                        />
                      )}
                    </div>
                  ) : (
                    <span>{row[column.field]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className=" flex items-center justify-center">
        <div className=" mr-auto flex items-center">
          <TablePagination
            component="div"
            count={rows.length}
            rowsPerPage={pageSize}
            page={page - 1}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Reihen pro Seite:"
          />
        </div>
      </div>
    </>
  );
};
