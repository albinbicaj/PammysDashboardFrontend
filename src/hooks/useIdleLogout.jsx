import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/Auth.context';

const useIdleLogout = (idleTime = 300000) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (user?.role_id !== 6) return;

    let idleTimeout;

    const resetIdleTimeout = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        setIsIdle(true);
        handleLogout();
      }, idleTime);
    };

    const handleLogout = () => {
      logout();
      // navigate('/dashboard/login');
    };

    const events = ['mousemove', 'keypress', 'scroll', 'click'];
    events.forEach((event) => {
      window.addEventListener(event, resetIdleTimeout);
    });

    resetIdleTimeout();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetIdleTimeout);
      });
      clearTimeout(idleTimeout);
    };
  }, [idleTime, logout, navigate, user]);

  return isIdle;
};

export default useIdleLogout;
