import { useContext, useState } from 'react';
import { ReturnMenu } from '../../components/organisms';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import { LoginLayout } from '../../components/template/LoginLayout';
const ReturnMenuPage = () => {
  return (
    <LoginLayout>
      {/* <p>Return Menu Page</p> */}
      <ReturnMenu />
    </LoginLayout>
  );
};
export default ReturnMenuPage;
