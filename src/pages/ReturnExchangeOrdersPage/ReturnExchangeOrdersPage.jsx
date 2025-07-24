import { ReturnExchangeOrder } from '../../components/organisms/Return/ReturnExchange';
import { ReturnLayout } from '../../components/template/ReturnLayout';
import useDocumentTitle from '../../components/useDocumentTitle';

const ReturnExchangeOrdersPage = () => {
  useDocumentTitle('Pammys™  Return & Exchange Orders');
  return (
    <ReturnLayout>
      <ReturnExchangeOrder />
    </ReturnLayout>
  );
};
export default ReturnExchangeOrdersPage;
