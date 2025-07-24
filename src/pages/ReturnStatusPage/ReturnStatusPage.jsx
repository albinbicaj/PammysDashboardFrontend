import React, { useContext, useState } from 'react';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import useDocumentTitle from '../../components/useDocumentTitle';
import { ReturnStatus } from '../../components/organisms';
import { useOrderContext } from '../../context/Order.context';
import { ProductStatus } from '../../components/molecules';
const ReturnStatusPage = () => {
  const { orderContext } = useOrderContext();
 

  useDocumentTitle('Return Order Status');
  return (
    <ReturnLayout>
      <ProductStatus items={orderContext.requested_line_items} address={orderContext.shipping_address} />
    </ReturnLayout>
  );
};
export default ReturnStatusPage;
