import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../../context/Auth.context';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const { login, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { t, i18n } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true when submitting
    await login(email, password);
    setIsLoading(false); // Set loading state to false after login attempt
  };

  useEffect(() => {
    setIsLoading(false); // Reset loading state if component unmounts or updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center  bg-white p-8">
      {/* <div className={`${isLoading ? '' : ''} mb-5 flex w-[70px]  overflow-hidden duration-100`}>
        <img className="max-w-64 bg-cover" src="/Pammys_Logo_2024.webp" alt="Pummy's Logo." />
      </div> */}
      <div className="pb-8">
        <img className="w-36 bg-cover" src="/images/new/logo-new.svg" alt="Pammy's Logo." />
      </div>

      {/* {error && error.length !== 0 && (
        <CustomSnackBar severity={'info'} message={error} duration={4000} />
      )} */}

      <div className="flex w-80 flex-col justify-center gap-7">
        <div className="text-center text-xl font-bold">{t('login-to-pammys')}</div>
        <form className="flex  flex-col items-center justify-center gap-5">
          <div className="flex w-full flex-col gap-3">
            <input
              required
              id="input-email"
              // className="input-email py-7px focus:border-blue-675 box-border border bg-white px-4 focus:border focus:outline-none"
              className="input-login"
              autoComplete="email"
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              id="password"
              type="password"
              className="input-login"
              autoComplete="current-password"
              placeholder="Passwort"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link
          to="/dashboard/login-warehouse"
          className="text-center text-sm text-slate-400 underline"
        >
          Login as Warehouse Employee
        </Link>
      </div>
    </div>
  );
};
