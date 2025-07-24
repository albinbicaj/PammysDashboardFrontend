import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTranslation } from 'react-i18next';

export const LoginLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnMenuPage = location.pathname === '/return-menu';
  const backgroundImg = 'url("/background.png")';
  const { t } = useTranslation();

  const styles = {
    // background: 'url("https://pw-backend.diesea.de/public/front-images/background.png")',
    background: 'url("/background.webp")',
    backgroundSize: 'cover', // You can customize these properties as needed
    backgroundRepeat: 'no-repeat',
  };
  const handleBackButton = () => {
    // Check if the current pathname is "/return-menu"
    if (location.pathname === '/return-menu') {
      navigate('/retourenportal');
    } else {
      navigate('/return-menu');
    }
  };
  return (
    <div
      className="login-layout flex h-screen flex-col items-end justify-center text-center "
      style={styles}
    >
      <div className="return-wrapper mt-5 flex flex-col items-center justify-start  border-b-2 bg-white text-center">
        <div className="mt-2 flex w-11/12 items-center justify-center border-b">
          {returnMenuPage && (
            <div className="mb-2 mr-5 cursor-pointer" onClick={handleBackButton}>
              <img src="/images/Group.svg" alt="" />
            </div>
          )}
          <img className="mb-2 mt-2 h-10" src="/Pammys_Logo_2024.webp" />
        </div>
        {children}
      </div>
      {location.pathname !== '/return-success' && (
        <div className="message mt-2 flex items-center justify-center bg-white ">
          <div className="ml-2 mr-1">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20.5" cy="20.5" r="19.5" fill="#E0FFE1" stroke="#98EF9B"></circle>
              <path
                d="M20.9168 28.0763C15.4386 29.1034 12.9908 26.342 12.3572 24.6524C8.50517 14.3808 23.77 10.1011 32.0443 10.5291C25.6246 12.669 27.7645 26.7923 20.9168 28.0763Z"
                fill="#50B153"
              ></path>
              <path
                d="M23.9114 15.6641C19.917 18.0893 11.8424 24.6517 11.5 31.4994"
                stroke="#38903D"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>
          <div className="pl-1 text-left"> Pammys™ {t('returnPortalLayout.footerText')}</div>
        </div>
      )}
    </div>
  );
};
