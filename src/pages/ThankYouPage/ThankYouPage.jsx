import React from 'react';
import useDocumentTitle from '../../components/useDocumentTitle';
import { LoginLayout } from '../../components/template/LoginLayout';
const ThankYouPage = () => {
  useDocumentTitle('Pammys™  Retourenportal');
  return (
    <LoginLayout>
      <h1 className="mt-2">Thank you!</h1>;
    </LoginLayout>
  );
};
export default ThankYouPage;
