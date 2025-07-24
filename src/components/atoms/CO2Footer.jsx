import { t } from 'i18next';

export const CO2Footer = () => {
  return (
    <div className="mt-3 flex h-20 items-center justify-center gap-4 bg-white px-4">
      <div>
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
      <div className=" text-left">Pammys™ {t('returnPortalLayout.footerText')}</div>
    </div>
  );
};
