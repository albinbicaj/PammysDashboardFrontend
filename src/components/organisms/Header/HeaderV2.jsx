import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/Auth.context';
import { ENVIRONMENT } from '../../../config/env';
import { GeneralAccessibility } from '../GeneralAccessibility/GeneralAccessibility';
import ScannerDetector from '../ScannerDetector/ScannerDetector';
import { RoleEnum } from '../../../enums/Role.enum';
import { PackCount } from '../../atoms/PackCount/PackCount';
import { useModal } from '../../../context/UnhandledItemNotificationModalContext';

export const HeaderV2 = ({ menu, toggleMenu }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { items, setShowModal } = useModal();

  const handleLogoClick = () => {
    const hasRequested = items.some((item) => item.status === 'requested');
    if (hasRequested && user?.role_id === 7) {
      setShowModal(true);
      return;
    }
    navigate('/dashboard/return');
  };

  const handleProfileClick = () => {
    const hasRequested = items.some((item) => item.status === 'requested');
    if (hasRequested && user?.role_id === 7) {
      setShowModal(true);
      return;
    }
    navigate('/dashboard/profile');
  };

  return (
    <div className="fixed left-0 top-0 w-full bg-white ">
      {ENVIRONMENT !== 'production' && (
        <div className="flex h-4 items-center justify-center bg-green-500 text-center text-[14px] font-bold tracking-[20px]  text-white">
          <p>DEVELOPMENT</p>
        </div>
      )}
      <nav className="flex  h-16 w-full    text-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex h-16 items-center  px-4">
            <div
              className={`cursor-pointer duration-150 ${menu ? 'rotate-0' : 'rotate-90'}`}
              onClick={() => {
                toggleMenu();
              }}
            >
              <img src="/images/pammys-icon.svg" className=" h-8 w-8" />
            </div>
            <div onClick={handleLogoClick} className="cursor-pointer">
              <img src="/images/new/logo-new.png" className="w-32 pl-3 pt-2" />
            </div>
          </div>

          <div>{user?.role_id === RoleEnum.PACK ? <PackCount /> : <GeneralAccessibility />}</div>
          <ScannerDetector />

          <div className="px-4">
            <div
              onClick={handleProfileClick}
              to="/dashboard/profile"
              className="items-left text-grey-darkest hover:text-blue-dark ml-2 flex cursor-pointer flex-col text-lg !no-underline"
            >
              <span className="text-right  font-semibold leading-5 text-gray-800 ">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-right  text-xs font-normal leading-5 text-gray-600 ">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
