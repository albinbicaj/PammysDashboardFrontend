import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import queryString from 'query-string';
import axios from '../../utils/axios';
import { Layout } from '../../components/template';
import useDocumentTitle from '../../components/useDocumentTitle';
import { userColumns } from '../../data/userColumns';
import { UsersTable } from '../../components/molecules';
import { FilterSearchBar, DeleteModal, FilterRole } from '../../components/atoms';
const DashboardUsersPage = () => {
  useDocumentTitle("Pammy's Dashboard Users");

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const parsed = queryString.parse(location.search);
  const pageQueryParam = parseInt(parsed.page, 100);
  const pageSizeQueryParam = parseInt(parsed.pageSize, 100);
  const [pageSize, setPageSize] = useState(!isNaN(pageSizeQueryParam) ? pageSizeQueryParam : 100); // Default to page size 10
  const [searchText, setSearchText] = useState(parsed.searchText || ''); // Initialize with the value from the query parameter
  const [page, setPage] = useState(!isNaN(pageQueryParam) ? pageQueryParam : 1); // Default to page 1
  const [role, setRole] = useState(parsed.role || '');
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const updateSearchTextQueryParam = (newSearchText) => {
    setSearchText(newSearchText);
    const updatedSearch = `page=${page}&pageSize=${pageSize}&role=${role}&searchText=${encodeURIComponent(
      newSearchText,
    )}`;
    navigate(`?${updatedSearch}`);
  };
  const updateRoleQueryParam = (newRole) => {
    setRole(newRole);
    const updatedSearch = `page=${page}&pageSize=${pageSize}&role=${newRole}&searchText=${encodeURIComponent(
      searchText,
    )}`;
    navigate(`?${updatedSearch}`);
  };
  const updatePageQueryParam = (newPage) => {
    setPage(newPage);
    const updatedSearch = `page=${newPage}&pageSize=${pageSize}&role=${role}&searchText=${encodeURIComponent(
      searchText,
    )}`;
    navigate(`?${updatedSearch}`);
  };

  // Function to update the pageSize query parameter and state
  const updatePageSizeQueryParam = (newPageSize) => {
    setPageSize(newPageSize);
    const updatedSearch = `page=${page}&pageSize=${newPageSize}&role=${role}&searchText=${encodeURIComponent(
      searchText,
    )}`;
    navigate(`?${updatedSearch}`);
  };
  const clearFilters = () => {
    setPage(1);
    setPageSize(10);
    setRole('');
    setSearchText('');
    fetchUsers();
    // Clear query parameters
    navigate(``);
  };
  const fetchUsers = async () => {
    setLoading(true);
    setLoadingMessage('Fetching users...');
    const res = await axios
      .get(
        `/dashboard/users?page=${page}&pagination=${pageSize}` +
          `${role !== '' ? `&role=${role}` : ''}` +
          `${searchText.length !== 0 ? `&keyword=${encodeURIComponent(searchText)}` : ''}`,
      )
      .then((response) => {
        const { data } = response;
        setUsers(data.data);
        setLoading(false);
        setLoadingMessage('');
      })

      .catch((error) => {
        setLoading(false);
        setLoadingMessage('');
        console.error(error);
      });
  };

  const deleteUser = async (userId) => {
    // const userId = parsed.userId;
    console.log('test');
    console.log(userId);
    setLoading(true);
    setLoadingMessage('Deleting user');
    try {
      const response = await axios.delete(`/dashboard/delete-user/${userId}`);
      setLoading(false);
      setLoadingMessage('');
      setDeleteModal(false);
      navigate('');
      fetchUsers();
    } catch (error) {}
  };
  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, role]);

  return (
    <div className="users-container">
      <div className="flex flex-col gap-5">
        <div className=" flex items-center gap-3 border bg-white p-4 ">
          <FilterSearchBar
            searchText={searchText}
            updateSearchText={updateSearchTextQueryParam}
            searchClick={fetchUsers}
            placeholder="Benutzer nach Name oder E-mail suchen"
          />
          <FilterRole updateRole={updateRoleQueryParam} role={role} />
          <div className="btn btn-secondary" onClick={clearFilters}>
            Filter löschen
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <p>{loadingMessage}</p>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Box>
          </div>
        ) : (
          <div className="border bg-white ">
            <UsersTable
              columns={userColumns}
              rows={users}
              page={page}
              setPage={updatePageQueryParam}
              pageSize={pageSize}
              setPageSize={updatePageSizeQueryParam}
              deleteUser={deleteUser}
              updateUserList={fetchUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardUsersPage;
