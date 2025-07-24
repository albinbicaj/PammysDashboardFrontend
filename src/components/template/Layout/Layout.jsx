import React from 'react';

import './Layout.css';

export const Layout = ({ children }) => {
  return <div className="h-full"> {children}</div>;
};

// import React, { useEffect, useState } from 'react';
// import SideBar from '../../organisms/Sidebar';
// import { UserModal } from '../../organisms';
// import { useLocation, useNavigate } from 'react-router-dom';
// import queryString from 'query-string';
// import { useAuthContext } from '../../../context/Auth.context';
// import { HeaderV2 } from '../../organisms/Header/HeaderV2';
// import './Layout.css';
// import { API_URL } from '../../../config/env';

// export const Layout = ({ children }) => {
//   const { user } = useAuthContext();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = queryString.parse(location.search);
//   const [isModalOpen, setIsModalOpen] = useState(queryParams.openModal === 'true');

//   // Use useEffect to update the modal state when the query parameters change
//   useEffect(() => {
//     setIsModalOpen(queryParams.openModal === 'true');
//   }, [location.search]);

//   // Function to close the modal and remove 'openModal' from query parameters
//   const handleCloseModal = () => {
//     const updatedParams = { ...queryParams };
//     delete updatedParams.openModal;

//     // Convert the updated parameters back to a query string
//     const updatedQueryString = queryString.stringify(updatedParams);

//     // Update the browser's location with the new query string
//     navigate(`${location.pathname}?${updatedQueryString}`);

//     // Close the modal
//     setIsModalOpen(false);
//   };

//   return (
//     <div>
//       <div
//         className={
//           'flex h-screen  ' + (API_URL === 'https://pw-backend.diesea.de/api' ? 'pt-16' : 'pt-20')
//         }
//       >
//         <div className=" h-full w-[240px] overflow-y-auto border-r bg-white ">
//           <SideBar />
//         </div>
//         <main className="flex-1 overflow-auto p-4">
//           {/* <div className="h-full min-w-[800px] max-w-[1700px]">{children}</div> */}
//           <div className="h-full ">{children}</div>
//         </main>

//         {user?.role_id === 1 && <UserModal open={isModalOpen} handleClose={handleCloseModal} />}
//       </div>
//       <HeaderV2 />
//     </div>
//   );
// };
