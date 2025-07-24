import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageRedirector = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const supportedLanguages = ['en', 'es', 'fr']; // Me u shtu krejt gjuht e mundshme
  const defaultRedirect = '/retourenportal';

  useEffect(() => {
    const pathSlices = location.pathname.split('/');
    const potentialLang = pathSlices[1];

    if (supportedLanguages.includes(potentialLang)) {
      if (i18n.language !== potentialLang) {
        // i18n.changeLanguage('en');
        // localStorage.setItem('appLanguage', 'en');
        i18n.changeLanguage('de');
        localStorage.setItem('appLanguage', 'de');
      }
      navigate(defaultRedirect, { replace: true });
    } else {
      i18n.changeLanguage('de');
      localStorage.setItem('appLanguage', 'de');
      navigate(defaultRedirect, { replace: true });
    }
  }, [location, navigate, i18n]);

  return null;
};

export default LanguageRedirector;
