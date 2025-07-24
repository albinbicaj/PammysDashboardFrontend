import { NavLink } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../utils/axios';
import { useAuthContext } from '../../../context/Auth.context';
import { RoleEnum } from '../../../enums/Role.enum';
import { useModal } from '../../../context/UnhandledItemNotificationModalContext';

export const MenuItem = (props) => {
  const { path, icon, title, disabled, menu, showCount } = props;
  const { user } = useAuthContext();
  const { items, setShowModal } = useModal();
  const hasRequested = items.some((item) => item.status === 'requested');

  const { data } = useQuery({
    queryKey: ['BestellungenTotal'],
    queryFn: () => axiosInstance.get(`/order/get-order-count-shopify`),
    refetchInterval: 300000,
  });
  const showTotal = () => {
    if (data) {
      return data?.data?.order_count;
    }
  };

  if (disabled) {
    return (
      <div className="disabled-item flex cursor-default items-center gap-4 rounded-xl px-3 py-2.5 text-gray-700  hover:bg-gray-100 hover:text-black">
        <div className="">{icon}</div>
        <div className="">{title}</div>
      </div>
    );
  }

  if (showCount && (user.role_id === RoleEnum.ADMIN || user.role_id === RoleEnum.LAGERLEITER)) {
    return (
      <Tooltip title={`${menu ? '' : title}`} placement="right" arrow>
        <NavLink
          exact="true"
          to={path}
          onClick={(e) => {
            if (hasRequested && user.role_id === 7) {
              e.preventDefault();
              setShowModal(true);
            }
          }}
          className="enabled-item flex w-full items-center rounded-xl px-3 py-2.5  text-sm text-gray-700 !no-underline  duration-100 hover:bg-gray-100 hover:text-black"
        >
          <div className=" ">{icon}</div>
          <div
            className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden  font-medium duration-150`}
          >
            <div className="flex items-center justify-between">
              {title} <span className="rounded-full bg-slate-100 px-2  ">{showTotal()}</span>
            </div>
          </div>
        </NavLink>
      </Tooltip>
    );
  }
  return (
    <Tooltip title={`${menu ? '' : title}`} placement="right" arrow>
      <NavLink
        exact="true"
        to={path}
        onClick={(e) => {
          if (hasRequested && user.role_id === 7) {
            e.preventDefault();
            setShowModal(true);
          }
        }}
        className="enabled-item flex w-full items-center rounded-xl px-3 py-2.5  text-sm text-gray-700 !no-underline  duration-100 hover:bg-gray-100 hover:text-black"
      >
        <div className=" ">{icon}</div>
        <div
          className={`${menu ? 'line-clamp-2 w-52 ps-4' : 'line-clamp-1 w-0 ps-0'} overflow-hidden  font-medium duration-150`}
        >
          {title}
        </div>
      </NavLink>
    </Tooltip>
  );
};

export default MenuItem;
